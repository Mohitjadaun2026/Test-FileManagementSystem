# Setup and Operations Runbook

## Local Development Startup

### Backend

```powershell
cd backend/api
mvn spring-boot:run
```

### Frontend

```powershell
cd frontend
npm install
ng serve --open
```

### Optional Root Scripts

```powershell
npm run backend
npm run frontend
```

## Required Runtime Dependencies

- Java 21
- Maven 3.9+
- Node 18+
- MySQL 8+

## Environment Variables

Configured in backend `application.yml` via env placeholders:

- DB: `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`
- OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- JWT: `JWT_SECRET`, `JWT_EXPIRATION`

## Google OAuth Local Setup

Authorized redirect URI must include:

- `http://localhost:8080/login/oauth2/code/google`

Common errors:

- `invalid_client` -> wrong client id/secret
- `redirect_uri_mismatch` -> URI mismatch with Google Console

## Validation Endpoints

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API docs JSON: `http://localhost:8080/v3/api-docs`

## Day-2 Operations

- Monitor upload folder growth (`backend/api/uploads`)
- Track failed loads and retry behavior
- Rotate OAuth/JWT secrets periodically
- Review DB size and indexing strategy as data grows

## Troubleshooting Quick Checks

1. Backend started and listening on `8080`
2. Frontend configured to backend base URL
3. JWT present in localStorage key `fl_user`
4. Browser network tab confirms `Authorization` header on protected API calls
5. MySQL reachable with configured credentials

