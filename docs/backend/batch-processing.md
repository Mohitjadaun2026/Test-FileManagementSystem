# Batch Processing and File Lifecycle

## Main components

- `BatchConfig` - job and step definitions
- `BatchJobLauncherService` - async launch orchestration
- `FileProcessingTasklet` - executes validation and status transitions
- `RecordCountUtil` - CSV schema/content checks

## Lifecycle

1. Upload API stores file and creates DB row with `PENDING`.
2. Batch launcher is triggered asynchronously.
3. Worker marks row `PROCESSING`.
4. CSV is analyzed.
5. Final state becomes:
   - `SUCCESS` with computed `recordCount`, or
   - `FAILED` with error text

## Validation rule summary

Expected header:

`tradeId,clientId,stockSymbol,quantity,price,tradeType`

Per-row checks:

- 6 columns required
- no mandatory empty values
- `quantity` positive integer
- `price` positive number
- `tradeType` in `BUY` or `SELL`

## Retry and recovery

- Failed rows can be retried through admin endpoint (`/api/admin/files/{id}/reprocess`, super-admin only).
- Delete operations attempt both file-system cleanup and DB cleanup.

## Operational notes

- Processing is asynchronous, so list/dashboard polling is expected.
- A file can fail validation even if upload itself succeeds.
- Physical filename uniqueness is handled by appending `-1`, `-2`, ... when a name collision exists in `uploads/`.
