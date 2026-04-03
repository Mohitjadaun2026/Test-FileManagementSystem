# Authorization

## Global Rule

In `SecurityConfig`:

- selected paths are `permitAll`
- all other paths require authentication

## Public Paths

- `/api/auth/**`
- `/oauth2/**`
- `/login/oauth2/**`
- `/uploads/**`
- `/api/super-admin/admin-invites/*/validate`
- `/api/super-admin/admin-invites/accept`
- `/v3/api-docs/**`
- `/swagger-ui/**`
- `/swagger-ui.html`
- `OPTIONS /**`

## Method-Level Authorization

`@EnableMethodSecurity` + `@PreAuthorize` in controllers:

### File APIs

- create/get/list/my-list/overview/updateMetadata/download: `USER`, `ADMIN`, or `SUPER_ADMIN` depending on endpoint
- updateStatus/delete/reprocess: admin-level only

### Admin APIs

- `GET /api/admin/users`: any of `USER_ACCESS_CONTROL`, `USER_RECORDS_OVERVIEW`, `USER_FILES_DELETE_ALL`
- `PATCH /api/admin/users/{userId}/enabled`: `USER_ACCESS_CONTROL`
- `GET /api/admin/users/{userId}/file-count`: `USER_RECORDS_OVERVIEW`
- `DELETE /api/admin/users/{userId}/files`: `USER_FILES_DELETE_ALL`
- analytics and many security actions are `SUPER_ADMIN` or permission-scoped

### Super Admin APIs

- invite creation and permission updates: `SUPER_ADMIN`
- invite validation/accept: public endpoints guarded by token validation logic

## Permission Mapping

`AdminPermission` currently contains:

- `USER_ACCESS_CONTROL`
- `USER_RECORDS_OVERVIEW`
- `USER_FILES_DELETE_ALL`

`AdminAuthorizationService` checks these scopes against the stored permission string.

## Role Mapping

`CustomUserDetailsService` grants authority as `ROLE_<account.role>`.

Typical expected values:

- `USER`
- `ADMIN`
- `SUPER_ADMIN`

## Frontend Route Authorization

Client-side guards are coarse-grained and should not be treated as final authority:

- `AuthGuard` checks token existence only
- `AdminScopeGuard` checks admin scopes and super-admin role
- `SuperAdminGuard` checks `SUPER_ADMIN` role

Backend enforcement remains the source of truth.
