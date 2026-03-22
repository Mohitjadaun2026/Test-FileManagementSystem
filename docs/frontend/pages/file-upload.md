# Page: File Upload (`/upload`)

## Purpose

Upload one or multiple CSV files with queue management, progress UI, and cancellation controls.

## Component

- `file-upload.component.ts`
- `file-upload.component.html`
- `file-upload.component.scss`

## Input Modes

- drag & drop
- file picker browse
- multi-file selection

## Validation Rules

Client-side checks:

- extension `.csv`
- mime type includes `text/csv` (allows some fallback by extension)
- max size 20 MB per file

Invalid files are rejected with snackbar feedback.

## Queue Model

Each upload item tracks:

- file
- progress
- state: `queued | uploading | done | error | canceled`
- selected flag (for bulk cancel)
- subscription/timers

## Upload Execution

- sequential upload model (`startNextUpload`)
- request built with optional `description` and comma-split `tags`
- progress simulated smoothly with minimum visible time to avoid flashing fast-complete UI

## Post-Upload Behavior

- if at least one successful upload and redirect enabled, routes to `/files` with refresh query param

## Controls

- start uploads
- cancel individual
- cancel selected
- clear finished

## Notes

Backend currently accepts only `file` for create endpoint; extra form fields (`description`, `tags`) are sent from frontend but not consumed in `createFileLoad` controller signature.

