# Champions Legacy Challenge

<!-- RELEASE_STATUS: DEPLOYED -->
Source version: **0.20.0**  
Production version: **0.20.0**  
Status: **v0.20.0 verified, deployed and ready to commit; pre-v1.0**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase Authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with one central explainable Points Engine.
- Daily and weekly goals, streaks, shields, Experience Points, achievements, records and timeline.
- Personal Analytics, accessible workspaces, a unified Inbox, Rulebook and generated Points Guide.
- Trusted administration, immutable audit history, moderation, shared libraries and first-party error reporting.
- Season-scoped Houses with C.H.A.O.S., weekly leadership, roster movement, Pocket Week and historical House allocation.
- External WhatsApp proof with verification IDs, scoped reviewers and immutable daily leaderboard snapshots.
- A Season Command Centre with ordered operational actions and role-scoped reports.
- Guided onboarding, Help & Privacy, personal JSON export and an audited account-deletion request workflow.

## v0.20.0 — Audited Factual Corrections and History Resilience

v0.20.0 adds a correction workflow that never silently rewrites activity history:

- Platform Administrators search by entry ID or WhatsApp verification ID;
- incorrect facts create a new immutable replacement entry;
- the original and every earlier replacement remain preserved in a correction chain;
- season activity points are reconciled through immutable reversal and replacement contributions;
- linked Running and Steps proof claims can be superseded without disappearing;
- House attribution and the original challenge date remain fixed;
- players' goals, records, analytics and progression use only the current factual entry;
- Journal history renders seven recorded days at a time while calculations retain the complete active history;
- targeted diagnostics and a portable integrity report surface missing or inconsistent derived records.

Pocket redemption records remain final activation records. They can be diagnosed in this release but are not replaced through the standard correction workflow.

## Production

v0.20.0 is deployed at:

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

Verified v0.20.0 results are clean ESLint, **96 domain tests**, **44 Firestore Security Rules tests**, a successful Vite production build and release-readiness for Hosting target `app`. The Firestore Emulator requires Java 21. Do not run `npm audit fix --force`.

v0.20.0 changed Firestore Security Rules, so Rules and branded Hosting were deployed together with `npm run deploy:production`.

## Included release finalisation

The main updater includes source, tests, documentation and `FINALISE_RELEASE.ps1`. After a successful production deployment, run the included finaliser before committing. No separate documentation package is required.

## Documentation

Start with:

- `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`
- `docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md`
- `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
- `docs/02_GAME_DESIGN/AUDITED_ENTRY_CORRECTIONS.md`
- `docs/03_ARCHITECTURE/decisions/ADR-027-audited-entry-corrections-and-active-history.md`

## Release boundary

v0.20.0 is **not** v1.0. Full functional, responsive, visual, dark-mode and accessibility review remains deferred until the final pre-v1.0 stage. Power Plays, Diamonds, the full Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive until their rules are separately confirmed.
