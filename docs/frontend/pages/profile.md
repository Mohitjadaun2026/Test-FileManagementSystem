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

1. The UI resolves the avatar from the backend `profileImage` path.
2. If no image exists, the app shows a role-aware fallback:
   - `SUPER_ADMIN` -> super-admin styled placeholder
   - `ADMIN` -> admin styled placeholder
   - others -> generic user placeholder
3. If a loaded image fails, the same fallback is applied.
4. On save, uploaded image path is refreshed into local state via `AuthService.fetchProfile()` and `updateUser()`.

## Name Update Flow

- `newName` is applied to current user object and persisted through `AuthService.updateUser()`.
- When the profile changes and no custom image is set, the fallback avatar updates with the new name/role context.

## UX Notes

- edit mode is explicit and cancellable
- avatar/profile previews use the shared fallback path when image loading fails
- statistics are loaded from the user's own files only
