import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FileLoadService } from '../../services/file-load.service';
import { FileItem, PagedResult } from '../../models/file-load.model';
import { SearchCriteria } from '../../models/search-criteria.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  displayedColumns = ['name', 'size', 'type', 'status', 'uploadedAt', 'actions'];
  dataSource = new MatTableDataSource<FileItem>([]);
  total = 0;

  criteria: SearchCriteria = { page: 1, pageSize: 10, sortField: 'uploadedAt', sortDir: 'desc' };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private api: FileLoadService,
    private snack: MatSnackBar,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetch();
  }

  onSearch(c: SearchCriteria) {
    this.criteria = { ...this.criteria, ...c, page: c.page ?? 1 };
    this.fetch();
  }

  fetch() {
    this.api.list(this.criteria).subscribe({
      next: (res: PagedResult<FileItem>) => {
        this.dataSource.data = res.items;
        this.total = res.total;
      },
      error: (err) => this.snack.open(err?.error?.message ?? 'Failed to load files', 'Dismiss', { duration: 3500 })
    });
  }

  pageChange(ev: PageEvent) {
    this.criteria.page = ev.pageIndex + 1;
    this.criteria.pageSize = ev.pageSize;
    this.fetch();
  }

  view(row: FileItem) {
    this.router.navigate(['/files', row.id]);
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
      },
      error: () => this.snack.open('Download failed', 'Dismiss', { duration: 3000 })
    });
  }

  delete(row: FileItem) {
    if (!confirm(`Delete ${row.name}?`)) return;
    this.api.delete(row.id).subscribe({
      next: () => {
        this.snack.open('Deleted', 'OK', { duration: 1500 });
        this.fetch();
      },
      error: () => this.snack.open('Delete failed', 'Dismiss', { duration: 3000 })
    });
  }
}