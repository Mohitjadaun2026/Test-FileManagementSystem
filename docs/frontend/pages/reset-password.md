# Page: Reset Password (`/reset-password`)

## Purpose

Complete the password reset flow using the token provided by email.

## Component

- `reset-password.component.ts`
- `reset-password.component.html`
- `reset-password.component.scss`

## UI Structure

- token validation state
- new password input
- confirm password input
- visibility toggles for both password fields
- success and error states

## Logic

1. Page reads `token` from query string.
2. Backend token validation is called.
3. If valid, user can submit a new password.
4. Frontend calls `PasswordResetService.resetPassword(token, newPassword)`.
5. On success:
   - snackbar success message
   - redirect back to `/login`

## Validation

- `newPassword` required, minimum 6 characters
- `confirmPassword` required
- custom validator ensures the two values match

## Notes

- Invalid or expired tokens redirect back to `/forgot-password`.
- UI keeps the user on a dedicated reset state until the token is verified.

