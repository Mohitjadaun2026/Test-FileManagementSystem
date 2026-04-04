# Routing and Guards

## Route Table

From `AppRoutingModule`:

- `/` -> redirect `/dashboard`
- `/login` -> `LoginComponent`
- `/oauth/callback` -> `OauthCallbackComponent`
- `/register` -> `RegisterComponent`
- `/forgot-password` -> `ForgotPasswordComponent`
- `/reset-password` -> `ResetPasswordComponent`
- `/dashboard` -> public/overview page
- `/admin/users` -> `AdminUsersComponent` guarded by `AdminScopeGuard`
- `/super-admin/admin-invites` -> `AdminInviteComponent` guarded by `SuperAdminGuard`
- `/admin-invite` -> `AdminInviteComponent` legacy/public route
- `/files` -> guarded by `AuthGuard`
- `/files/:id` -> guarded by `AuthGuard`
- `/upload` -> guarded by `AuthGuard`
- `/profile` -> guarded by `AuthGuard`
- `**` -> redirect `/profile`

## Guard Behavior

### `AuthGuard`

- Checks `AuthService.isAuthenticated()`.
- If not authenticated, redirects to `/login` with `returnUrl` query param.

### `AdminScopeGuard`

- Allows access if current user has any of:
  - `USER_ACCESS_CONTROL`
  - `USER_RECORDS_OVERVIEW`
  - `USER_FILES_DELETE_ALL`
- Also allows `SUPER_ADMIN`.
- Used for `/admin/users`.

### `SuperAdminGuard`

- Requires authenticated `SUPER_ADMIN` role.
- Used for `/super-admin/admin-invites`.

## Navigation Pattern

Pages like dashboard quick-actions call `navigateTo(target, event)`:

- If authenticated -> navigate directly.
- If not authenticated -> route to `/login?returnUrl=<target>`.

## Shell Components

- `AppComponent` renders navbar + router outlet + footer.
- Navbar actions react to `currentUser$` stream.
- Profile avatar, admin links, and invite link are shown or hidden based on auth and role.

## Practical Notes

- OAuth callback route is intentionally public to receive redirect query params.
- Unknown routes currently redirect to `/profile`, which will then route unauthenticated users to login.
