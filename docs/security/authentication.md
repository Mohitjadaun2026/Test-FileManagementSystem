# Authentication

## Supported Authentication Modes

1. **Local Authentication** (username/email + password)
2. **Google OAuth2 Authentication**

Both paths converge into the same app session model: backend-generated JWT consumed by frontend.

## Local Auth Path

### Register

- endpoint: `POST /api/auth/register`
- password hashed with `BCryptPasswordEncoder`
- duplicate email/username guarded by repository checks

### Login

- endpoint: `POST /api/auth/login`
- `AuthenticationManager` + `DaoAuthenticationProvider`
- user details loaded through `CustomUserDetailsService`
- principal username normalized to account email

## OAuth2 Path

- endpoint: `GET /api/auth/oauth2/google`
- redirects into Spring OAuth2 client flow
- successful login handled in `OAuth2SuccessHandler`

`OAuth2SuccessHandler` does:

- extracts user identity attributes (`email`, `name`)
- creates local user if absent
- generates JWT
- redirects to frontend callback with token and profile params

## Frontend Session Storage

- key: `fl_user` in localStorage
- contains token + identity payload
- exposed via `AuthService.currentUser$`

## Session Invalidity Conditions

- missing/invalid token
- explicit logout
- malformed localStorage payload (fails safe to null user)

## Current Gaps

- No refresh token model; token expiry currently requires re-login.
- OAuth callback passes token in URL query string (works but has leakage risk in logs/history).

