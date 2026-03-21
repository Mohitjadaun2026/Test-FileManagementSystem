# Page: OAuth Callback (`/oauth/callback`)

## Purpose

Finish Google OAuth sign-in by converting query params into local app session state.

## Component

- `oauth-callback.component.ts`
- minimal waiting template in `oauth-callback.component.html`

## Inputs (Query Params)

Expected:

- `token`
- `email`
- `username`
- `id`
- `role`

## Logic

1. Read params from route snapshot.
2. If `token` or `email` missing:
   - show failure snackbar
   - redirect `/login`
3. Else:
   - call `AuthService.updateUser(...)`
   - show success snackbar
   - redirect `/files`

## Backend Coupling

These params are emitted by `OAuth2SuccessHandler` redirect URL builder.

## Security Consideration

Token and user identity are passed in URL query params in current implementation. This works functionally, but production hardening may prefer cookie-based or code-exchange callback models to reduce token exposure in URL logs/history.

