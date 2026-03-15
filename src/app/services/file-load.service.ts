import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpParams,
  HttpRequest,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FileItem, PagedResult } from '../models/file-load.model';
import { SearchCriteria } from '../models/search-criteria.model';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FileLoadService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  list(criteria: SearchCriteria): Observable<PagedResult<FileItem>> {
    let params = new HttpParams();
    Object.entries(criteria).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });

    return this.http.get<PagedResult<FileItem>>(
      `${environment.apiBaseUrl}/files`,
      { params, headers: this.authHeaders() }
    );
  }

  details(id: string): Observable<FileItem> {
    return this.http.get<FileItem>(
      `${environment.apiBaseUrl}/files/${id}`,
      { headers: this.authHeaders() }
    );
  }

  updateMetadata(id: string, body: Partial<FileItem>) {
    return this.http.patch<FileItem>(
      `${environment.apiBaseUrl}/files/${id}`,
      body,
      { headers: this.authHeaders() }
    );
  }

  updateStatus(id: string, status: string, comment?: string) {
    return this.http.patch<FileItem>(
      `${environment.apiBaseUrl}/files/${id}/status`,
      { status, comment },
      { headers: this.authHeaders() }
    );
  }

  delete(id: string) {
    return this.http.delete<void>(
      `${environment.apiBaseUrl}/files/${id}`,
      { headers: this.authHeaders() }
    );
  }

  // Upload with progress events
  upload(file: File, extra?: { description?: string; tags?: string[] }): Observable<HttpEvent<any>> {
    const form = new FormData();
    form.append('file', file);
    if (extra?.description) form.append('description', extra.description);
    if (extra?.tags?.length) extra.tags.forEach(t => form.append('tags', t));

    const req = new HttpRequest('POST', `${environment.apiBaseUrl}/files/upload`, form, {
      reportProgress: true,
      headers: this.authHeaders()
    });

    return this.http.request(req);
  }

  // Use the blob response overload safely
  download(id: string): Observable<Blob> {
    return this.http.get(`${environment.apiBaseUrl}/files/${id}/download`, {
      responseType: 'blob',
      headers: this.authHeaders()
    }) as unknown as Observable<Blob>;
  }
}