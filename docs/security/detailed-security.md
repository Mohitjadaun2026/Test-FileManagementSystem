# TradeNest Security: Detailed Implementation Guide

This document provides an in-depth explanation of the security features implemented in TradeNest, specifically focusing on:
- Account lockout (rate limiting on login attempts)
- SSL/HTTPS configuration for secure communication
- Logging (backend and frontend)

---

## 1. Account Lockout (Login Rate Limiting)

### Overview
To protect against brute-force attacks, TradeNest enforces an account lockout policy:
- After 5 consecutive failed password attempts, the user account is locked for 30 minutes.
- During lockout, all login attempts are rejected with a clear error message.
- On successful login, the failed attempt counter and lockout timer are reset.

### Technical Implementation
- **Entity Changes:**
  - `UserAccount` entity includes:
    - `failedLoginAttempts` (int, default 0)
    - `accountLockedUntil` (LocalDateTime, nullable)
- **Login Flow:**
  1. On each login attempt, the backend checks if `accountLockedUntil` is in the future. If so, login is blocked.
  2. On failed authentication, `failedLoginAttempts` is incremented. If it reaches 5, `accountLockedUntil` is set to now + 30 minutes.
  3. On successful authentication, both fields are reset.
- **Code Reference:**
  - See `AuthController.login()` for the main logic.
  - Example snippet:
    ```java
    if (user.getAccountLockedUntil() != null && user.getAccountLockedUntil().isAfter(now)) {
        // Block login
    }
    // ...
    if (failedLoginAttempts >= 5) {
        user.setAccountLockedUntil(now.plusMinutes(30));
    }
    ```
- **User Feedback:**
  - Error messages indicate remaining attempts or lockout duration.
  - Example: "Account locked due to too many failed login attempts. Try again in 30 minutes."

### Operational Notes
- Lockout is enforced per user account, not per IP.
- Lockout duration and threshold can be adjusted in code.
- All lockout events are logged (see Logging section).

---

## 2. SSL/HTTPS Configuration

### Overview
All communication between client and server is secured using HTTPS, both in development and production.

### Backend (Spring Boot)
- **Self-Signed Certificate for Local Dev:**
  - Keystore is generated and configured in `application.yml`:
    ```yaml
    server:
      ssl:
        enabled: true
        key-store: classpath:keystore.p12
        key-store-password: yourpassword
        key-store-type: PKCS12
        key-alias: youralias
    ```
- **Frontend (Angular):**
  - Dev server started with SSL:
    ```bash
    ng serve --ssl true --host localhost --port 4200
    ```
- **Browser Warnings:**
  - Self-signed certs cause `ERR_CERT_AUTHORITY_INVALID`. Bypassable for local dev.
- **Production:**
  - Use a CA-signed certificate for public deployments.

### Operational Notes
- All API endpoints and frontend assets are served over HTTPS.
- OAuth2 redirect URIs and environment configs must use `https://`.
- Never use HTTP in production.

---

## 3. Logging

### Backend Logging (Spring Boot)
- **Framework:** Uses SLF4J with Logback.
- **What is Logged:**
  - All authentication attempts (success/failure)
  - Account lockout events
  - All exceptions (via global exception handler)
  - Security-relevant actions (e.g., registration, password changes)
- **Sample Log Output:**
    ```
    INFO  Login API called for login: user@example.com
    WARN  Account locked for user: user@example.com until 2026-03-28T12:34:56
    INFO  User login successful: user@example.com
    ERROR Exception in AuthController: ...
    ```
- **Log Location:**
  - Console by default; can be configured to file in `logback.xml`.

### Frontend Logging (Angular)
- **What is Logged:**
  - All API call results (success/error)
  - User actions (login, file upload, etc.)
  - All errors (with context: component/service, method, error object)
- **How:**
  - Uses `console.log`, `console.error`, `console.warn` in all error handlers and service calls.
- **Sample Log Output:**
    ```js
    [FileListComponent] Error loading files: ...
    [AuthService] Login failed: ...
    ```
- **Log Location:**
  - Browser developer console.

### Operational Notes
- Backend logs should be monitored for repeated failed logins or suspicious activity.
- Frontend logs are for developer debugging; sensitive data should not be logged.

---

## 4. Security Best Practices (Implemented)
- **No secrets in code:** OAuth secrets and passwords are stored in environment files, not committed to version control.
- **HTTPS enforced:** All local and production traffic is encrypted.
- **Rate limiting:** Account lockout prevents brute-force attacks.
- **Comprehensive logging:** All security events are logged for audit and troubleshooting.

---

For further details, see the referenced code/config files or contact the TradeNest development team.
