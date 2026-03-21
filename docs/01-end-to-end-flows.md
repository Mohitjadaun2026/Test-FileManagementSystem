# End-to-End Flows

## 1) Local Authentication Flow

1. Frontend `LoginComponent` submits `{ login, password }`.
2. Backend `AuthController.login` authenticates with Spring `AuthenticationManager`.
3. User is resolved by email or username from `UserAccountRepository`.
4. `JwtUtil.generateToken` returns JWT.
5. Frontend stores user object (`fl_user`) in localStorage via `AuthService`.
6. Interceptor and/or manual headers attach `Authorization: Bearer <token>` to API calls.

## 2) Google OAuth Flow

1. User clicks `Continue with Google`.
2. Frontend redirects browser to `/api/auth/oauth2/google`.
3. Backend redirects to Spring endpoint `/oauth2/authorization/google`.
4. Google login/consent completes.
5. `OAuth2SuccessHandler`:
   - extracts email/name
   - creates local `UserAccount` if needed
   - generates JWT
   - redirects to `http://localhost:4200/oauth/callback?...` with token/user params.
6. `OauthCallbackComponent` stores user/token through `AuthService.updateUser`.
7. Frontend routes to `/files`.

## 3) File Upload and Processing Flow

1. User adds CSV in `FileUploadComponent` queue.
2. Frontend uploads using multipart request to `/api/file-loads`.
3. Backend `createFileLoad`:
   - validates extension/size/non-empty
   - writes file to `uploads/` with collision-safe naming
   - stores DB row (`PENDING`)
   - triggers `BatchJobLauncherService.launch` asynchronously.
4. Launcher sleeps (`PENDING_VISIBLE_DELAY_MS`) then starts batch job.
5. Tasklet marks row `PROCESSING`, sleeps (`PROCESSING_VISIBLE_DELAY_MS`), validates CSV content.
6. Status transitions to `SUCCESS` with record count or `FAILED` with message.
7. Frontend polling (`dashboard` + `file-list`) updates live UI.

## 4) Search / List / Details Flow

1. `FileSearchComponent` emits structured `SearchCriteria`.
2. `FileListComponent` calls `FileLoadService.myList` or `list`.
3. Backend maps params into `SearchCriteriaDTO` and applies JPA `Specification`.
4. User can view details, download file, edit metadata, update status, delete.

## 5) Profile Update Flow

1. Profile edit mode selects image file.
2. Frontend previews compressed image on client-side canvas.
3. Upload request sent to `/api/auth/upload-profile` with `file` + `userId`.
4. Backend stores profile image under `uploads/` and persists `profileImage` path.
5. Frontend updates user state and reloads image URL with cache-busting timestamp.

## 6) Error Handling Flow

1. Exceptions in request pipeline bubble to `GlobalExceptionHandler`.
2. Handler returns `ApiErrorResponse` with `status`, `message`, `path`, optional field errors.
3. Frontend consumes `err.error.message` for Snackbar display.

