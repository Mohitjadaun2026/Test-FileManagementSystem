# System Context

## Product Summary

TradeNest is a full-stack file ingestion and operational tracking platform for trade-related CSV data. The system supports:

- User authentication (username/email + password)
- Google OAuth2 sign-in
- File upload and async processing
- Search/filter of file loads
- Metadata updates, status updates, archive/retry/delete flows
- Dashboard KPIs and profile-level stats

## High-Level Architecture

- **Frontend**: Angular (Material UI), route-guarded SPA
- **Backend**: Spring Boot multi-module monorepo
  - `api` - controllers/security/config
  - `service` - business rules, batch launch, file analysis
  - `dao` - repositories and JPA specifications
  - `model` - entities and DTO contracts
- **Database**: MySQL
- **Storage**: Local disk (`uploads/`)

## Runtime Ports

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:8080`

## Core Domain Concepts

- **FileLoad**: the canonical record for uploaded files and lifecycle state
- **FileStatus** enum: `PENDING`, `PROCESSING`, `SUCCESS`, `FAILED`, `ARCHIVED`
- **UserAccount**: local/OAuth-backed user profile with role and optional profile image
- **DashboardOverviewDTO**: aggregated KPIs for dashboard cards

## Lifecycle

1. User authenticates (local or Google).
2. User uploads CSV file.
3. System stores file on disk and persists `FileLoad` in DB (`PENDING`).
4. Async batch launcher starts processing after a configured visibility delay.
5. Tasklet transitions status to `PROCESSING`, validates file content, then marks `SUCCESS`/`FAILED`.
6. UI polls and reflects changes.

## Intended Personas

- Operations users managing daily file intake
- Admin users changing statuses and deleting/archiving/retrying files
- Developers extending ingestion rules and APIs

## Technical Characteristics

- JWT-based stateless API auth for most endpoints
- OAuth2 login requiring short-lived session state for auth request flow
- Global exception handler returning structured error payloads
- Angular route protection via `AuthGuard`
- API contract normalization layer in frontend service (`normalizeFile`)

