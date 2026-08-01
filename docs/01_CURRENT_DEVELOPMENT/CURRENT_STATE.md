# Champions Legacy Challenge — Current State

Version: 0.10.0  
Last updated: 1 August 2026  
Status: Pre-1.0 hardening complete; local release verification and user review required

## Product state

Champions Legacy Challenge has a complete single-player tracking, progression and administration foundation. v0.10.0 deliberately stops before v1.0 so the current product can be reviewed, tested and adjusted without implying final public-release approval.

## Implemented in v0.10.0

### Versioned shared libraries

- Approved Exercise, Cardio and Skill suggestions can be selected for a release.
- A Platform Administrator publishes no more than eight items per release.
- Every release has a semantic version and release notes.
- Published items appear in activity selectors in real time.
- Published definitions are copied into factual entries so historical scoring remains stable.
- Archiving removes an item from future selection without invalidating historical entries.
- Suggestions retain approval and publication history.
- Library releases, item publication and suggestion publication are audited.

### Administrative scalability

- User records load in pages of 25.
- Audit records load in pages of 30.
- Client error reports load in pages of 25.
- Announcement, moderation and small library-release datasets remain live subscriptions.
- Pagination prevents unlimited administrative reads as the platform grows.

### Production error monitoring

- Error reporting supports `off`, `console` and `firestore` modes.
- React error-boundary failures, global browser errors and unhandled promise rejections are captured.
- Reports are truncated, deduplicated per browser session and limited to authenticated players.
- Platform Administrators can review and resolve reports with an audit event.
- Error reporting never replaces browser testing or user feedback.

### Security Rules tests

- `@firebase/rules-unit-testing` and the Firestore Emulator are configured.
- Tests cover trusted roles, published-versus-archived library access, sanitised error reports, audited library publication and draft-announcement privacy.
- The emulator reads `firestore.rules` from `firebase.json`.
- `npm run test:rules` is required before rules deployment.

### Hosting and release preparation

- Firebase Hosting serves `dist` with a single-page-app rewrite.
- Static assets receive immutable caching.
- Security-oriented response headers are configured.
- Preview-channel and production deployment scripts are available.
- A release-readiness script verifies the version and required release files.
- A manual browser, responsive, security and administrative QA matrix is documented.

## Existing complete systems

- Firebase Authentication and protected routes.
- Ten factual activity categories and local-date-safe Journal.
- Explainable activity scoring and Running/Cardio eligibility rules.
- Daily and weekly goals with moderate bonuses.
- Streaks, shield, experience points, levels, achievements and personal records.
- Progress timeline and responsive application shell.
- Built-in Legacy Avatars and constrained profile editing.
- Live announcements, cross-device read status and audited administration.

## Verification status

- Domain test target: **37 tests**.
- Firestore Rules emulator target: **7 tests**.
- ESLint and production build must pass on the Windows development computer.
- `npm run check:release` must pass before a preview deployment is accepted.
- Updated Firestore Rules must be deployed only after emulator tests pass.

## Known limitations

- v0.10.0 has not been approved as v1.0.
- The first Platform Administrator must still be assigned through a trusted process.
- Published community library items are stored in Firestore while the original built-in library remains source-controlled.
- Error reporting is intentionally lightweight and does not provide source-map symbolication, session replay or external alerting.
- Historical player entries are still subscribed as a complete owner-scoped collection.
- Administrative text search searches loaded pages rather than the entire database.
- Teams, leagues, social competition and the Legacy Coach remain future modules.

## Immediate next step

Run `NEXT_SESSION.md` and `RELEASE_CANDIDATE_CHECKLIST.md`, deploy a Firebase Hosting preview channel, review the complete application and record all requested changes before considering v1.0.
