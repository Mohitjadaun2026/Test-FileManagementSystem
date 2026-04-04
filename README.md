# TradeNest

TradeNest is a full-stack file management platform with:

- Angular 17 frontend
- Spring Boot 3 backend
- MySQL persistence
- JWT authentication
- Google OAuth2 login
- role-based admin and super-admin controls
- asynchronous CSV processing

## Highlights

### User features

- local login and Google OAuth2
- file upload and processing status tracking
- file search, list, details, download, and delete
- profile image upload and profile editing
- dashboard summary cards and live updates

### Admin features

- block/unblock users
- view user file counts when permitted
- delete all files for a user when permitted
- admin user management page

### Super-admin features

- create scoped admin invites
- validate and accept invite tokens
- update admin permissions
- manage blocked IPs, feature flags, analytics, and audit logs

## Roles and permissions

| Role | Main capability |
|------|-----------------|
| `USER` | manage own files and profile |
| `ADMIN` | manage users within assigned permissions |
| `SUPER_ADMIN` | full admin/security control |

Permission scopes used by admin pages:

- `USER_ACCESS_CONTROL`
- `USER_RECORDS_OVERVIEW`
- `USER_FILES_DELETE_ALL`

## Documentation hub

Start here:

- `docs/README.md`
- `docs/00-system-context.md`
- `docs/01-end-to-end-flows.md`
- `docs/setup-and-operations.md`
- `docs/presentation-file-listing-search-details.md`

Section docs:

- `docs/frontend/README.md`
- `docs/backend/README.md`
- `docs/security/README.md`

Useful page docs:

- `docs/frontend/pages/login.md`
- `docs/frontend/pages/forgot-password.md`
- `docs/frontend/pages/reset-password.md`
- `docs/frontend/pages/dashboard.md`
- `docs/frontend/pages/file-list.md`
- `docs/frontend/pages/file-details.md`
- `docs/frontend/pages/profile.md`
- `docs/frontend/pages/admin-users.md`
- `docs/frontend/pages/admin-invite.md`

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 17 + Angular Material |
| Backend | Spring Boot 3 / Spring Security / Spring Batch |
| Database | MySQL |
| Auth | JWT + Google OAuth2 |
| Build tools | npm + Maven |

## Requirements

- Java 21+
- Maven 3.9+
- Node.js 18+
- npm 9+
- MySQL 8+

## Quick start

### 1. Configure backend environment

Create `backend/api/.env` with values like:

```dotenv
DB_URL=jdbc:mysql://localhost:3306/file_load_mgmt?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:8080/login/oauth2/code/google
JWT_SECRET=your_secret_key_here_min_32_chars
JWT_EXPIRATION=86400000
FRONTEND_BASE_URL=https://localhost:4200
SUPER_ADMIN_EMAIL=superadmin@gmail.com
SUPER_ADMIN_USERNAME=superadmin
SUPER_ADMIN_PASSWORD=super@123
```

### 2. Start backend

```powershell
cd backend/api
mvn spring-boot:run
```

Backend base URL: `http://localhost:8080`

### 3. Start frontend

```powershell
cd frontend
npm install
npm start
```

Frontend base URL: `https://localhost:4200`

## Root scripts

From the repository root:

```powershell
npm run frontend
npm start
npm run backend
```

- `npm run frontend` -> starts the Angular app through the root helper script
- `npm run backend` -> starts the Spring Boot API
- `npm start` -> same as the frontend helper

## Project structure

```text
Test-FileManagementSystem/
├── backend/
│   ├── api/
│   ├── dao/
│   ├── model/
│   └── service/
├── docs/
├── frontend/
├── csv/
├── test-data/
└── uploads/
```

## Operational notes

- Uploaded files are stored on disk under `backend/uploads/`.
- File metadata and IDs are stored in MySQL.
- MySQL auto-increment values continue after deletes unless the table is truncated/reset.
- The file list page shows a user-friendly row number, not the raw DB primary key.
- Backend authorization is the final source of truth; frontend guards are for UX only.

## Troubleshooting

- If login or OAuth fails, check Google redirect URI and backend `.env`.
- If file upload fails, confirm the backend is running and the CSV is valid.
- If admin pages show access denied, confirm the current user has the required permission scope.

## License

MIT
