import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FileLoadService } from '../../services/file-load.service';

interface UploadItem {
file: File;
progress: number;
state: 'queued' | 'uploading' | 'done' | 'error' | 'canceled';
selected?: boolean;
sub?: Subscription;
startedAt?: number;
finishTimer?: ReturnType<typeof setTimeout>;
}

interface UploadItemPersisted {
name: string;
size: number;
type: string;
lastModified: number;
progress: number;
state: 'queued' | 'uploading' | 'done' | 'error' | 'canceled';
selected?: boolean;
}

const UPLOADS_STORAGE_KEY = 'fileUploadQueue';
const MAX_FILES_PER_BATCH = 100;

@Component({
selector: 'app-file-upload',
templateUrl: './file-upload.component.html',
styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
@ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

readonly maxFileSizeBytes = 20 * 1024 * 1024;
readonly acceptedExtensions = ['.csv'];
readonly acceptedMimeTypes = ['text/csv'];

uploads: UploadItem[] = [];
description = '';
tagsText = '';
isOver = false;
private readonly minVisibleUploadMs = 2200;
private redirectAfterUpload = true;

constructor(
    private api: FileLoadService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  get acceptedFileHint(): string {
    return `CSV only · max 20 MB`;
  }

  get isUploading(): boolean {
    return this.uploads.some((u) => u.state === 'uploading');
  }

  get overallProgress(): number {
    if (!this.uploads.length) return 0;
    const total = this.uploads.reduce((acc, u) => acc + (u.progress || 0), 0);
    return Math.round(total / this.uploads.length);
  }

  get overallStatusText(): string {
    const done = this.uploads.filter((u) => u.state === 'done').length;
    const failed = this.uploads.filter((u) => u.state === 'error').length;
    const canceled = this.uploads.filter((u) => u.state === 'canceled').length;

    if (this.isUploading) return `Uploading files... ${this.overallProgress}%`;
    if (done || failed || canceled) {
      return `Completed: ${done} successful, ${failed} failed, ${canceled} canceled`;
    }
    return 'Ready to upload';
  }

  get selectedCancelableCount(): number {
    return this.uploads.filter(
      (u) => u.selected && (u.state === 'queued' || u.state === 'uploading')
    ).length;
  }

  get allSelected(): boolean {
    return this.uploads.length > 0 && this.uploads.every(u => u.selected);
  }

  get someSelected(): boolean {
    return this.uploads.some(u => u.selected) && !this.allSelected;
  }

  get selectedCount(): number {
    return this.uploads.filter(u => u.selected).length;
  }

  get anySelected(): boolean {
    return this.selectedCount > 0;
  }

  toggleSelectAll(checked: boolean) {
    for (const u of this.uploads) {
      u.selected = checked;
    }
  }

  onFileSelected(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const files = target.files;
    if (!files?.length) return;

    if (files.length + this.uploads.length > MAX_FILES_PER_BATCH) {
      this.snack.open(`You can upload a maximum of ${MAX_FILES_PER_BATCH} files at once. You selected ${files.length}.`, 'OK', { duration: 4000 });
      target.value = '';
      return;
    }

    this.queueFiles(Array.from(files));
    target.value = '';
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.isOver = false;

    const files = ev.dataTransfer?.files;
    if (!files?.length) return;

    if (files.length + this.uploads.length > MAX_FILES_PER_BATCH) {
      this.snack.open(`You can upload a maximum of ${MAX_FILES_PER_BATCH} files at once. You selected ${files.length}.`, 'OK', { duration: 4000 });
      return;
    }

    this.queueFiles(Array.from(files));
  }

  onDragOver(ev: DragEvent) {
    ev.preventDefault();
    this.isOver = true;
  }

  onDragLeave() {
    this.isOver = false;
  }

  private isValidFile(file: File): boolean {
    const lower = file.name.toLowerCase();
    const hasAllowedExtension = this.acceptedExtensions.some((ext) => lower.endsWith(ext));
    const hasAllowedMime = !file.type || this.acceptedMimeTypes.includes(file.type);

    if (!(hasAllowedExtension && hasAllowedMime)) {
      this.snack.open(`Only CSV files are allowed: ${file.name}`, 'Dismiss', { duration: 3500 });
      return false;
    }

    if (file.size > this.maxFileSizeBytes) {
      this.snack.open(`File exceeds 20 MB limit: ${file.name}`, 'Dismiss', { duration: 3500 });
      return false;
    }

    return true;
  }

  queueFiles(files: File[]) {
    for (const file of files) {
      if (!this.isValidFile(file)) continue;
      this.uploads.push({
        file,
        progress: 0,
        state: 'queued',
        selected: false
      });
    }
    this.updateAndPersistUploads();
  }

  startUploads() {
    if (this.isUploading) return;

    // Start all queued uploads in parallel
    for (const u of this.uploads.filter(u => u.state === 'queued')) {
      this.uploadFile(u);
    }
  }

  private uploadFile(item: UploadItem) {
    const tags = this.tagsText
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const extra = {
      description: this.description || undefined,
      tags: tags.length ? tags : undefined
    };

    item.state = 'uploading';
    item.progress = 3;
    item.startedAt = Date.now();

    item.sub = this.api.upload(item.file, extra).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            item.progress = Math.min(96, Math.round((100 * event.loaded) / event.total));
          } else {
            item.progress = Math.min(90, item.progress + 7);
          }
        } else if (event.type === HttpEventType.Response) {
          item.progress = 100;
          item.state = 'done';
          this.updateAndPersistUploads();

          // Check if all done
          if (this.uploads.every(u => u.state === 'done')) {
            this.snack.open(`All ${this.uploads.length} files uploaded successfully`, 'OK', { duration: 3000 });

            // Auto-clear queue
            setTimeout(() => {
              this.clearDone();
            }, 1000);
          }
        }
      },
      error: () => {
        item.state = 'error';
        this.updateAndPersistUploads();
      },
      complete: () => {
        item.sub = undefined;
      }
    });
  }

  cancelUpload(item: UploadItem) {
    if (item.state !== 'uploading' && item.state !== 'queued') return;

    if (item.finishTimer) {
      clearTimeout(item.finishTimer);
      item.finishTimer = undefined;
    }

    item.sub?.unsubscribe();
    item.sub = undefined;
    item.state = 'canceled';
    item.progress = 0;
    item.selected = false;
    this.updateAndPersistUploads();
  }

  cancelSelected() {
    const selected = this.uploads.filter(u => u.selected && (u.state === 'queued' || u.state === 'uploading'));
    selected.forEach(item => this.cancelUpload(item));
  }

  clearDone() {
    this.uploads = this.uploads.filter(u => u.state !== 'done' && u.state !== 'error' && u.state !== 'canceled');
    this.updateAndPersistUploads();
  }

  removeSelected() {
    this.uploads = this.uploads.filter(u => !u.selected);
    this.updateAndPersistUploads();
  }

  triggerFilePick() {
    this.fileInput.nativeElement.click();
  }

  ngOnInit() {
    this.restoreUploadsFromStorage();
  }

  private persistUploadsToStorage() {
    const persisted = this.uploads.map(u => ({
      name: u.file?.name,
      size: u.file?.size,
      type: u.file?.type,
      lastModified: u.file?.lastModified,
      progress: u.progress,
      state: u.state,
      selected: u.selected
    }));
    localStorage.setItem(UPLOADS_STORAGE_KEY, JSON.stringify(persisted));
  }

  private restoreUploadsFromStorage() {
    const raw = localStorage.getItem(UPLOADS_STORAGE_KEY);
    if (!raw) return;
    try {
      const arr: UploadItemPersisted[] = JSON.parse(raw);
      this.uploads = arr.map(item => ({
        file: { name: item.name, size: item.size, type: item.type, lastModified: item.lastModified } as File,
        progress: item.progress,
        state: item.state,
        selected: item.selected
      }));
    } catch {}
  }

  private updateAndPersistUploads() {
    this.persistUploadsToStorage();
  }
}