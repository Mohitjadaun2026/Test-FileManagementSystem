export type FileStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: string; // ISO date
  status: FileStatus;
  description?: string;
  tags?: string[];
  checksum?: string;
  version?: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}