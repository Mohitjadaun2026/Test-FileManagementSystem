# Batch Processing and File Lifecycle

## Components

- `BatchConfig` - declares job/step definitions.
- `BatchJobLauncherService` - async launcher, delayed start, retry wrapper.
- `FileProcessingTasklet` - status transitions and CSV validation execution.
- `RecordCountUtil` - CSV structure + content validation logic.

## Lifecycle State Machine

1. Upload endpoint creates row with `PENDING`.
2. `BatchJobLauncherService.launch(fileLoadId)` runs on async executor.
3. Launcher waits `PENDING_VISIBLE_DELAY_MS` (10s).
4. Job starts and tasklet sets `PROCESSING` in new tx.
5. Tasklet waits `PROCESSING_VISIBLE_DELAY_MS` (10s).
6. `RecordCountUtil.analyzeFile` evaluates content.
7. Final state:
   - `SUCCESS` + `recordCount`
   - `FAILED` + aggregated error message

## Validation Rules in `RecordCountUtil`

Expected CSV header:

`tradeId,clientId,stockSymbol,quantity,price,tradeType`

Rules per row:

- exactly 6 columns
- all required fields present
- `quantity` integer > 0
- `price` numeric > 0
- `tradeType` in `{BUY, SELL}`

On any invalid row, processing returns failed with combined messages.

## Failure Handling

- Launcher catches execution issues and marks row `FAILED`.
- Tasklet catches runtime errors and marks row `FAILED`.
- Retry endpoint can relaunch failed rows by resetting status.

## Why Delays Exist

Both `PENDING` and `PROCESSING` delays are intentionally introduced so UI polling can visibly show intermediate states instead of instantly jumping from upload to final status.

## Concurrency Considerations

- Tasklet status updates use `REQUIRES_NEW` transaction template.
- Launcher uses non-transactional template for job start to avoid transaction context conflicts.
- Launcher has limited retry when JobRepository reports existing tx context.

