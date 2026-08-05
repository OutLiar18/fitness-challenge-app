# Recent Session Summary — v0.21.0

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 5 August 2026

## Baseline

The work began from Kyle's clean committed and deployed v0.20.0 archive.

## Decision

Kyle requested the simplest free option. The release therefore uses a manual local Firebase Admin SDK tool instead of paid Cloud Functions or scheduled infrastructure.

## Implemented

- Added `trustedSeasonModel` with stable fingerprints, standings/honours recalculation, integrity checks and snapshot comparison.
- Added `trusted-season-reconcile.mjs` with interactive season selection, safe dry run, local report and guarded publication.
- Added idempotent trusted snapshot publication plus immutable run and audit records.
- Added trusted-run subscriptions and status to the Season Command Centre and its downloadable operations report.
- Added client Rules that allow Platform/season administrators to read trusted runs and deny all client writes.
- Added 8 domain tests and 2 Rules tests, bringing verified totals to 104 and 46.
- Added Firebase Admin SDK development dependency, package scripts, credential/report ignore rules, announcement, ADR-028 and operating documentation.
- Updated stale v0.20.0 release wording inside the current project documentation.

## Important invariants

- The trusted model reuses existing league scoring.
- Dry run does not change Firebase competition records.
- Blocking integrity issues prevent publication.
- Publication requires explicit intent and confirmation.
- Unchanged trusted fingerprints do not create duplicate snapshots.
- Service-account credentials remain outside the project.
- No automatic scheduler, account deletion execution, scoring change or undefined twist is included.

## Packaging verification

- 104/104 domain tests pass.
- JS/MJS syntax checks pass.
- Local imports and Rules delimiters pass static audit.
- Windows dependency install, ESLint, build and 46 Rules tests remain authoritative release gates.

Do not run `npm audit fix --force`, deploy, finalise, commit or create a v1.0 tag until those gates pass.
