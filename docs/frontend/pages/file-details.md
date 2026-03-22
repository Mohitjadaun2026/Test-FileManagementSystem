# Page: File Details (`/files/:id`)

## Purpose

Detailed inspection and maintenance view for one file load.

## Component

- `file-details.component.ts`
- `file-details.component.html`
- `file-details.component.scss`

## Displayed Data

- file identity (id, name, type, size)
- upload metadata (date, uploader)
- processing metadata (status, record count, errors)
- optional fields (description, tags, checksum, version)

## Actions

- download file
- delete file
- open status update dialog
- inline metadata save (description/tags)

## Edit Metadata Flow

1. Form binds description/tags text.
2. On save, tags are split by comma and trimmed.
3. Calls `FileLoadService.updateMetadata(id, body)`.
4. Updates page model on success.

## Status Update Integration

- Uses reusable `app-status-update` component inline.
- Also supports modal open for status update.

## Error Handling

- load failure -> snackbar + empty state
- save/download/delete errors -> snackbar

## Status Style Mapping

`statusClass` maps backend status strings to CSS badge classes.

