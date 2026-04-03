# Backend Configuration

Primary file: `backend/api/src/main/resources/application.yml`

## Core settings

- datasource: MySQL (`spring.datasource.*`)
- JPA: `ddl-auto: update`
- multipart limits: 20MB
- batch schema initialization: enabled
- OAuth2 Google client registration
- JWT secret and expiration
- SSL toggles and keystore values
- frontend base URL (`app.frontend-base-url`)
- super-admin bootstrap settings (`app.super-admin.*`)

## Environment variables

Common runtime variables:

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- `JWT_SECRET`, `JWT_EXPIRATION`
- `SERVER_PORT`, `SERVER_SSL_ENABLED`
- `FRONTEND_BASE_URL`
- `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_USERNAME`, `SUPER_ADMIN_PASSWORD`

## Security chain highlights

From `SecurityConfig`:

- CORS enabled with localhost patterns (http + https)
- CSRF disabled for API token model
- JWT filter before username/password filter
- blocked-IP filter enabled
- method security enabled (`@EnableMethodSecurity`)

Public paths include:

- `/api/auth/**`
- `/oauth2/**`
- `/login/oauth2/**`
- `/uploads/**`
- `/api/super-admin/admin-invites/*/validate`
- `/api/super-admin/admin-invites/accept`
- swagger/openapi routes

## Bootstrap behavior

`SuperAdminBootstrap` ensures configured super-admin exists with all permissions:

- `USER_ACCESS_CONTROL`
- `USER_RECORDS_OVERVIEW`
- `USER_FILES_DELETE_ALL`

## Notes

- Keep secrets in `.env`, not committed files.
- Align frontend `environment.ts` `apiBaseUrl` with backend protocol/port.
- In production, tighten CORS origin list to explicit domains.
