import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileLoadService } from '../../services/file-load.service';
import { FileItem } from '../../models/file-load.model';

@Component({
  selector: 'app-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss']
})
export class FileDetailsComponent implements OnInit {
  id!: string;
  file?: FileItem;
  saving = false;

  form = this.fb.group({
    description: [''],
    tags: ['']
  });

  constructor(
    private route: ActivatedRoute,
    private api: FileLoadService,
    private fb: FormBuilder,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.load();
  }

  load() {
    this.api.details(this.id).subscribe({
      next: (f) => {
        this.file = f;
        this.form.patchValue({
          description: f.description || '',
          tags: (f.tags || []).join(', ')
        });
      },
      error: () => this.snack.open('Failed to load file', 'Dismiss', { duration: 3000 })
    });
  }

  save() {
    if (!this.file) return;
    this.saving = true;
    const { description, tags } = this.form.value;
    const body: Partial<FileItem> = {
      description: description || undefined,
      tags: (tags || '').split(',').map((t: string) => t.trim()).filter(Boolean)
    };
    this.api.updateMetadata(this.file.id, body).subscribe({
      next: (res) => {
        this.snack.open('Saved', 'OK', { duration: 1500 });
        this.file = res;
        this.saving = false;
      },
      error: () => {
        this.snack.open('Save failed', 'Dismiss', { duration: 3000 });
        this.saving = false;
      }
    });
  }
}