# Champions Legacy Challenge

<!-- RELEASE_STATUS: DEPLOYED -->
Source version: **0.22.0**  
Production version: **0.22.0**  
Status: **v0.22.0 verified and deployed; release commit pending; pre-v1.0**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase Authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with one central explainable Points Engine.
- Goals, streaks, shields, Experience Points, achievements, records, timeline and Personal Analytics.
- Trusted administration, immutable audit history, moderation, shared libraries and first-party error reporting.
- Season-scoped Houses with C.H.A.O.S., leadership, roster movement, Pocket Week and historical House allocation.
- External WhatsApp proof, immutable published standings, audited factual corrections and trusted season reconciliation.

## v0.22.0 — Trusted Account Deletion

v0.22.0 completes the account-closure workflow:

- acknowledgement starts a seven-day cancellation window;
- dry audit is the safe default;
- irreversible processing requires explicit confirmation and a final data refresh;
- Firebase Authentication and eligible private records are removed;
- shared season, House, standings and honours history is preserved under a deterministic Former Player identity;
- the final Platform Administrator cannot be deleted;
- failed processing can be resumed safely;
- completion creates administrator-only execution, receipt and audit records;
- a deleted person may register again as a new account, with no restored or automatically reconnected history.

No Cloud Functions, paid plan or automatic schedule is introduced. The private service-account file and local reports must remain outside the repository.

## Production

v0.22.0 is deployed at:

`https://champions-legacy-challenge.web.app`

## Release gates

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

Expected v0.22.0 targets are **108 domain tests**, **47 Firestore Security Rules tests**, clean ESLint, a successful Vite build and release-readiness for Hosting target `app`. Do not run `npm audit fix` or `npm audit fix --force`.

## Trusted deletion documentation

- `docs/02_GAME_DESIGN/TRUSTED_ACCOUNT_DELETION.md`
- `docs/04_DEVELOPMENT/TRUSTED_ACCOUNT_DELETION_OPERATIONS.md`
- `docs/03_ARCHITECTURE/decisions/ADR-029-trusted-account-deletion-and-anonymised-history.md`

## Release boundary

v0.22.0 is not v1.0. Power Plays, weekly roster-stability rules, weekly gender-composition balancing, Five Fires, remaining twists and the final whole-product review still remain ahead.
