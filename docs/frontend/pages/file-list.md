# Page: File List (`/files`)

## Purpose

Central workspace for listing, filtering, selecting, and acting on file loads.

## Component

- `file-list.component.ts`
- `file-list.component.html`
- `file-list.component.scss`

## Features

- server-side pagination
- sorting
- advanced filtering through child component (`app-file-search`)
- row actions: view, download, update status, delete
- multi-select with bulk delete selected
- delete-all-matching current filter set
- periodic refresh polling every second

## Data Source

- `FileLoadService.myList(criteria)`
- wraps backend pageable response into `MatTableDataSource`

## Criteria Model

`SearchCriteria` fields include:

- `fileId`, `filename`, `status`
- date range (`startDate`, `endDate`)
- record count range
- page/size/sort

## Display Notes

- the first table column shows a serial row number (`No.`) instead of database primary key
- this keeps numbering user-friendly even when DB `id` values continue after deletes

## Bulk Actions Logic

- maintains selected IDs in `Set<number>`
- supports visible-row select all and indeterminate state
- async delete loop with per-item success/failure count summary toast

## Status Mapping

`statusClass` maps status to badge style classes for quick visual scanning.

## UX States

- loading progress bar
- empty-state card with upload CTA
- auto-refresh for near-real-time status updates

## Important Behavior

This page checks auth on init and redirects to login if not authenticated.
