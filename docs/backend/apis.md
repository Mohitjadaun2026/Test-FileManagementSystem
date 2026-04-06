# Backend API Documentation

Base URL (local): `http://localhost:8080/api`

## 1) Authentication APIs (`/api/auth`)

### `POST /api/auth/register`

- Creates a local user account (`USER` role).
- Request: `RegisterRequestDTO` (`username`, `email`, `password`).
- Response: `AuthResponseDTO` with JWT and user profile fields.

### `POST /api/auth/login`

- Supports login by email or username (`login` field).
- Response: `AuthResponseDTO` with token, role, and `adminPermissions`.

### `POST /api/auth/forgot-password`

- Starts password reset flow via email.
- Always returns a safe response shape to avoid account enumeration.

### `GET /api/auth/validate-reset-token/{token}`

- Validates reset token status.

### `POST /api/auth/reset-password`

- Completes password reset with token + new password.

### `GET /api/auth/oauth2/google`

- Starts Google OAuth flow by redirecting to Spring OAuth endpoint.

### `POST /api/auth/upload-profile`

- Multipart: `file`, `userId`.
- Allowed for authenticated users with ownership/admin check.

### `GET /api/auth/profile`

- Returns latest user profile and refreshed JWT payload.

## 2) File Load APIs (`/api/file-loads`)

### `POST /api/file-loads`

- Auth: `USER | ADMIN | SUPER_ADMIN`
- Multipart upload endpoint.
- Creates DB row in `PENDING` and launches async processing.

### `GET /api/file-loads/{id}`

- Auth: `USER | ADMIN | SUPER_ADMIN`
- Returns one file metadata record.

### `GET /api/file-loads`

- Auth: `ADMIN | SUPER_ADMIN`
- Global search across files.
- Supports filters: `fileId`, `filename`, `status`, `startDate`, `endDate`, `recordCountMin`, `recordCountMax`, `page`, `size`, `sort`.

### `GET /api/file-loads/my`

- Auth: `USER | ADMIN | SUPER_ADMIN`
- Same filter model, automatically scoped to current user.

### `GET /api/file-loads/overview`

- Auth: `ADMIN | SUPER_ADMIN`
- Returns aggregate dashboard metrics.


### `PATCH /api/file-loads/{id}`

- Auth: `USER | ADMIN | SUPER_ADMIN`
- Updates metadata (`description`, `tags`).

### `DELETE /api/file-loads/{id}`

- Auth: `USER | ADMIN | SUPER_ADMIN`
- Deletes record and physical file if present and authorized.

### `GET /api/file-loads/{id}/download`

- Auth: `USER | ADMIN | SUPER_ADMIN`
- Downloads source file bytes.

## 3) Admin APIs (`/api/admin`)

All endpoints are role-gated at controller level (`ADMIN | SUPER_ADMIN`) and further restricted by permission scopes where configured.

### User management

- `GET /api/admin/users`
  - Scope: any of `USER_ACCESS_CONTROL`, `USER_RECORDS_OVERVIEW`, `USER_FILES_DELETE_ALL`
- `PATCH /api/admin/users/{userId}/enabled`
  - Scope: `USER_ACCESS_CONTROL`
- `PATCH /api/admin/users/{userId}/role`
  - `SUPER_ADMIN` only
- `POST /api/admin/users/{userId}/reset-failed-attempts`
  - `SUPER_ADMIN` only
- `POST /api/admin/users/{userId}/force-logout`
  - `SUPER_ADMIN` only

### User file controls

- `GET /api/admin/users/{userId}/file-count`
  - Scope: `USER_RECORDS_OVERVIEW`
- `DELETE /api/admin/users/{userId}/files`
  - Scope: `USER_FILES_DELETE_ALL`

### File moderation

- `DELETE /api/admin/files/{id}` (`SUPER_ADMIN`)

### Security controls

- `POST /api/admin/security/blocked-ips` (`SUPER_ADMIN`)
- `DELETE /api/admin/security/blocked-ips` (`SUPER_ADMIN`)
- `GET /api/admin/security/blocked-ips` (`SUPER_ADMIN`)
- `PUT /api/admin/feature-flags/{flagKey}` (`SUPER_ADMIN`)
- `GET /api/admin/feature-flags` (`SUPER_ADMIN`)

### Audit and analytics

- `GET /api/admin/analytics`
  - Scope: `USER_RECORDS_OVERVIEW`
- `GET /api/admin/audit-events` (`SUPER_ADMIN`)
- `GET /api/admin/audit-events/export` (`SUPER_ADMIN`)

## 4) Super Admin APIs (`/api/super-admin`)

### Admin invitation and permissioning

- `POST /api/super-admin/admin-invites` (`SUPER_ADMIN`)
- `PUT /api/super-admin/admins/{userId}/permissions` (`SUPER_ADMIN`)
- `GET /api/super-admin/admin-invites/{token}/validate` (public)
- `POST /api/super-admin/admin-invites/accept` (public)

## 5) Date parsing behavior

`FileLoadController` supports multiple input formats for `startDate` / `endDate`:

- ISO local datetime
- offset datetime
- instant
- local date (converted to start-of-day)

Invalid values return `400` via global exception handling.
