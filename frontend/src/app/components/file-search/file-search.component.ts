import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SearchCriteria } from '../../models/search-criteria.model';

@Component({
  selector: 'app-file-search',
  templateUrl: './file-search.component.html',
  styleUrls: ['./file-search.component.scss']
})
export class FileSearchComponent {
  @Output() search = new EventEmitter<SearchCriteria>();

  form = this.fb.group({
    fileId: [''],
    filename: [''],
    status: [''],
    startDate: [''],
    endDate: [''],
    recordCountMin: [''],
    recordCountMax: ['']
  });

  constructor(private fb: FormBuilder) {}

  private toLocalDateTime(value: unknown, endOfDay = false): string | undefined {
    if (!value) return undefined;

    const d = value instanceof Date ? value : new Date(value as string);
    if (Number.isNaN(d.getTime())) return undefined;

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = endOfDay ? '23' : '00';
    const mm = endOfDay ? '59' : '00';
    const ss = endOfDay ? '59' : '00';
    return `${y}-${m}-${day}T${hh}:${mm}:${ss}`;
  }

  submit() {
    const { fileId, filename, status, startDate, endDate, recordCountMin, recordCountMax } = this.form.value;
    const min = recordCountMin !== '' && recordCountMin !== null ? Number(recordCountMin) : undefined;
    const max = recordCountMax !== '' && recordCountMax !== null ? Number(recordCountMax) : undefined;

    const normalizedStatus = status === 'COMPLETED' ? 'SUCCESS' : status || '';

    this.search.emit({
      fileId: fileId || '',
      filename: filename || '',
      status: normalizedStatus,
      startDate: this.toLocalDateTime(startDate, false),
      endDate: this.toLocalDateTime(endDate, true),
      recordCountMin: min,
      recordCountMax: max,
      page: 0
    });
  }

  reset() {
    this.form.reset({
      fileId: '',
      filename: '',
      status: '',
      startDate: '',
      endDate: '',
      recordCountMin: '',
      recordCountMax: ''
    });
    this.search.emit({
      fileId: '',
      filename: '',
      status: '',
      startDate: undefined,
      endDate: undefined,
      recordCountMin: undefined,
      recordCountMax: undefined,
      page: 0
    });
  }
}