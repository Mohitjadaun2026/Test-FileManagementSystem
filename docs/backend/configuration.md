# Backend Configuration

## Primary Config

File: `backend/api/src/main/resources/application.yml`

Highlights:

- `spring.config.import: optional:file:.env[.properties]`
- datasource URL/user/password
- JPA auto-update schema
- multipart max size (`50MB`)
- OAuth2 registration/provider blocks for Google
- server SSL toggles
- springdoc paths
- JWT secret/expiration

## Environment Variables

Common runtime variables:

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- `JWT_SECRET`, `JWT_EXPIRATION`
- `SERVER_PORT`, `SERVER_SSL_ENABLED`

## Security Config

`SecurityConfig`:

- CORS enabled
- CSRF disabled (JWT API model)
- session policy `IF_REQUIRED` (needed for OAuth2 auth request state)
- public paths include:
  - `/api/auth/**`
  - `/oauth2/**`
  - `/login/oauth2/**`
  - `/uploads/**`
  - OpenAPI/Swagger routes
- all others require authentication
- custom JWT filter inserted before username/password filter

## Web MVC Config

`WebConfig`:

- CORS mapping for `/api/**`
- static resource handler for uploaded files:
  - `/uploads/**` -> `file:uploads/`

## OpenAPI

`OpenApiConfig` defines bearer auth security scheme and API metadata. Swagger UI available at `/swagger-ui.html`.

## Async

`AsyncConfig` enables `@Async` execution used by batch launcher.

## Operational Caveat

Current `application.yml` in this workspace still includes a default DB password fallback (`${DB_PASSWORD:Mohit@123}`). For shared or production environments, remove hardcoded fallbacks and use secret-managed environment values only.

