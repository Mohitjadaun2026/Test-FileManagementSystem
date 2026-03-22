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
    if (files?.length) {
      this.queueFiles(Array.from(files));
    }
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
      this.snack.open(`Only CSV files are allowed: ${file.name}`, 'Dismiss', {
        duration: 3500
      });
      return false;
    }

    if (file.size > this.maxFileSizeBytes) {
      this.snack.open(`File exceeds 20 MB limit: ${file.name}`, 'Dismiss', {
        duration: 3500
      });
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
  }

  startUploads() {
    if (this.isUploading) return;
    this.startNextUpload();
  }

  private startNextUpload() {
    if (this.isUploading) return;

    const next = this.uploads.find((u) => u.state === 'queued');
    if (!next) {
      this.handleUploadBatchFinished();
      return;
    }

    const tags = this.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const extra = {
      description: this.description || undefined,
      tags: tags.length ? tags : undefined
    };

    next.state = 'uploading';
    next.startedAt = Date.now();
    next.progress = 3;

    next.sub = this.api.upload(next.file, extra).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            const actual = Math.round((100 * event.loaded) / event.total);
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

            this.snack.open(`Upload successful: ${next.file.name}`, 'OK', {
              duration: 2000
            });

            this.startNextUpload();
          }, wait);
        }
      },
      error: () => {
        if (next.state === 'canceled') return;

        next.state = 'error';
        next.sub = undefined;

        this.snack.open(`Upload failed: ${next.file.name}`, 'Dismiss', {
          duration: 3500
        });

        this.startNextUpload();
      },
      complete: () => {
        next.sub = undefined;
      }
    });
  }

  private handleUploadBatchFinished() {
    const doneCount = this.uploads.filter((u) => u.state === 'done').length;

    if (!this.redirectAfterUpload || doneCount === 0) return;

    this.router.navigate(['/files'], {
      queryParams: {
        refresh: Date.now()
      }
    });
  }

  cancelUpload(item: UploadItem, options?: { silent?: boolean; continueQueue?: boolean }) {
    if (item.state !== 'uploading' && item.state !== 'queued') return;

    const wasUploading = item.state === 'uploading';

    if (item.finishTimer) {
      clearTimeout(item.finishTimer);
      item.finishTimer = undefined;
    }

    item.sub?.unsubscribe();
    item.sub = undefined;
    item.state = 'canceled';
    item.progress = 0;
    item.selected = false;

    if (!options?.silent) {
      this.snack.open(`Upload canceled: ${item.file.name}`, 'OK', {
        duration: 1500
      });
    }

    if (options?.continueQueue !== false && wasUploading) {
      this.startNextUpload();
    }
  }

  cancelSelected() {
    const selected = this.uploads.filter(
      (u) => u.selected && (u.state === 'queued' || u.state === 'uploading')
    );

    if (!selected.length) return;

    const hadActive = selected.some((u) => u.state === 'uploading');

    for (const item of selected) {
      this.cancelUpload(item, { silent: true, continueQueue: false });
    }

    this.snack.open(`Canceled ${selected.length} file(s)`, 'OK', {
      duration: 1800
    });

    if (hadActive) {
      this.startNextUpload();
    }
  }

  clearDone() {
    this.uploads = this.uploads.filter(
      (u) => u.state !== 'done' && u.state !== 'canceled'
    );
  }

  triggerFilePick() {
    this.fileInput.nativeElement.click();
  }
}