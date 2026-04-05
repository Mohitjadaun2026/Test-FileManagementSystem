# Page: Dashboard (`/dashboard`)

## Purpose

Provide operational overview and entry points to core workflows.

## Component

- `dashboard.component.ts`
- `dashboard.component.html`
- `dashboard.component.scss`

## Key Areas

1. Hero section (branding, quick actions)
2. Live metrics card (`Today at a glance`)
3. Processing flow timeline
4. Capability/benefit/action sections

## Data Loading Strategy

- Poll interval: every 10 seconds (`interval(10000)` + `startWith(0)`)
- Primary source: `/file-loads/overview`
- If overview data is missing or fails:
  - admins with `USER_RECORDS_OVERVIEW` fall back to global file search aggregation
  - admins without record-overview access fall back to scoped `myList()` aggregation

## KPI Fields

- total uploads
- in processing
- success rate
- exceptions today
- pending/processing/success counts

## Auth-Aware Navigation

Action links call `navigateTo('/upload' | '/files')`:

- authenticated -> route target
- unauthenticated -> `/login?returnUrl=<target>`

## UX Notes

- `LIVE` badge supports pulse class (`live-pulse`) for visual emphasis
- graceful error state: `overviewError` message shown in card
- on component destroy, polling subscription is unsubscribed
