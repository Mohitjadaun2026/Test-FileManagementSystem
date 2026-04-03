# Page: Admin Invite (`/super-admin/admin-invites`)

## Purpose

Allow super-admins to create scoped admin invitations and let invite recipients accept them.

## Component

- `admin-invite.component.ts`
- `admin-invite.component.html`
- `admin-invite.component.scss`

## Access

- Route guard: `SuperAdminGuard`
- Backend endpoints:
  - `POST /api/super-admin/admin-invites`
  - `GET /api/super-admin/admin-invites/{token}/validate`
  - `POST /api/super-admin/admin-invites/accept`

## Default Invite Scope

New invites start with:

- `USER_ACCESS_CONTROL = true`
- `USER_RECORDS_OVERVIEW = false`
- `USER_FILES_DELETE_ALL = false`

This means the invited admin can be block/unblock-only unless the super-admin expands permissions.

## Invite Flow

1. Super-admin enters invite email.
2. The form posts selected permissions to backend.
3. Backend returns invite link, generated password, and expiry.
4. If the invite token is present in the URL, the page validates it.
5. Invite recipient accepts the invite using the token.

## UI Notes

- The invite token is not shown as visible text in the UI.
- The page displays invite status/validation feedback.
- The response includes a clickable invite link and generated password for operational handoff.

