# Page: Register (`/register`)

## Purpose

Create local user accounts.

## Component

- `register.component.ts`
- `register.component.html`
- `register.component.scss`

## UI Structure

- form fields: full name, email, password
- validation messages inline with Material errors
- submit button + link back to `/login`

## Validation

Frontend:

- name required, min length 2
- email required + email format
- password required, min length 6

Backend (`RegisterRequestDTO`) additionally enforces:

- `.com` email regex pattern

## Logic

1. Validate form.
2. Map frontend `name` to backend `username` in service.
3. Call `AuthService.register`.
4. On success:
   - snackbar success
   - navigate to `/login`
5. On error:
   - snackbar with backend message

## Notes

- Because backend has stricter `.com` rule than frontend, some valid frontend emails may still be rejected server-side. This is expected with current implementation.
- After registration, users continue to the login page and can also access password reset if needed.
