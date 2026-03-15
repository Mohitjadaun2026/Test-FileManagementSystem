import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType } from '@angular/common/http';
import { FileLoadService } from '../../services/file-load.service';

interface UploadItem {
  file: File;
  progress: number;
  state: 'queued' | 'uploading' | 'done' | 'error';
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  uploads: UploadItem[] = [];
  description = '';
  tagsText = '';

  isOver = false;

  constructor(private api: FileLoadService, private snack: MatSnackBar) {}

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

  queueFiles(files: File[]) {
    for (const f of files) this.uploads.push({ file: f, progress: 0, state: 'queued' });
  }

  startUploads() {
    const tags = this.tagsText.split(',').map(t => t.trim()).filter(Boolean);
    const extra = { description: this.description || undefined, tags: tags.length ? tags : undefined };

    this.uploads.filter(u => u.state === 'queued').forEach(u => {
      u.state = 'uploading';
      this.api.upload(u.file, extra).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            u.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            u.progress = 100;
            u.state = 'done';
          }
        },
        error: (err) => {
          u.state = 'error';
          this.snack.open(`Upload failed: ${u.file.name}`, 'Dismiss', { duration: 3500 });
        }
      });
    });
  }

  clearDone() {
    this.uploads = this.uploads.filter(u => u.state !== 'done');
  }

  triggerFilePick() {
    this.fileInput.nativeElement.click();
  }
}