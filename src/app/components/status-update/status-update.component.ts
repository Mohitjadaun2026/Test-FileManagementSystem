import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileLoadService } from '../../services/file-load.service';

@Component({
  selector: 'app-status-update',
  templateUrl: './status-update.component.html',
  styleUrls: ['./status-update.component.scss']
})
export class StatusUpdateComponent {
  @Input() fileId!: string;
  @Input() currentStatus!: string;
  @Output() updated = new EventEmitter<void>();

  form = this.fb.group({
    status: ['', Validators.required],
    comment: ['']
  });

  constructor(private fb: FormBuilder, private api: FileLoadService, private snack: MatSnackBar) {}

  ngOnChanges() {
    if (this.currentStatus) {
      this.form.patchValue({ status: this.currentStatus });
    }
  }

  submit() {
    if (this.form.invalid || !this.fileId) return;
    const { status, comment } = this.form.value as any;
    this.api.updateStatus(this.fileId, status, comment).subscribe({
      next: () => {
        this.snack.open('Status updated', 'OK', { duration: 1500 });
        this.updated.emit();
      },
      error: () => this.snack.open('Failed to update status', 'Dismiss', { duration: 3000 })
    });
  }
}