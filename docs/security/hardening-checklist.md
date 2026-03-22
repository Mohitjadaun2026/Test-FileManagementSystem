# Security Hardening Checklist

This checklist captures implementation-level hardening actions for TradeNest.

## Secrets and Configuration

- [ ] Remove hardcoded default secrets from `application.yml` fallbacks.
- [ ] Ensure `.env` is gitignored and never committed.
- [ ] Provide `.env.example` without sensitive values for onboarding.
- [ ] Rotate compromised OAuth client secret if ever committed.

## JWT

- [ ] Use long, random `JWT_SECRET` (>=32 bytes, preferably 64+).
- [ ] Consider key rotation strategy.
- [ ] Add refresh token strategy if long sessions are needed.

## OAuth2

- [ ] Restrict redirect URIs to exact expected values.
- [ ] Avoid sending JWT in URL query params in production.
- [ ] Prefer backend session handoff + secure cookie approach.

## API Surface

- [ ] Review public routes and keep minimum required `permitAll` paths.
- [ ] Add rate limiting for auth endpoints.
- [ ] Add brute-force protection for local login.

## Authorization

- [ ] Confirm all sensitive actions have `@PreAuthorize`.
- [ ] Validate role claims are sourced from DB and not client input.
- [ ] Add frontend role-aware hiding for admin-only actions (UX), while keeping backend enforcement as final authority.

## File Upload Security

- [ ] Validate content signatures (not only extension/MIME).
- [ ] Sanitize file names and store randomized server-side names.
- [ ] Add anti-malware scanning for production.
- [ ] Restrict profile image upload endpoint by authenticated user identity instead of free `userId` parameter.

## Logging and Observability

- [ ] Ensure logs never print passwords/tokens/secrets.
- [ ] Introduce request correlation IDs end-to-end.
- [ ] Surface `traceId` from error response in logs.

## Transport and Headers

- [ ] Enforce HTTPS in non-local deployments.
- [ ] Add secure headers (HSTS, X-Frame-Options, CSP).
- [ ] Verify CORS allow-list is environment-specific and strict in production.

## Dependency and Runtime Hygiene

- [ ] Run CVE scans for npm/maven dependencies regularly.
- [ ] Keep Spring/Angular dependencies updated.
- [ ] Pin production container/base image versions.

## Test Coverage for Security

- [ ] Add integration tests for:
  - unauthorized access -> 401
  - forbidden access -> 403
  - role-specific admin endpoints
  - invalid/expired token behavior
  - OAuth callback failure path

## Known Current Gaps (Codebase-Specific)

- Rest auth/denied handler classes exist but are empty.
- OAuth callback token is passed via URL query parameters.
- Backend register email regex enforces `.com` only; review business requirement.
- `application.yml` currently includes a DB password fallback value in this workspace.

