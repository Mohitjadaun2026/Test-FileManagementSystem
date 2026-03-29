# TradeNest Presentation Guide: File Listing, Search, File Details, and Post-Upload Flow

This document is designed as a presentation-ready narrative for explaining the complete frontend + backend behavior of:

1. File Upload
2. File Processing Lifecycle
3. File Listing
4. File Search/Filtering
5. File Details

---

## 1) Big Picture: What Happens After Upload?

### One-line summary

When a user uploads a CSV file, TradeNest stores the file on disk, creates a DB record with `PENDING`, triggers async batch processing, and then the UI continuously reflects status transitions (`PENDING -> PROCESSING -> SUCCESS/FAILED`) through list and dashboard refresh.

### High-level architecture in this flow

- **Frontend (Angular)**
  - Upload UI: `frontend/src/app/components/file-upload/file-upload.component.ts`
  - List UI: `frontend/src/app/components/file-list/file-list.component.ts`
  - Search UI: `frontend/src/app/components/file-search/file-search.component.ts`
  - Details UI: `frontend/src/app/components/file-details/file-details.component.ts`
  - API client: `frontend/src/app/services/file-load.service.ts`

- **Backend (Spring Boot)**
  - HTTP APIs: `backend/api/src/main/java/com/fileload/api/controller/FileLoadController.java`
  - Core business logic: `backend/service/src/main/java/com/fileload/service/impl/FileLoadServiceImpl.java`
  - Batch launcher: `backend/service/src/main/java/com/fileload/service/batch/BatchJobLauncherService.java`
  - Processing tasklet: `backend/service/src/main/java/com/fileload/service/batch/FileProcessingTasklet.java`
  - CSV validation/count rules: `backend/service/src/main/java/com/fileload/service/util/RecordCountUtil.java`
  - Persistence: `backend/dao/src/main/java/com/fileload/dao/repository/FileLoadRepository.java`

---

## 2) Upload Flow (Frontend -> Backend -> Async Processing)

## Frontend Upload Behavior

### Component responsibilities

`file-upload.component.ts` manages:

- Drag-and-drop and file picker input
- Client validation (CSV type, max 20 MB)
- Upload queue with per-file state:
  - `queued`
  - `uploading`
  - `done`
  - `error`
  - `canceled`
- Progress bar and cancel controls

### API call used

`FileLoadService.upload(file, extra)` sends multipart request:

- Endpoint: `POST /api/file-loads`
- Payload includes:
  - `file`
  - optional `description`
  - optional `tags`

> Presentation note: frontend sends description/tags in upload request, but current backend create endpoint only consumes `file` directly.

## Backend Upload Endpoint

### API method

`FileLoadController.createFileLoad(...)`

- Route: `POST /api/file-loads`
- Auth: `USER` or `ADMIN`
- Content-Type: multipart/form-data

### Service method

`FileLoadServiceImpl.createFileLoad(MultipartFile file)` does:

1. Normalize filename
2. Validate file rules
   - extension must be `.csv`
   - not empty
   - max size 20MB
3. Save physical file into `uploads/`
4. Create `FileLoad` row with:
   - `status = PENDING`
   - `recordCount = 0`
   - `storagePath = <saved path>`
   - uploader info from current security context
5. `saveAndFlush` DB row
6. Trigger `batchJobLauncherService.launch(fileLoadId)` async

If validation fails, it still persists as `FAILED` with error reason.

---

## 3) What Happens in Background After Upload?

## Async launch stage

`BatchJobLauncherService.launch(fileLoadId)`:

- Runs in async thread (`@Async`)
- Sleeps ~10s intentionally (`PENDING_VISIBLE_DELAY_MS`) so UI can show PENDING state
- Starts Spring Batch job with `fileLoadId`

## Processing stage

`FileProcessingTasklet.execute(...)`:

1. Loads `FileLoad` by id
2. Sets status to `PROCESSING` in new transaction
3. Sleeps ~10s (`PROCESSING_VISIBLE_DELAY_MS`) so UI can show PROCESSING state
4. Calls `RecordCountUtil.analyzeFile(...)`
5. Final update:
   - `SUCCESS` + computed `recordCount`
   - OR `FAILED` + joined error messages

