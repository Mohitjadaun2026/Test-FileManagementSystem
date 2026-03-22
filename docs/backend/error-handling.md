# Error Handling

## Strategy

TradeNest backend uses global centralized exception handling via:

- `@RestControllerAdvice` (`GlobalExceptionHandler`)
- structured response model (`ApiErrorResponse`)

## Response Shape

`ApiErrorResponse` fields:

- `timestamp`
- `status`
- `error`
- `message`
- `path`
- `traceId`
- `errors[]` (field-level violations)

## Exception Mapping

- `EntityNotFoundException` -> `404`
- `BadCredentialsException`, `AuthenticationException` -> `401`
- `AccessDeniedException` -> `403`
- `IllegalArgumentException`, `IllegalStateException` -> `400`
- `MethodArgumentNotValidException` -> `400` + field errors
- `ConstraintViolationException` -> `400` + field errors
- request parsing/type exceptions -> `400`
- `MaxUploadSizeExceededException` -> `413`
- `MultipartException` -> `400`
- `DataIntegrityViolationException` -> `409`
- `DataAccessException` -> `500`
- fallback `Exception` -> `500`

## Frontend Compatibility

Frontend components typically consume `err.error.message` for snackbars. The response model intentionally preserves a top-level `message` string for compatibility.

## Notes

- `traceId` is generated when `X-Request-Id` is absent.
- This advice covers request pipeline exceptions; async/background task failures are handled separately in service/batch code.

