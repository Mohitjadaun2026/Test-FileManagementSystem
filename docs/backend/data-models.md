# Data Models

## Entities

### `UserAccount`

Table: `users`

Fields:

- `id` (PK)
- `username` (unique)
- `email` (unique)
- `password` (bcrypt hash for local users; empty string for OAuth-created accounts)
- `role` (`USER`, `ADMIN`, `SUPER_ADMIN`)
- `profileImage` (relative file path)
- `failedLoginAttempts`
- `accountLockedUntil`
- `enabled`
- `tokenVersion`
- `adminPermissions` (CSV string)

### `FileLoad`

Table: `file_load`

Fields:

- `id`
- `filename`
- `fileType`
- `fileSize`
- `loadDate`
- `status` (`FileStatus` enum)
- `recordCount`
- `errors` (LOB)
- `description`
- `tags` (CSV string, mapped to list in DTO)
- `storagePath` (absolute/relative disk path)
- `uploadedById`
- `uploadedBy`

### `AdminAccessInvite`

Used by the super-admin invite flow.

Typical fields:

- invite token
- invited email
- generated password
- selected permissions
- expiration metadata
- accepted/consumed flags

### `AdminAuditEvent`

Stores admin and super-admin actions for review/export.

## Enums

### `FileStatus`

- `PENDING`
- `PROCESSING`
- `SUCCESS`
- `FAILED`
- `ARCHIVED`

### `UserRole`

- `USER`
- `ADMIN`
- `SUPER_ADMIN`

### `AdminPermission`

- `USER_ACCESS_CONTROL`
- `USER_RECORDS_OVERVIEW`
- `USER_FILES_DELETE_ALL`

## DTOs (Selected)

- `AuthResponseDTO` - user/session payload after login/register/oauth
- `LoginRequestDTO` - login payload with `@JsonAlias("email")`
- `RegisterRequestDTO` - registration payload (includes strict `.com` email regex)
- `FileLoadResponseDTO` - normalized API response for file list/details
- `SearchCriteriaDTO` - filter/sort/pagination payload
- `DashboardOverviewDTO` - aggregate counts and success-rate info
- `UpdateMetadataRequestDTO` - editable file metadata
- `UpdateStatusRequestDTO` - status transition request
- admin DTOs for invites, permissions, analytics, file counts, blocked IPs, and audit events

## Mapping Behavior

`FileLoadMapper.toDto`:

- Converts entity tags CSV -> `List<String>`
- Maps `loadDate` -> `uploadDate` in response DTO
- Preserves uploader id/name and error details

## Query Model

`FileLoadSpecifications.withCriteria` applies:

- `archived = false` baseline
- optional exact id, uploadedById, status
- optional filename contains (case-insensitive)
- optional date/record count ranges

This powers both global and per-user search endpoints.