## CSV validation logic

`RecordCountUtil` expects header exactly:

`tradeId,clientId,stockSymbol,quantity,price,tradeType`

Each row checks:

- correct column count (6)
- no empty required fields
- `quantity` integer > 0
- `price` numeric > 0
- `tradeType` in `BUY` or `SELL`

Any invalidity -> failed processing with detailed line-based messages.

---

## 4) File Listing Flow (Frontend and Backend)

## Frontend Listing (`/files`)

### Main component

`FileListComponent` in `file-list.component.ts`

Responsibilities:

- Load current user's file loads (`myList` API)
- Render table with columns:
  - select
  - id
  - filename
  - uploadDate
  - status
  - recordCount
  - actions
- Pagination + sorting
- Row actions:
  - view
  - download
  - update status
  - delete
- Bulk actions:
  - delete selected
  - delete all matching

### Polling behavior

It polls every 1 second using `timer(1000, 1000)` to refresh status transitions live.

### Data source mapping

`FileLoadService.myList(criteria)` normalizes backend payload via `normalizeFile(...)` so UI gets consistent object shape.

## Backend listing endpoint

`FileLoadController.searchMyFileLoads(...)`

- Route: `GET /api/file-loads/my`
- Accepts filter params + pagination + sort
- Builds `SearchCriteriaDTO`
- Calls `FileLoadServiceImpl.searchMyFileLoads(criteria)`

Service logic:

1. Resolve authenticated user id from security context
2. Inject `uploadedById` into criteria
3. Reuse common `searchInternal` pipeline
4. Apply JPA specification filters + pageable sort

---

## 5) File Search/Filter Flow (Frontend and Backend)

## Frontend Search Component

`FileSearchComponent` emits search criteria to file list.

Fields:

- `fileId`
- `filename`
- `status`
- `startDate`
- `endDate`
- `recordCountMin`
- `recordCountMax`

### Important frontend transformations

- Datepicker values converted to local datetime string:
  - start date -> `T00:00:00`
  - end date -> `T23:59:59`
- If all filters are cleared, component auto-emits default unfiltered search

## Backend filtering mechanics

`FileLoadSpecifications.withCriteria(criteria)` builds dynamic predicates:

- always excludes archived (`archived = false`)
- optional exact id
- optional filename contains (case-insensitive)
- optional status match
- optional uploader id (for `/my` endpoint)
- optional date range
- optional record count range

Sort translation in service:

- frontend `uploadDate` mapped to entity field `loadDate`

---

## 6) File Details Flow (Single File Deep View)

## Frontend details page (`/files/:id`)

`FileDetailsComponent`:

- Reads route param `id`
- Calls `FileLoadService.details(id)`
- Displays complete metadata/status card
- Supports:
  - download
  - delete
  - update status
  - metadata edit (description + tags)

### Metadata update

- UI converts comma-separated tags input into `string[]`
- Calls `PATCH /api/file-loads/{id}`

### Status update

- Uses reusable `StatusUpdateComponent` (dialog/inline)
- Calls `PUT /api/file-loads/{id}/status`

## Backend details endpoint

`GET /api/file-loads/{id}`

- Loads entity by id
- Maps via `FileLoadMapper.toDto(...)`
- Returns `FileLoadResponseDTO`

## Backend metadata endpoint

`PATCH /api/file-loads/{id}`

- Updates description and tags (stored as CSV string in entity)
- Returns updated DTO

## Backend download endpoint

`GET /api/file-loads/{id}/download`

- Reads physical bytes from `storagePath`
- Returns attachment headers

---

## 7) Status Model You Can Explain in Slides

## Enum values

From `FileStatus`:

- `PENDING`
- `PROCESSING`
- `SUCCESS`
- `FAILED`
- `ARCHIVED`

## Meaning

