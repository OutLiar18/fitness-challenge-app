# Champions Legacy Challenge — Release Notes

## v0.11.0 — Community and Coaching Foundation

Date: 1 August 2026

### Teams

- Added persistent one-team-per-player membership.
- Added local emblems, team identity, invitation joining and roster summaries.
- Added captain editing, atomic captain transfer and safe member leaving.
- Reused factual entries and the central Points Engine rather than creating team-only logging.

### Leagues

- Added Draft, Registration, Active, Completed and Archived seasonal stages.
- Added League Administrator scoped operations and audit history.
- Added frozen `consistency-v1` rules using `points-v2`.
- Added a 20-point daily activity cap and five-point participation bonus.
- Added atomic entry-linked contribution snapshots and player/team standings.

### Legacy Coach

- Added optional local guidance based on current and previous seven-day entry periods.
- Added player-controlled tone and focus.
- Added explicit recommendation reasons and evidence.
- Added private owner-scoped preferences without an external artificial-intelligence service.

### Security and testing

- Added team, league, membership, contribution and Coach preference rules.
- Added atomic captain transfer validation and forward-only audited league transitions.
- Expanded the domain target to 44 tests and Rules target to 12 tests.

### Release status

This release completes the requested community/coaching foundation before review. It remains pre-1.0.

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
