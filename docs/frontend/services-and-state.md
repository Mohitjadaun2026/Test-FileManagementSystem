# Frontend Services and State Management

## `AuthService`

Responsibilities:

- Local auth API integration (`/auth/login`, `/auth/register`)
- profile image upload API integration (`/auth/upload-profile`)
- local storage persistence under key `fl_user`
- exposed reactive stream `currentUser$`
- helper methods: `isAuthenticated()`, `getToken()`, `logout()`, `updateUser()`

State model:

- User object from backend (`AuthResponseDTO` equivalent)
- includes `token`, `role`, `profileImage` path

## `FileLoadService`

Responsibilities:

- all file-load domain API calls (`/file-loads/**`)
- search + pagination + sort params building
- upload via multipart + progress events (`HttpRequest` with `reportProgress`)
- download as blob
- normalization of backend response variants through `normalizeFile`

Notable design:

- This service manually sets Authorization header using `authHeaders()`.
- Interceptor also adds bearer token globally; this is currently redundant but functional.

## `AuthInterceptor`

- Intercepts all requests.
- If token exists, clones request and attaches bearer header.
- Registered in `AppModule` via `HTTP_INTERCEPTORS` provider.

## Route Guard Integration

- `AuthGuard` uses `AuthService.isAuthenticated()`.
- Unauthorized users are redirected with `returnUrl`.

## Persistence and Session Model

- Session is client-managed via localStorage JWT.
- Browser refresh retains user unless storage is cleared.
- Logout removes local user and routes to home.

## UI Reactivity

Components subscribing to `currentUser$`:

- navbar
- profile dialog
- profile page
- oauth callback update path

This allows immediate UI updates after login, OAuth callback, and profile updates.

