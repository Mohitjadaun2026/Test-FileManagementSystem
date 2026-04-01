import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Subscription, forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FileLoadService } from '../../services/file-load.service';

interface UploadItem {
file: File;
progress: number;
state: 'queued' | 'uploading' | 'done' | 'error' | 'canceled';
selected?: boolean;
sub?: Subscription;
}

const UPLOADS_STORAGE_KEY = 'fileUploadQueue';
const MAX_FILES = 100;

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

constructor(
    private api: FileLoadService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  get acceptedFileHint(): string {
    return `CSV only · max 20 MB`;
  }

  get isUploading(): boolean {
    return this.uploads.some(u => u.state === 'uploading');
  }

  get overallProgress(): number {
    if (!this.uploads.length) return 0;
    const total = this.uploads.reduce((acc, u) => acc + (u.progress || 0), 0);
    return Math.round(total / this.uploads.length);
  }

  onFileSelected(ev: Event) {
    const target = ev.target as HTMLInputElement;
    const files = target.files;
    if (!files?.length) return;
    this.queueFiles(Array.from(files));
    target.value = '';
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    this.isOver = false;
    const files = ev.dataTransfer?.files;
    if (files?.length) this.queueFiles(Array.from(files));
  }

  onDragOver(ev: DragEvent) { ev.preventDefault(); this.isOver = true; }
  onDragLeave() { this.isOver = false; }

  private isValidFile(file: File): boolean {
    const lower = file.name.toLowerCase();
    const hasAllowedExtension = this.acceptedExtensions.some(ext => lower.endsWith(ext));
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

  private queueFiles(files: File[]) {
    if (this.uploads.length + files.length > MAX_FILES) {
      this.snack.open(`You can upload a maximum of ${MAX_FILES} files at once. You selected ${files.length}.`, 'Dismiss', { duration: 5000 });
      return;
    }

    for (const file of files) {
      if (!this.isValidFile(file)) continue;
      this.uploads.push({ file, progress: 0, state: 'queued' });
    }
    this.updateAndPersistUploads();
  }

  startUploads() {
    if (!this.uploads.length || this.isUploading) return;

    const tags = this.tagsText.split(',').map(t => t.trim()).filter(Boolean);
    const extra = { description: this.description || undefined, tags: tags.length ? tags : undefined };

    const uploadObservables = this.uploads.map(u => {
      u.state = 'uploading';
      u.progress = 0;
      return this.api.upload(u.file, extra).toPromise().then(() => {
        u.progress = 100;
        u.state = 'done';
      }).catch(() => {
        u.progress = 0;
        u.state = 'error';
      });
    });

    // Upload all in parallel
    Promise.all(uploadObservables).then(() => {
      this.updateAndPersistUploads();
      this.snack.open(`All files uploaded successfully!`, 'OK', { duration: 3000 });
      this.uploads = []; // auto-clear queue
      localStorage.removeItem(UPLOADS_STORAGE_KEY);
      this.router.navigate(['/files'], { queryParams: { refresh: Date.now() } });
    });
  }

  triggerFilePick() {
    this.fileInput.nativeElement.click();
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
      const arr = JSON.parse(raw);
      this.uploads = arr.map((item: any) => ({
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

  ngOnInit() {
    this.restoreUploadsFromStorage();
  }
}

