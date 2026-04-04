# Roles and Permissions Matrix

## Roles

### `USER`

- Can upload files
- Can view own files
- Can view own profile and stats
- Can update own profile image/name
- Can use forgot/reset password flows

### `ADMIN`

- Everything a user can do
- Can access `/admin/users` if at least one admin permission is granted
- Can block/unblock users with `USER_ACCESS_CONTROL`
- Can view user file counts and analytics with `USER_RECORDS_OVERVIEW`
- Can delete all files for a user with `USER_FILES_DELETE_ALL`

### `SUPER_ADMIN`

- Full admin access
- Can create admin invites
- Can update admin permissions
- Can manage blocked IPs and feature flags
- Can audit/export admin actions
- Can manage any user/file moderation operation allowed by backend

## Permission Scopes

| Permission | Meaning | Main UI Surface |
|------------|---------|-----------------|
| `USER_ACCESS_CONTROL` | block/unblock users | `AdminUsersComponent` |
| `USER_RECORDS_OVERVIEW` | view file counts and user records | `AdminUsersComponent`, analytics |
| `USER_FILES_DELETE_ALL` | delete all files for a user | `AdminUsersComponent` |

## Guard Summary

- `AuthGuard` -> token presence
- `AdminScopeGuard` -> any admin permission or `SUPER_ADMIN`
- `SuperAdminGuard` -> `SUPER_ADMIN` only

