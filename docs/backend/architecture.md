# Backend Architecture

## Module Layout

## `backend/model`

Defines shared domain contracts:

- Entities: `FileLoad`, `UserAccount`, `FileStatus`
- DTOs: auth payloads, file response/search/update payloads, dashboard overview

Purpose: Keep model classes independent and reusable across modules.

## `backend/dao`

Data access layer:

- `FileLoadRepository`, `UserAccountRepository`
- `FileLoadSpecifications` for dynamic search filtering

Purpose: Encapsulate persistence and query composition.

## `backend/service`

Business orchestration layer:

- `FileLoadService` interface + `FileLoadServiceImpl`
- Mapper: `FileLoadMapper`
- CSV analysis utility: `RecordCountUtil`
- Async batch execution: `BatchConfig`, `BatchJobLauncherService`, `FileProcessingTasklet`

Purpose: Implement domain workflow independent of HTTP layer.

## `backend/api`

Delivery layer:

- Controllers: `AuthController`, `FileLoadController`
- Security: JWT filter/util, OAuth success handler, user details service
- Configuration: Security, CORS/resource handlers, OpenAPI, async enablement
- Global exception handling

Purpose: HTTP contracts, authn/authz boundaries, and API-level behavior.

## Dependency Direction

`api` -> `service` -> `dao` -> `model`

No cyclic dependency should exist between these modules.

## Transaction and Threading Notes

- Upload endpoint persists and flushes file metadata before async launch.
- Async launch uses `@Async` (`AsyncConfig`) and custom transaction templates.
- Tasklet updates status in `REQUIRES_NEW` transactions for deterministic state transitions.

## Key Architectural Decisions

1. **Store file physically + metadata in DB** for traceability and retrieval.
2. **Status-driven lifecycle** using enum and polling-friendly transitions.
3. **Specification-based filtering** for composable search criteria.
4. **Global exception response model** (`ApiErrorResponse`) for API consistency.
5. **Dual auth entry** (local credentials + OAuth2) converging to internal JWT session model.

