# Security Documentation

This section describes authentication, authorization, token handling, OAuth2 integration, and hardening guidance for TradeNest.

## Documents

- `authentication.md`
- `authorization.md`
- `roles-permissions-matrix.md`
- `jwt-and-oauth.md`
- `hardening-checklist.md`
- `detailed-security.md`

## Security Components in Code

- `SecurityConfig`
- `JwtAuthenticationFilter`
- `JwtUtil`
- `CustomUserDetailsService`
- `OAuth2SuccessHandler`
- `GlobalExceptionHandler`
- `AdminAuthorizationService`
- `IpBlockFilter`
- frontend `AuthInterceptor`, `AuthGuard`, `AdminScopeGuard`, `SuperAdminGuard`
