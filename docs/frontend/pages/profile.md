# Page: Profile (`/profile`)

## Purpose

Manage profile display data and show per-user file statistics.

## Component

- `profile.component.ts`
- `profile.component.html`
- `profile.component.scss`

## Sections

1. Header card with avatar/name/email
2. Edit mode (name + profile image)
3. Stats grid (total/pending/success/failed/success-rate)

## Data Sources

- user data from `AuthService.currentUser$`
- stats from `FileLoadService.myList(criteria)` and local client-side aggregation by current user id

## Profile Image Flow

1. User selects image in edit mode.
2. Client validates type and max size 2MB.
3. Client generates compressed preview via canvas.
4. On save, file uploaded to `/auth/upload-profile` with `userId`.
5. Returned relative path stored in current user object and localStorage stream.
6. URL assembled with cache-busting timestamp query (`?t=<ms>`).

## Name Update Flow

- `newName` is applied to current user object and persisted through `AuthService.updateUser`.

## UX Notes

- uses `alert(...)` for some messages in current implementation (can be migrated to snackbars for consistency)
- edit mode is explicit and cancellable

