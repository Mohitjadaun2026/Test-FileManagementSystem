# Data Models

## Entities

## `UserAccount`

Table: `users`

Fields:

- `id` (PK)
- `username` (unique)
- `email` (unique)
- `password` (bcrypt hash for local users; empty string for OAuth-created accounts)
- `role` (`USER`/`ADMIN` expected)
- `profileImage` (relative file path)

## `FileLoad`

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
- `archived` (boolean)
- `storagePath` (absolute/relative disk path)
- `uploadedById`
- `uploadedBy`

## Enum

`FileStatus`

- `PENDING`
- `PROCESSING`
- `SUCCESS`
- `FAILED`
- `ARCHIVED`

## DTOs (Selected)

- `AuthResponseDTO` - user/session payload after login/register/oauth
- `LoginRequestDTO` - login payload with `@JsonAlias("email")`
- `RegisterRequestDTO` - registration payload (includes strict `.com` email regex)
- `FileLoadResponseDTO` - normalized API response for file list/details
- `SearchCriteriaDTO` - filter/sort/pagination payload
- `DashboardOverviewDTO` - aggregate counts and success-rate info
- `UpdateMetadataRequestDTO` - editable file metadata
- `UpdateStatusRequestDTO` - status transition request

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

