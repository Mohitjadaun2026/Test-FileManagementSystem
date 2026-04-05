# Shared Frontend Components

## `NavbarComponent`

Responsibilities:

- render top navigation and auth-sensitive actions
- show profile avatar
- open profile dialog
- surface admin and super-admin links when allowed

Behavior:

- subscribes to `currentUser$`
- uses shared profile-image helper with role-aware fallback avatars
- shows `/admin/users` for admins with user-management access
- shows `/super-admin/admin-invites` for `SUPER_ADMIN`

## `ProfileDialogComponent`

Small quick-access modal:

- shows avatar/user summary
- action buttons: view profile, logout
- displays the current role badge
- closes dialog before route transitions

## `FileSearchComponent`

Reusable filter bar for file list.

Inputs/Outputs:

- emits `SearchCriteria` through `(search)` event

Features:

- file id / filename / status / date range / min-max records
- auto-detects filter active state
- auto-emits default search when user clears all fields
- converts datepicker values to local datetime format accepted by backend parser

## `StatusUpdateComponent`

Used in both inline and modal modes.

Capabilities:

- update status + optional comment
- supports injected dialog data (`MAT_DIALOG_DATA`) or `@Input` mode
- emits update event or closes dialog with success flag

## Footer

Static informational/footer links and product branding.

## Inter-component Flow

- file list opens status update dialog
- file details embeds status update inline and can open dialog
- navbar opens profile dialog
- profile dialog routes to profile page
- admin users page uses the admin service to manage users and file counts
- admin invite page is only reachable by super-admin
