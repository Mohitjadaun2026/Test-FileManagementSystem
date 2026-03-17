import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileLoadService } from '../../services/file-load.service';

interface UploadItem {
  file: File;
  progress: number;
  state: 'queued' | 'uploading' | 'done' | 'error' | 'canceled';
  sub?: Subscription;
  startedAt?: number;
  finishTimer?: ReturnType<typeof setTimeout>;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  readonly maxFileSizeBytes = 10 * 1024 * 1024;
  readonly acceptedExtensions = ['.csv', '.txt', '.xml', '.xls', '.xlsx'];
  readonly acceptedMimeTypes = [
    'text/csv',
    'text/plain',
    'application/xml',
    'text/xml',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  uploads: UploadItem[] = [];
  description = '';
  tagsText = '';
  isOver = false;
  private readonly minVisibleUploadMs = 2200;

  constructor(private api: FileLoadService, private snack: MatSnackBar) {}

  get acceptedFileHint(): string {
    return `${this.acceptedExtensions.join(', ')} · max 10 MB`;
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
    if (done || failed || canceled) return `Completed: ${done} successful, ${failed} failed, ${canceled} canceled`;
    return 'Ready to upload';
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
      this.snack.open(`Unsupported file type: ${file.name}`, 'Dismiss', { duration: 3500 });
      return false;
    }
    if (file.size > this.maxFileSizeBytes) {
      this.snack.open(`File is too large: ${file.name} (max 10 MB)`, 'Dismiss', { duration: 3500 });
      return false;
    }
    return true;
  }

  queueFiles(files: File[]) {
    for (const file of files) {
      if (!this.isValidFile(file)) continue;
      this.uploads.push({ file, progress: 0, state: 'queued' });
    }
  }

  startUploads() {
    if (this.isUploading) return;

    this.startNextUpload();
  }

  private startNextUpload() {
    if (this.isUploading) return;

    const next = this.uploads.find((u) => u.state === 'queued');
    if (!next) return;

    const tags = this.tagsText.split(',').map((t) => t.trim()).filter(Boolean);
    const extra = { description: this.description || undefined, tags: tags.length ? tags : undefined };

    next.state = 'uploading';
    next.startedAt = Date.now();
    next.progress = 3;

    next.sub = this.api.upload(next.file, extra).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            const actual = Math.round((100 * event.loaded) / event.total);
            // Keep headroom so users can still cancel before final commit.
            next.progress = Math.min(96, Math.max(next.progress, actual));
          } else {
            next.progress = Math.min(90, next.progress + 7);
          }
        } else if (event.type === HttpEventType.Response) {
          const elapsed = Date.now() - (next.startedAt || Date.now());
          const wait = Math.max(0, this.minVisibleUploadMs - elapsed);
          next.progress = Math.max(next.progress, 98);

          next.finishTimer = setTimeout(() => {
            if (next.state === 'canceled') return;
            next.progress = 100;
            next.state = 'done';
            next.finishTimer = undefined;
            this.snack.open(`Upload successful: ${next.file.name}`, 'OK', { duration: 2000 });
            this.startNextUpload();
          }, wait);
        }
      },
      error: () => {
        if (next.state === 'canceled') return;
        next.state = 'error';
        next.sub = undefined;
        this.snack.open(`Upload failed: ${next.file.name}`, 'Dismiss', { duration: 3500 });
        this.startNextUpload();
      },
      complete: () => {
        next.sub = undefined;
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
    this.snack.open(`Upload canceled: ${item.file.name}`, 'OK', { duration: 1500 });

    // Continue queue if an active upload was canceled.
    this.startNextUpload();
  }

  clearDone() {
    this.uploads = this.uploads.filter((u) => u.state !== 'done' && u.state !== 'canceled');
  }

  triggerFilePick() {
    this.fileInput.nativeElement.click();
  }
}