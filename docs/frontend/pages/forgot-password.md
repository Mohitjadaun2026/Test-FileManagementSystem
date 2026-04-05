# Page: Forgot Password (`/forgot-password`)

## Purpose

Start the password reset flow by requesting a reset link for an email address.

## Component

- `forgot-password.component.ts`
- `forgot-password.component.html`
- `forgot-password.component.scss`

## UI Structure

- email input
- send link button
- success state with sent email summary
- resend and back-to-login actions

## Logic

1. User enters email and submits the form.
2. Frontend calls `PasswordResetService.requestPasswordReset(email)`.
3. On success:
   - shows success state
   - stores the email for display
4. On error:
   - shows snackbar message from backend or fallback text

## Notes

- The backend response is intentionally generic to reduce account enumeration risk.
- A link-expiry message is displayed in the UI to guide the user.

