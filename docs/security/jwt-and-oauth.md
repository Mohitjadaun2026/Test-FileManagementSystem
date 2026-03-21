# JWT and OAuth2 Technical Notes

## JWT Implementation (`JwtUtil`)

- Algorithm: HMAC key from `jwt.secret`
- Claims:
  - subject = username/email string
  - issuedAt
  - expiration (default 24h)
- Methods:
  - `generateToken(username)`
  - `extractUsername(token)`
  - `isTokenValid(token)`

## JWT Request Processing

`JwtAuthenticationFilter`:

1. Reads `Authorization` header.
2. If starts with `Bearer `, validates token.
3. Extracts username and loads `UserDetails`.
4. Sets auth in `SecurityContext` when context is empty.
5. Proceeds filter chain.

## Frontend Token Injection

- `AuthInterceptor` appends bearer token globally.
- `FileLoadService` also appends auth headers manually (redundant but functional).

## OAuth2 Client Configuration

`application.yml`:

- registration id: `google`
- auth grant: `authorization_code`
- scopes: `profile,email`
- redirect uri default: `http://localhost:8080/login/oauth2/code/google`

## OAuth2 Success Redirect Contract

Backend redirects to:

`http://localhost:4200/oauth/callback?token=...&email=...&username=...&id=...&role=...`

Frontend callback consumes params and stores local session.

## Security Tradeoff Note

Passing token in query params is easy to implement but less secure than httpOnly cookie/session approaches due to possible logging/history leakage.

