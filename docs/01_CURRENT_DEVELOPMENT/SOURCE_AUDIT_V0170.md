# Source Audit — v0.17.0

Date: 4 August 2026

## Scope

Reviewed the clean v0.16.0 source and its production documentation sync before adding v0.17.0 player-readiness and account-control work.

## Added source areas

- `src/components/onboarding`
- `src/services/account`
- `src/pages/Help.jsx` and `Help.css`
- account-request administration service and component
- `tests/account-foundations.test.mjs`
- five additional Firestore Rules tests
- ADR-024 and `ACCOUNT_AND_PRIVACY.md`

## Deliberate architecture

- Help & Privacy is placed in the More menu rather than primary navigation.
- Legacy profiles are not bulk-migrated or interrupted.
- Export is generated on demand and is not stored back into Firestore.
- Account deletion remains a request because a client-only erase would be unsafe and incomplete.
- Shared season history is not rewritten.

## Static source results

- 355 project files in the clean candidate.
- 241 files under `src`.
- 15 test files.
- 84 documentation files.
- 259 source/test/script modules and styles checked for reachability.
- Unresolved relative imports: 0.
- Unreferenced source/test/script modules or styles: 0.
- JS/JSX parser syntax errors: 0 across 217 JavaScript/JSX files.
- Non-JSX `node --check` failures: 0.
- Firestore Rules delimiter-balance failures: 0.
- Firestore Rules test declarations: 30.

Historical ADRs, changelog entries and previous source-audit records were retained intentionally. They are documentation history, not runtime duplication.

## Verification state

- 71 of 71 domain tests pass in the packaging environment.
- Static import/reference audit is complete.
- Windows ESLint, the Vite production build, all 30 Firestore Rules tests and release-readiness passed.
- Firestore Rules compiled and deployed successfully.
- Firebase Hosting released 62 frontend files to the branded production site.
- `npm audit` still reports the reviewed React Router React Server Components advisory; no forced breaking fix was applied.
