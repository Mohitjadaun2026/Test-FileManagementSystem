import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileItem } from '../models/file-load.model';

type User = { id: string; name: string; email: string; password: string; token?: string };

interface MockDb {
  users: User[];
  files: FileItem[];
  lastIds: { user: number; file: number };
}

const DB_KEY = 'fl_mock_db';

function loadDb(): MockDb {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) {
    try { return JSON.parse(raw) as MockDb; } catch {}
  }
  // seed with a sample user and a few files
  const seed: MockDb = {
    users: [
      { id: 'u_1', name: 'Demo User', email: 'demo@example.com', password: 'password', token: 'mock-token-u_1' }
    ],
    files: [
      {
        id: 'f_1',
        name: 'Report.pdf',
        size: 124567,
        mimeType: 'application/pdf',
        uploadedBy: 'Demo User',
        uploadedAt: new Date().toISOString(),
        status: 'COMPLETED',
        description: 'Quarterly report',
        tags: ['finance', 'Q1'],
        version: 1,
        checksum: 'abc123'
      },
      {
        id: 'f_2',
        name: 'Invoice.xlsx',
        size: 34567,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        uploadedBy: 'Demo User',
        uploadedAt: new Date(Date.now() - 86400000).toISOString(),
        status: 'PENDING',
        description: 'Pending approval',
        tags: ['invoice', 'FY25'],
        version: 1,
        checksum: 'def456'
      }
    ],
    lastIds: { user: 1, file: 2 }
  };
  saveDb(seed);
  return seed;
}

function saveDb(db: MockDb) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function newId(prefix: 'u' | 'f', n: number) {
  return `${prefix}_${n}`;
}

function ok<T>(body: T, ms = 300) {
  return of(new HttpResponse({ status: 200, body })).pipe(delay(ms));
}

function created<T>(body: T, ms = 300) {
  return of(new HttpResponse({ status: 201, body })).pipe(delay(ms));
}

function err(status: number, message: string, ms = 300) {
  return throwError(() => ({ status, error: { message } })).pipe(delay(ms));
}

