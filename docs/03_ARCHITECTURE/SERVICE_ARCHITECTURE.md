# Champions Legacy Challenge — Service Architecture

Last updated: 1 August 2026

## Layers

```text
Configuration and source-controlled libraries
                    ↓
Pure domain models and validators
                    ↓
Firestore repositories and audited operations
                    ↓
Providers and hooks
                    ↓
Reusable components and route pages
```

## New v0.10.0 services

### Global library

- `globalLibraryModel.js` — pure normalization, lookup, grouping and merging.
- `globalLibraryService.js` — published Firestore subscription.
- `GlobalLibraryProvider.jsx` — shared protected-route data source.

### Library publishing

- `libraryPublishingModel.js` — semantic-version validation and published-definition construction.
- `libraryPublishingService.js` — audited release, item publication and archive batches.

### Error monitoring

- `errorReportModel.js` — pure sanitization and fingerprinting.
- `errorReporter.js` — environment-controlled console or Firestore reporting.
- `errorReportService.js` — paginated administration and audited resolution.

### Administrative pagination

- `getUserPage`
- `getAuditEventPage`
- `getErrorReportPage`

`useAdminData` combines bounded pages with small real-time subscriptions.

## Guardrails

- Pure models must not import Firebase configuration.
- Firestore services must not contain UI rendering.
- Components must not duplicate scoring or authorization rules.
- Published definition snapshots must be used for historical scoring.
- Privileged operations must commit audit events atomically.
