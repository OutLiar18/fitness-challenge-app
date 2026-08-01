# Champions Legacy Challenge — Release Notes

## v0.10.0 — Pre-1.0 Release Hardening

Date: 1 August 2026

### Shared global libraries

- Platform Administrators can publish approved suggestions in explicit library releases.
- Releases include semantic versions and release notes.
- Published Exercise, Cardio and Skill options appear live in player forms.
- Entries embed published definitions for historical scoring stability.
- Published items can be archived without changing historical entries.
- Semantic release versions are unique and immutable after publication.

### Operational scaling

- Player administration, audit history and client error reports use cursor pagination.
- Load-more controls append records without replacing previous pages.

### Error monitoring

- Added off, console and Firestore reporting modes.
- Added React, global browser and unhandled-promise capture.
- Added sanitization, truncation and session deduplication.
- Added administrator resolution and immutable audit history.
- Added safe handling for circular diagnostic context and retry after failed report delivery.

### Security and verification

- Added Firestore Emulator Security Rules tests.
- Expanded rules for published libraries, releases and error reports.
- Added release-candidate and deployment scripts.

### Hosting preparation

- Added Firebase Hosting single-page-app rewrites.
- Added immutable static-asset caching.
- Added security response headers.
- Added expiring preview-channel deployment.

### Release status

v0.10.0 is intentionally not v1.0. It is ready for local verification, preview deployment and user-requested changes.
