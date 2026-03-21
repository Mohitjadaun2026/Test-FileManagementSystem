# Routing and Guards

## Route Table

From `AppRoutingModule`:

- `/` -> redirect `/dashboard`
- `/login` -> `LoginComponent`
- `/oauth/callback` -> `OauthCallbackComponent`
- `/register` -> `RegisterComponent`
- `/dashboard` -> guarded
- `/files` -> guarded
- `/files/:id` -> guarded
- `/upload` -> guarded
- `/profile` -> guarded
- `**` -> redirect `/profile`

## Guard Behavior (`AuthGuard`)

- Uses `AuthService.isAuthenticated()` (checks presence of token in stored user object).
- If not authenticated, redirects to `/login` with `returnUrl` query param.

## Navigation Pattern

Pages like dashboard quick-actions call `navigateTo(target, event)`:

- If authenticated -> navigate directly.
- If not authenticated -> route to `/login?returnUrl=<target>`.

## Shell Components

- `AppComponent` renders navbar + router outlet + footer.
- Navbar visibility/actions react to `currentUser$` stream.

## Practical Notes

- OAuth callback route is intentionally public to receive redirect query params.
- Wildcard route currently redirects to `/profile` (guarded), so unauthenticated unknown routes eventually hit login redirect.

