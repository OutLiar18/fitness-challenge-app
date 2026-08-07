# Champions Legacy Challenge — v0.24.0 Source Audit

Date: 7 August 2026  
Base: verified, deployed and committed v0.23.0  
Status: Candidate Hotfix 5 prepared after all local gates passed and production Rules publication exposed unused-symbol/Rules-release blockers

## Archive baseline

The v0.23.0 archive passed ZIP integrity inspection and contained the complete React/Vite/Firebase source, package lock, Firestore Rules, domain/Rules tests, release scripts and current documentation. Local secrets, `.git`, `node_modules` and `dist` were correctly excluded.

## Implemented source changes

- `season-houses-v4` and `house-movement-v1` ruleset.
- One-week post-move player rest fields and eligibility model.
- Platform Administrator-only factual correction override.
- Immutable C.H.A.O.S. and roster-swap assignment history.
- Optional season-scoped private composition profiles.
- Public privacy-suppressed and private exact weekly balance snapshots.
- Non-scoring `house-balance-v1` calculation.
- Houses workspace for eligibility, composition, balance and history.
- Trusted account deletion extensions for new sensitive/shared records.
- Rulebook and release announcement updates.
- Nine new domain tests and six new Firestore Rules tests.

## Initial packaging verification

- 129 of 129 domain tests passed.
- JavaScript/JSX syntax parsing passed across source, scripts and tests.
- Relative import audit found no missing local modules.
- Firestore Rules delimiter/static structure audit passed.

## First Windows verification findings

The first Windows run on 7 August 2026 found three actionable release-gate results:

1. ESLint: one missing Hook dependency in `src/pages/Houses.jsx` and one unused `rosterSnapshot` binding in `src/services/seasons/houseMovementModel.js`.
2. Firestore Rules: 55/56 tests passed; v4 season draft creation exceeded Firestore's 1,000-expression evaluation limit.
3. npm audit: eight advisories (six moderate, two high). Automatic fixes propose breaking dependency changes and remain prohibited for this candidate.

## Candidate Hotfix 1

- Reused the already-derived `movementV1` flag in the Houses subscription effect so Hook dependencies are explicit and stable.
- Removed the unused destructuring binding while preserving private balance output.
- Added a compact draft-time `house-movement-v1` structural guard for the atomic season + invite + audit transaction.
- Full v4 House-movement-policy validation remains mandatory when a draft transitions to registration.
- No gameplay rule, privacy rule, scoring rule or version number changed.

## Candidate Hotfix 2

The Hotfix 1 Windows rerun exposed two remaining candidate defects before deployment:

- `Houses.jsx` contained a duplicate `movementV1` declaration introduced while fixing the Hook dependency. Hotfix 2 keeps the single declaration before the subscription effect.
- The v4 draft-create path still exceeded Firestore's expression ceiling because draft creation continued to validate the full evidence/module policy stack. Hotfix 2 makes the private draft ruleset guard intentionally structural and defers complete v4 validation to the draft-to-registration transition.
- A Firestore Rules regression now proves that a valid v4 draft can open registration while a draft whose composition policy enables scoring cannot. This raises the Rules target from 56 to 57.
- No gameplay, scoring, privacy or release-version behaviour changed.

## Second Windows verification and Candidate Hotfix 3

The Hotfix 2 Windows verification passed every functional gate:

- ESLint passed cleanly.
- 129/129 domain tests passed.
- Vite production build passed with only the existing non-blocking Firebase vendor chunk-size warning.
- 57/57 Firestore Rules tests passed.
- `npm audit` remained eight advisories (six moderate, two high), with only breaking automatic fixes offered.

The final release-readiness step then failed for a tooling-only reason: `scripts/release-readiness.mjs` had accidentally added `node_modules` to `forbiddenRepositoryArtifacts`. That contradicted both `.gitignore` and the release workflow, because `npm install` creates `node_modules` locally while Git correctly ignores it. v0.23.0 did not contain this erroneous check.

Candidate Hotfix 3:

- removes `node_modules` from the existence-based forbidden-artifact list;
- retains `.gitignore` protection so dependencies remain outside version control and release archives;
- updates release-readiness from 56 to 57 expected Rules tests;
- updates `finalise-release.mjs` and the release-candidate checklist to record 57 Rules tests consistently;
- changes no gameplay, privacy, Firestore security policy, application UI or dependency.

## Candidate Hotfix 4, release gate and production publication findings

- Hotfix 3 passed `npm run check:release` on Windows: clean ESLint, 129/129 domain tests, successful Vite build, 57/57 Firestore Rules tests and successful release-readiness.
- Hotfix 4 corrected only the root README's stale 56-test reference to 57.
- `npm run deploy:production` reran every gate successfully, compiled the Firestore Rules and uploaded 66 Hosting files, but the Firebase Rules API returned HTTP 409 `Requested entity already exists` before the combined deployment completed.
- A Rules-only retry using `firebase-tools@15.26.0` returned the same 409.
- The Firebase Console then reported four unused-symbol warnings and refused to save the Rules.

## Candidate Hotfix 5

The Rules-only cleanup removes:

- the unused `entryId` parameter from `validCorrectionChallengeEntry`;
- the unreachable `validLeagueRulesetV2` function;
- the unreachable `validLeagueRulesetV3DraftCreate` function;
- the unused `historyId` parameter from `validHouseAssignmentHistoryBase`;
- `validLeagueModulesV2` and `validDraftPowerPlayPolicy`, which became unreachable once the two legacy validators above were removed.

Calls are updated only where the removed parameters were never read. Static call inspection finds no remaining unreferenced Rules helper functions. No reachable allow/deny condition, scoring rule, data shape, privacy boundary or version changes. The packaging-environment domain suite remains 129/129. Windows remains authoritative for Firestore compilation and the 57-test Rules suite.

## Packaging-environment limitation

A full dependency install still cannot complete in the packaging environment because its internal npm mirror does not contain `zod-validation-error@4.0.2`. Therefore ESLint, Vite build, Firebase Emulator Rules tests and release-readiness must be rerun on Kyle's Windows computer and remain authoritative.

## Required Windows gates

- `npm run check`
- `npm run test:rules` with Java 21
- `npm run check:release`
- `npm audit`

The functional targets have passed on Windows: 129 domain tests, 57 Rules tests, clean ESLint, successful Vite build and successful release-readiness. Candidate Hotfix 5 requires one clean Windows `npm run check:release` rerun before another Rules publication attempt. Do not run either audit-fix command. Do not create a v1.0 tag.
