# Source Audit — v0.21.0

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 5 August 2026  
Status: Packaging audit complete; Windows release gates pending

## Baseline

The source was built from the clean committed and deployed v0.20.0 project archive supplied after release finalisation.

## Added source

- `src/services/seasons/trustedSeasonModel.js`
- `scripts/trusted-season-reconcile.mjs`
- `tests/trusted-season.test.mjs`
- `docs/02_GAME_DESIGN/TRUSTED_SEASON_RECONCILIATION.md`
- `docs/04_DEVELOPMENT/TRUSTED_SEASON_OPERATIONS.md`
- ADR-028

## Modified systems

- Season Command Centre trusted publication status and commands;
- season operations report export;
- trusted-run Firestore read boundary;
- Rules emulator coverage;
- package scripts and Firebase Admin SDK development dependency;
- announcement, release scripts and project documentation.

## Packaging checks

- 104 domain tests pass.
- All `.js` and `.mjs` files pass Node syntax checks.
- Local JavaScript/JSX imports resolve.
- Firestore Rules delimiter checks pass.
- No credential, report, dependency, build or Git folders are packaged.
- Updater and recovery source must contain byte-identical managed project files.

## Authoritative Windows checks still required

- `npm install` refreshes the lockfile with the new Admin SDK dependency.
- ESLint passes.
- The Vite production build passes.
- All 46 Firestore Rules tests pass using Java 21.
- Release-readiness confirms v0.21.0 and Hosting target `app`.
- npm audit is reviewed without a forced breaking fix.
