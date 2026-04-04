# Page: Admin Users (`/admin/users`)

## Purpose

Provide scoped administration over user accounts for admins and super-admins.

## Component

- `admin-users.component.ts`
- `admin-users.component.html`
- `admin-users.component.scss`

## Access

- Route guard: `AdminScopeGuard`
- Backend endpoint: `GET /api/admin/users`
- Allowed if user has one of:
  - `USER_ACCESS_CONTROL`
  - `USER_RECORDS_OVERVIEW`
  - `USER_FILES_DELETE_ALL`
  - or role `SUPER_ADMIN`

## Table Columns

- ID
- Username
- Email
- Role
- Enabled
- Failed logins
- File count
- Actions

## Visibility Rules

- File count is hidden unless the viewer has `USER_RECORDS_OVERVIEW`
- Delete-all-files button is hidden unless the viewer has `USER_FILES_DELETE_ALL`
- Block/unblock action is controlled by `USER_ACCESS_CONTROL`
- Super-admin accounts are protected from non-super-admin actions

## Actions

- Search users
- Toggle enabled/blocked state
- Load file count for visible rows
- Delete all files for a user

## Behavior Notes

- Counts are loaded row-by-row only when the viewer has record-overview permission.
- The page is designed so a block-only admin can still open the page and use the block/unblock action without hitting denied file-count calls.

