import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FileLoadService } from '../../services/file-load.service';
import { FileItem, PagedResult } from '../../models/file-load.model';
import { SearchCriteria } from '../../models/search-criteria.model';
import { AuthService } from '../../services/auth.service';
import { StatusUpdateComponent } from '../status-update/status-update.component';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  displayedColumns = ['name', 'size', 'type', 'status', 'uploadedAt', 'actions'];
  dataSource = new MatTableDataSource<FileItem>([]);
  total = 0;
  loading = false;

  criteria: SearchCriteria = { page: 1, pageSize: 10, sortField: 'uploadedAt', sortDir: 'desc' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private api: FileLoadService,
    private snack: MatSnackBar,
    private router: Router,
    private auth: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetch();
  }

  onSearch(c: SearchCriteria) {
    this.criteria = { ...this.criteria, ...c, page: 1 };
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.api.list(this.criteria).subscribe({
      next: (res: PagedResult<FileItem>) => {
        this.dataSource.data = res.items;
        this.total = res.total;
        this.loading = false;
      },
      error: (err) => {
        this.snack.open(err?.error?.message ?? 'Failed to load files', 'Dismiss', { duration: 3500 });
        this.loading = false;
      }
    });
  }

  pageChange(ev: PageEvent) {
    this.criteria.page = ev.pageIndex + 1;
    this.criteria.pageSize = ev.pageSize;
    this.fetch();
  }

  sortChange(ev: Sort) {
    this.criteria.sortField = ev.active;
    this.criteria.sortDir = ev.direction as 'asc' | 'desc' || 'desc';
    this.criteria.page = 1;
    this.fetch();
  }

  view(row: FileItem) {
    this.router.navigate(['/files', row.id]);
  }

  openStatusDialog(row: FileItem) {
    this.dialog.open(StatusUpdateComponent, {
      width: '420px',
      panelClass: 'status-dialog',
      data: { fileId: row.id, currentStatus: row.status }
    }).afterClosed().subscribe(updated => {
      if (updated) this.fetch();
    });
  }

  download(row: FileItem) {
    this.api.download(row.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = row.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        this.snack.open('Download started', 'OK', { duration: 1500 });
      },
      error: () => this.snack.open('Download failed', 'Dismiss', { duration: 3000 })
    });
  }

  delete(row: FileItem) {
    if (!confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    this.api.delete(row.id).subscribe({
      next: () => {
        this.snack.open('File deleted', 'OK', { duration: 1500 });
        this.fetch();
      },
      error: () => this.snack.open('Delete failed', 'Dismiss', { duration: 3000 })
    });
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: 'badge-pending',
      PROCESSING: 'badge-processing',
      COMPLETED: 'badge-success',
      SUCCESS: 'badge-success',
      FAILED: 'badge-failed',
      ARCHIVED: 'badge-archived'
    };
    return map[status] || 'badge-default';
  }
}