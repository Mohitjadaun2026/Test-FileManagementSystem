# Page: Login (`/login`)

## Purpose

Authenticate users via:

- local credentials (username/email + password)
- Google OAuth2

## Component

- `login.component.ts`
- `login.component.html`
- `login.component.scss`

## UI Structure

- login form (`formGroup`) with two controls: `login`, `password`
- primary button for local sign-in
- divider + Google button with SVG icon
- link to `/register`
- link to `/forgot-password`

## Logic

### Local Sign-in

1. Validate form.
2. `AuthService.login(payload)`.
3. On success:
   - snackbar success
   - navigate to `returnUrl` query param if present
   - fallback `/files`
4. On error:
   - snackbar with `err.error.message` fallback

### Google Sign-in

- sets `oauthLoading`
- hard browser redirect to `${environment.apiBaseUrl}/auth/oauth2/google`

## Dependencies

- Angular ReactiveForms
- `MatSnackBar`
- Router + `ActivatedRoute`

## Error States

- invalid form blocks submit
- backend auth failures shown as toast
- oauth callback failure handled in separate callback page

## Notes

- Backend supports login alias by email through `LoginRequestDTO`.
- OAuth flow must have proper Google redirect URI configured on backend + Google Console.
- Password reset entry point is available through the forgot-password route.
