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
- `/v3/api-docs/**`
- `/swagger-ui/**`
- `/swagger-ui.html`
- `OPTIONS /**`

## Method-Level Authorization

`@EnableMethodSecurity` + `@PreAuthorize` in controllers:

### File APIs

- create/get/list/my-list/overview/updateMetadata/download: `USER` or `ADMIN`
- updateStatus/delete/archive/retry: `ADMIN` only

### Auth APIs

- register/login/oauth start/upload-profile are under public auth route; endpoint-level role checks are not applied there.

## Role Mapping

`CustomUserDetailsService` grants authority as `ROLE_<account.role>`.

Typical expected values:

- `USER`
- `ADMIN`

## Frontend Route Authorization

`AuthGuard` is coarse-grained:

- checks token existence only (not role)
- redirects unauthenticated users to login

Role-specific UI restrictions are not deeply enforced in routing and should rely on backend as source of truth.

