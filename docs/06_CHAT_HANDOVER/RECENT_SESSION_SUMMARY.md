# Recent Session Summary — v0.20.0

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 4 August 2026

## Baseline

The work began from Kyle's clean committed/deployed v0.19.0 archive.

## Implemented

- Added correction metadata defaults to ordinary and Pocket entry creation.
- Added `entryHistoryModel`, `entryCorrectionModel` and `entryCorrectionService`.
- Added Platform Administration `EntryIntegrityWorkspace` with blocking-error protection.
- Added owner subscriptions for correction heads/records.
- Resolved raw immutable entries into active personal history before progression and analytics.
- Added Journal date index and seven-recorded-day pagination.
- Added correction visibility to EntryCard.
- Added superseded proof status and evidence filter.
- Added correction records to personal export schema version 2.
- Added Firestore Rules for correction entries, heads, records, contributions and proof transitions.
- Added 11 domain tests and 5 Rules tests, bringing verified totals to 96 and 44.
- Added announcement, ADR-027, canonical game-design documentation and release records.

## Important invariants

- Only Platform Administrators correct entries.
- Player/category/challenge date remain fixed.
- House attribution remains the original snapshot.
- Earlier entries, contributions and proof decisions remain immutable.
- Point reconciliation is reversal plus replacement, never direct editing.
- A corrected non-qualifying run supersedes the old Running claim without creating a new one.
- Pocket redemptions are not replaceable in v0.20.0.

## Packaging verification

- 96/96 domain tests pass.
- JS/MJS syntax checks pass.
- 210 source modules have zero unresolved local imports and zero unreferenced modules.
- Full npm install/lint/build and Rules emulator execution could not run in Linux because the internal package registry lacked one transitive dependency and Firebase CLI was unavailable.

## Release verification

Authoritative Windows verification passed 96 domain tests, 44 Firestore Rules tests, ESLint, the Vite production build and release-readiness for v0.20.0 on Hosting target `app`. Firestore Rules and branded Hosting deployed successfully. Do not run `npm audit fix --force` and do not create a v1.0 tag.