- **PENDING**: file accepted, waiting to enter processing
- **PROCESSING**: batch task actively validating/analyzing file
- **SUCCESS**: valid file processed, record count available
- **FAILED**: validation/business rule failure, error message stored
- **ARCHIVED**: file logically hidden from active list/search

## UI mapping

Frontend maps status to badge classes in list/details for quick visual cognition.

---

## 8) Security in This Flow

- Upload/list/details APIs require JWT auth (`USER`/`ADMIN`) except public overview endpoint if configured open.
- Status update/delete/archive/retry are `ADMIN`-only.
- JWT added by interceptor and also manually in file service headers.
- Global exception handler returns structured error responses (`ApiErrorResponse`) consumed by frontend snackbars.

---

## 9) Error Handling Story for Presentation

## Frontend

- Uses snackbar to show operation-level failure:
  - load failed
  - upload failed
  - delete/save/download failed

## Backend

`GlobalExceptionHandler` maps exceptions to consistent HTTP responses:

- 400 (bad request/validation)
- 401 (unauthorized)
- 403 (forbidden)
- 404 (not found)
- 409 (data conflict)
- 413 (payload too large)
- 500 (unexpected)

This makes failure modes predictable and easier to explain/debug.

---

## 10) Presentation Script (Ready-to-Speak)

Use this concise narrative:

> "In TradeNest, once a CSV is uploaded, we first persist the physical file and a FileLoad record in PENDING state. An async batch launcher then picks it up, transitions it to PROCESSING, validates content row-by-row with strict trade rules, and finally marks SUCCESS with record count or FAILED with line-level error context. The file listing page polls near real-time so users can observe state transitions immediately. Search is dynamic and server-driven through JPA specifications, supporting filename, status, date range, and record count filters. File details provides deep inspection and management actions including metadata edit, status update, download, and delete. This end-to-end path is secured with JWT/OAuth and standardized error handling, making both operations and troubleshooting predictable." 

---

## 11) Q&A Preparation (Senior-Developer Level Questions)

### Q: Why async + delays?
A: Async prevents blocking upload request thread; delays are intentional UX visibility windows so lifecycle is observable in polling UI.

### Q: How is filtering implemented?
A: Via `SearchCriteriaDTO` + `FileLoadSpecifications` predicates with pageable sorting and archive exclusion baseline.

### Q: How are tags stored?
A: Entity stores CSV string; mapper/service converts to/from list.

### Q: What if CSV has mixed valid/invalid rows?
A: Current util treats any detected validation errors as overall failure and stores combined message.

### Q: Where is source-of-truth for status?
A: Backend DB (`FileLoad.status`). Frontend is purely representational.

### Q: What secures endpoints?
A: Spring Security + JWT filter + method-level `@PreAuthorize` for role-sensitive operations.

---

## 12) Key Source Files to Mention in Demo

### Frontend

- `frontend/src/app/components/file-upload/file-upload.component.ts`
- `frontend/src/app/components/file-list/file-list.component.ts`
- `frontend/src/app/components/file-search/file-search.component.ts`
- `frontend/src/app/components/file-details/file-details.component.ts`
- `frontend/src/app/services/file-load.service.ts`

### Backend

- `backend/api/src/main/java/com/fileload/api/controller/FileLoadController.java`
- `backend/service/src/main/java/com/fileload/service/impl/FileLoadServiceImpl.java`
- `backend/service/src/main/java/com/fileload/service/batch/BatchJobLauncherService.java`
- `backend/service/src/main/java/com/fileload/service/batch/FileProcessingTasklet.java`
- `backend/service/src/main/java/com/fileload/service/util/RecordCountUtil.java`
- `backend/dao/src/main/java/com/fileload/dao/specification/FileLoadSpecifications.java`

---

## 13) Optional Improvement Slide (Future Enhancements)

- consume `description`/`tags` directly in upload create endpoint
- role-aware frontend controls for admin-only actions
- remove duplicate auth header logic (interceptor vs service)
- migrate OAuth callback token-in-query to secure cookie/code exchange approach
- add integration tests for full upload -> processing -> list/details consistency

---

End of presentation guide.

