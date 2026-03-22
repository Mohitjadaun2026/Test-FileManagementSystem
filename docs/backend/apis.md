# Backend API Documentation

Base URL (local): `http://localhost:8080/api`

## Authentication APIs (`/api/auth`)

### `POST /api/auth/register`

- Request: `RegisterRequestDTO` (`username`, `email`, `password`)
- Validation:
  - username length 2..100
  - email must match `.com` pattern in backend DTO
  - password length 6..255
- Behavior:
  - rejects duplicate email/username (`IllegalArgumentException`)
  - stores bcrypt password
  - assigns role `USER`
  - returns `AuthResponseDTO` with JWT

### `POST /api/auth/login`

- Request: `LoginRequestDTO`
  - accepts `login` field; also supports alias `email` via `@JsonAlias`
- Behavior:
  - authenticates via Spring `AuthenticationManager`
  - resolves user by email OR username
  - returns `AuthResponseDTO` with JWT

### `GET /api/auth/oauth2/google`

- Behavior:
  - redirects to `/oauth2/authorization/google`
  - final success redirect handled by `OAuth2SuccessHandler`

### `POST /api/auth/upload-profile`

- Multipart fields: `file`, `userId`
- Behavior:
  - stores file under `uploads/`
  - updates `UserAccount.profileImage`
  - returns `{ profileImage: "/uploads/<name>" }`

## File Load APIs (`/api/file-loads`)

### `POST /api/file-loads`

- Auth: USER/ADMIN
- Input: multipart `file`
- Creates a `FileLoad` record and starts async batch processing.
- Returns `201` with `FileLoadResponseDTO`.

### `GET /api/file-loads/{id}`

- Auth: USER/ADMIN
- Returns file metadata by id.

### `GET /api/file-loads`

- Auth: USER/ADMIN
- Full search endpoint with optional query params:
  - `fileId`, `filename`, `status`, `startDate`, `endDate`, `recordCountMin`, `recordCountMax`, `page`, `size`, `sort`
- Returns pageable response.

### `GET /api/file-loads/my`

- Auth: USER/ADMIN
- Same filter model as global search, additionally constrained to current authenticated user.

### `GET /api/file-loads/overview`

- Auth: USER/ADMIN
- Returns `DashboardOverviewDTO` with aggregate KPIs.

### `PUT /api/file-loads/{id}/status`

- Auth: ADMIN
- Input: `UpdateStatusRequestDTO` (`status`, optional `comment`)
- Updates lifecycle state and optional comment.

### `PATCH /api/file-loads/{id}`

- Auth: USER/ADMIN
- Input: `UpdateMetadataRequestDTO` (`description`, `tags[]`)
- Updates metadata fields.

### `DELETE /api/file-loads/{id}`

- Auth: ADMIN
- Removes DB row and attempts to delete underlying physical file.

### `POST /api/file-loads/{id}/archive`

- Auth: ADMIN
- Marks as archived and sets status to `ARCHIVED`.

### `POST /api/file-loads/{id}/retry`

- Auth: ADMIN
- Resets to `PENDING`, clears error text, and relaunches batch.

### `GET /api/file-loads/{id}/download`

- Auth: USER/ADMIN
- Returns original file bytes with attachment disposition.

## Date Parsing Rules

`FileLoadController` accepts multiple date formats:

- ISO local datetime
- Offset datetime
- Instant
- Local date (converted to start-of-day)

Invalid values throw `IllegalArgumentException` and are surfaced through global handler.

