# Backend Documentation

This section documents the Spring Boot backend under `backend/`.

## Scope

- `backend/api` - controllers, security, config, exception handling
- `backend/service` - domain workflows, batch orchestration, admin services
- `backend/dao` - repositories and specifications
- `backend/model` - entities, enums, DTO contracts

## Documents

- `architecture.md`
- `apis.md`
- `data-models.md`
- `batch-processing.md`
- `error-handling.md`
- `configuration.md`

## Current Backend Capabilities

- Local auth + Google OAuth2 login
- JWT session model with token version revocation support
- File upload and asynchronous CSV processing lifecycle
- User profile fetch and image upload
- Admin scope-based user management (`/api/admin/**`)
- Super-admin invite and permission controls (`/api/super-admin/**`)
- Security control layer (blocked IPs, feature flags, admin audit stream)

## Runtime Summary

- Spring Boot 3.x
- Java 21
- MySQL datasource
- Spring Security method-level authorization (`@PreAuthorize`)
- Spring Batch-backed file processing
