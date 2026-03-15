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
q: [''],
status: [''],
mimeType: [''],
dateFrom: [''],
dateTo: ['']
});

constructor(private fb: FormBuilder) {}

  submit() {
    const { q, status, mimeType, dateFrom, dateTo } = this.form.value;
    this.search.emit({
      q: q || '',
      status: status || '',
      mimeType: mimeType || '',
      dateFrom: dateFrom ? new Date(dateFrom).toISOString() : undefined,
      dateTo: dateTo ? new Date(dateTo).toISOString() : undefined,
      page: 1
    });
  }

  reset() {
    this.form.reset({
      q: '',
      status: '',
      mimeType: '',
      dateFrom: '',
      dateTo: ''
    });
    this.search.emit({
      q: '',
      status: '',
      mimeType: '',
      dateFrom: undefined,
      dateTo: undefined,
      page: 1
    });
  }
}