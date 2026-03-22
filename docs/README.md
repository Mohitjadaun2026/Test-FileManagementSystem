# TradeNest Documentation Hub

This folder contains master-level technical documentation for the TradeNest application.

## Documentation Map

- `00-system-context.md` - Product scope, architecture boundaries, and terminology.
- `01-end-to-end-flows.md` - Business/user/API flows from login to file lifecycle.

### Backend
- `backend/README.md` - Backend docs index.
- `backend/architecture.md` - Module architecture (`api`, `service`, `dao`, `model`) and responsibilities.
- `backend/apis.md` - Endpoint-level API documentation and contracts.
- `backend/data-models.md` - Entities, DTOs, mapping rules, search criteria.
- `backend/batch-processing.md` - Async + Spring Batch processing lifecycle.
- `backend/error-handling.md` - Global exception strategy and response model.
- `backend/configuration.md` - Runtime config, environment vars, CORS, uploads.

### Frontend
- `frontend/README.md` - Frontend docs index.
- `frontend/routing-and-guards.md` - Route map and guard behavior.
- `frontend/services-and-state.md` - Service layer, token/state lifecycle, interceptor.
- `frontend/pages/login.md`
- `frontend/pages/register.md`
- `frontend/pages/oauth-callback.md`
- `frontend/pages/dashboard.md`
- `frontend/pages/file-list.md`
- `frontend/pages/file-upload.md`
- `frontend/pages/file-details.md`
- `frontend/pages/profile.md`
- `frontend/pages/shared-components.md`

### Security
- `security/README.md` - Security docs index.
- `security/authentication.md` - Local login/register and OAuth2 authentication.
- `security/authorization.md` - Role-based access and protected resources.
- `security/jwt-and-oauth.md` - JWT handling and OAuth2 handoff sequence.
- `security/hardening-checklist.md` - Security checklist and known implementation gaps.

## Source of Truth

These docs are written against the current implementation in:

- `backend/api/src/main/java/com/fileload/api/**`
- `backend/service/src/main/java/com/fileload/service/**`
- `backend/dao/src/main/java/com/fileload/dao/**`
- `backend/model/src/main/java/com/fileload/model/**`
- `frontend/src/app/**`

If code changes, update the relevant doc files in this folder to keep architecture and behavior documentation accurate.

