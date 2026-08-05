# Champions Legacy Challenge

<!-- RELEASE_STATUS: DEPLOYED -->
Source version: **0.21.0**  
Production version: **0.21.0**  
Status: **v0.21.0 verified and deployed; release commit pending; pre-v1.0**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase Authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with one central explainable Points Engine.
- Goals, streaks, shields, Experience Points, achievements, records, timeline and Personal Analytics.
- Trusted administration, immutable audit history, moderation, shared libraries and first-party error reporting.
- Season-scoped Houses with C.H.A.O.S., leadership, roster movement, Pocket Week and historical House allocation.
- External WhatsApp proof with verification IDs, scoped reviewers and immutable published standings.
- Audited factual entry corrections with active-history resolution.
- Season Command Centre with operational actions, reports and trusted publication status.

## v0.21.0 — Trusted Standings and Season Reconciliation

v0.21.0 adds a free-first local Firebase Admin SDK command for prize-bearing standings:

- `npm run season:reconcile` performs a safe dry run and writes only a local JSON report;
- standings and honours are rebuilt from frozen season rules, memberships and immutable contributions;
- evidence, correction and contribution relationships are checked before publication;
- the latest published snapshot is compared with the trusted result;
- blocking integrity findings prevent publication;
- `npm run season:reconcile:publish` requires explicit confirmation;
- successful publication creates an immutable snapshot, trusted-run record and audit event;
- a deterministic fingerprint prevents duplicate publication of unchanged trusted data;
- authorised operators see trusted publication status in the Season Command Centre.

No Cloud Functions, paid plan or automatic schedule is introduced. A private service-account file is required for actual trusted operation and must remain outside the repository.

## Production

v0.21.0 is deployed at:

`https://champions-legacy-challenge.web.app`

## Local setup and release gates

```powershell
npm install
Copy-Item .env.example .env
npm run check
npm run test:rules
npm run check:release
npm audit
```

Expected v0.21.0 targets are **104 domain tests**, **46 Firestore Security Rules tests**, clean ESLint, a successful Vite build and release-readiness for Hosting target `app`. The Firestore Emulator requires Java 21. Do not run `npm audit fix --force`.

## Trusted operations documentation

Read these before the first real reconciliation:

- `docs/02_GAME_DESIGN/TRUSTED_SEASON_RECONCILIATION.md`
- `docs/04_DEVELOPMENT/TRUSTED_SEASON_OPERATIONS.md`
- `docs/03_ARCHITECTURE/decisions/ADR-028-free-first-trusted-season-reconciliation.md`

## Release boundary

v0.21.0 is not v1.0. Account-deletion execution, automatic scheduled publication, undefined season twists and final whole-product review remain outside this release.