@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only handle when mock is enabled
    if (!environment.mockApi) return next.handle(req);

    // Only intercept our API base
    // Works when apiBaseUrl is '/api'
    if (!req.url.startsWith('/api')) return next.handle(req);

    const url = new URL(req.url, window.location.origin);
    const { pathname, searchParams } = url;
    const method = req.method.toUpperCase();
    const db = loadDb();

    // ---------- AUTH ----------
    if (pathname === '/api/auth/register' && method === 'POST') {
      const { name, email, password } = req.body || {};
      if (!name || !email || !password) return err(400, 'name, email, password are required');

      const exists = db.users.some(u => u.email.toLowerCase() === String(email).toLowerCase());
      if (exists) return err(409, 'Email already exists');

      db.lastIds.user += 1;
      const id = newId('u', db.lastIds.user);
      const user: User = { id, name, email, password, token: `mock-token-${id}` };
      db.users.push(user);
      saveDb(db);

      const { password: _, ...safeUser } = user;
      return created(safeUser);
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const { email, password } = req.body || {};
      if (!email || !password) return err(400, 'email and password are required');

      const user = db.users.find(u => u.email.toLowerCase() === String(email).toLowerCase());
      if (!user || user.password !== password) return err(401, 'Invalid email or password');

      const { password: _, ...safeUser } = user;
      return ok({ ...safeUser, token: user.token || `mock-token-${user.id}` });
    }

    // ---------- FILES: list with filters & paging ----------
    if (pathname === '/api/files' && method === 'GET') {
      // read criteria
      const q = searchParams.get('q')?.toLowerCase() || '';
      const status = searchParams.get('status') || '';
      const mimeType = searchParams.get('mimeType')?.toLowerCase() || '';
      const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : null;
      const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : null;
      const page = +(searchParams.get('page') || 1);
      const pageSize = +(searchParams.get('pageSize') || 10);
      const sortField = searchParams.get('sortField') || 'uploadedAt';
      const sortDir = (searchParams.get('sortDir') || 'desc').toLowerCase();

      let items = [...db.files];

      if (q) {
        items = items.filter(f =>
          f.name.toLowerCase().includes(q) ||
          (f.description || '').toLowerCase().includes(q) ||
          (f.tags || []).some(t => t.toLowerCase().includes(q))
        );
      }
      if (status) items = items.filter(f => f.status === status);
      if (mimeType) items = items.filter(f => f.mimeType.toLowerCase().includes(mimeType));
      if (dateFrom) items = items.filter(f => new Date(f.uploadedAt) >= dateFrom);
      if (dateTo) items = items.filter(f => new Date(f.uploadedAt) <= dateTo);

      items.sort((a: any, b: any) => {
        const av = (a as any)[sortField];
        const bv = (b as any)[sortField];
        if (av === bv) return 0;
        return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
      });

      const total = items.length;
      const start = (page - 1) * pageSize;
      const paged = items.slice(start, start + pageSize);

      return ok({ items: paged, total, page, pageSize });
    }

    // ---------- FILES: details ----------
    const fileIdMatch = pathname.match(/^\/api\/files\/([^/]+)$/);
    if (fileIdMatch && method === 'GET') {
      const id = fileIdMatch[1];
      const file = db.files.find(f => f.id === id);
      if (!file) return err(404, 'File not found');
      return ok(file);
    }

    // ---------- FILES: update metadata ----------
    if (fileIdMatch && method === 'PATCH') {
      const id = fileIdMatch[1];
      const file = db.files.find(f => f.id === id);
      if (!file) return err(404, 'File not found');

      const body = req.body || {};
      Object.assign(file, {
        description: body.description ?? file.description,
        tags: Array.isArray(body.tags) ? body.tags : file.tags
      });
      saveDb(db);
      return ok(file);
    }

    // ---------- FILES: update status ----------
    const fileStatusMatch = pathname.match(/^\/api\/files\/([^/]+)\/status$/);
    if (fileStatusMatch && method === 'PATCH') {
      const id = fileStatusMatch[1];
      const file = db.files.find(f => f.id === id);
      if (!file) return err(404, 'File not found');

      const { status } = req.body || {};
      if (!status) return err(400, 'status is required');
      file.status = status;
      saveDb(db);
      return ok(file);
    }

    // ---------- FILES: delete ----------
    if (fileIdMatch && method === 'DELETE') {
      const id = fileIdMatch[1];
      const idx = db.files.findIndex(f => f.id === id);
      if (idx < 0) return err(404, 'File not found');

      db.files.splice(idx, 1);
      saveDb(db);
      return ok({ success: true });
    }

    // ---------- FILES: upload ----------
    if (pathname === '/api/files/upload' && method === 'POST') {
      // Body is FormData in your upload service
      const formData = req.body as FormData;
      if (!(formData instanceof FormData)) {
        return err(400, 'Expected multipart/form-data');
      }

      const file = formData.get('file') as File | null;
      if (!file) return err(400, 'file is required');

      const description = (formData.get('description') as string) || '';
      const tags = formData.getAll('tags').map(String).filter(Boolean);

      db.lastIds.file += 1;
      const id = newId('f', db.lastIds.file);

      const mock: FileItem = {
        id,
        name: file.name,
        size: file.size,
        mimeType: file.type || 'application/octet-stream',
        uploadedBy: 'You',
        uploadedAt: new Date().toISOString(),
        status: 'PENDING',
        description,
        tags
      };

      db.files.unshift(mock);
      saveDb(db);

      return created({ id: mock.id });
    }

    // ---------- FILES: download ----------
    const fileDownloadMatch = pathname.match(/^\/api\/files\/([^/]+)\/download$/);
    if (fileDownloadMatch && method === 'GET') {
      const id = fileDownloadMatch[1];
      const file = db.files.find(f => f.id === id);
      if (!file) return err(404, 'File not found');

      const content = `Mock content for ${file.name}\nGenerated at ${new Date().toISOString()}`;
      const blob = new Blob([content], { type: 'text/plain' });

      return of(new HttpResponse({ status: 200, body: blob }));
    }

    // Fall-through: any other /api requests → 404
    return err(404, `No mock handler for ${method} ${pathname}`);
  }
}