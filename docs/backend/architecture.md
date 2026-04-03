# Backend Architecture

## Module structure

### `backend/model`

Shared contracts used by all backend modules:

- entities: `UserAccount`, `FileLoad`, `AdminAccessInvite`, `AdminAuditEvent`
- enums: `UserRole`, `FileStatus`, `AdminPermission`
- DTOs: auth, file, password reset, admin/super-admin requests and responses

### `backend/dao`

Persistence layer:

- repositories for users, file loads, invites, audit events
- dynamic search via `FileLoadSpecifications`

### `backend/service`

Business workflows:

- `FileLoadServiceImpl` for upload/search/metadata/delete/download
- `AdminServiceImpl` for user admin operations, audit, analytics
- `SuperAdminServiceImpl` for invites and permission management
- batch pipeline: launcher + tasklet + CSV validation utility

### `backend/api`

Delivery and security boundary:

- controllers: `AuthController`, `FileLoadController`, `AdminController`, `SuperAdminController`
- security: JWT filter/util, OAuth success handler, user details service
- additional controls: `IpBlockFilter`, `SecurityControlService`, `AdminAuthorizationService`
- configuration: security chain, CORS/resource handlers, OpenAPI, bootstrap seeding, async
- global exception mapping

## Dependency direction

`api -> service -> dao -> model`

## Processing architecture

- File upload stores physical file under `uploads/`.
- DB metadata is persisted with status `PENDING`.
- Async batch updates through `PROCESSING` to `SUCCESS`/`FAILED`.
- UI polls list endpoints for state transitions.

## Authorization architecture

- coarse endpoint auth in `SecurityConfig`
- fine-grained method auth via `@PreAuthorize`
- scope checks through `AdminAuthorizationService`

## Admin model summary

- `SUPER_ADMIN`: unrestricted admin controls
- `ADMIN`: allowed subset controlled by `AdminPermission`
  - `USER_ACCESS_CONTROL`
  - `USER_RECORDS_OVERVIEW`
  - `USER_FILES_DELETE_ALL`

## Core design decisions

1. Keep backend authorization as final source of truth.
2. Support both OAuth and credential login while converging to JWT.
3. Isolate admin workflows from user workflows with dedicated controllers/services.
4. Keep file metadata queryable and physical files downloadable with ownership checks.
