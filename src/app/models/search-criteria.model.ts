export interface SearchCriteria {
  q?: string;
  status?: string;
  mimeType?: string;
  dateFrom?: string; // ISO date
  dateTo?: string;   // ISO date
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDir?: 'asc' | 'desc';
}