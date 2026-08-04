# Champions Legacy Challenge

<!-- RELEASE_STATUS: DEPLOYED -->
Source version: **0.19.0**  
Production version: **0.19.0**  
Status: **v0.19.0 verified, deployed and ready to commit; pre-v1.0**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase Authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with one central explainable Points Engine.
- Daily and weekly goals, streaks, shields, Experience Points, achievements, records and timeline.
- Personal Analytics, accessible workspaces, a unified Inbox, Rulebook and generated Points Guide.
- Trusted administration, immutable audit history, moderation, shared libraries and first-party error reporting.
- Season-scoped Houses with C.H.A.O.S., weekly leadership, roster movement, Pocket Week and historical House allocation.
- External WhatsApp proof with verification IDs, scoped reviewers and immutable daily leaderboard snapshots.
- Guided onboarding, Help & Privacy, personal JSON export and an audited account-deletion request workflow.

## v0.19.0 — Season Command Centre

v0.19.0 turns the existing season systems into one practical operations surface:

- a role-aware command centre inside each v2 season;
- clear next-action guidance for House readiness, C.H.A.O.S., leadership, proof and publication;
- evidence workload totals by category and assigned reviewer count;
- recent immutable evidence-decision history;
- leaderboard snapshot revision history;
- downloadable season operations reports with no WhatsApp media;
- scoped report contents for category reviewers and complete records for authorised administrators.

This release adds no Firestore collection and changes no scoring rule, evidence rule, House attribution rule or Security Rule. It reads existing season records through the permissions already introduced in v0.18.0.

## Production

v0.18.0 remains deployed at:

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

Expected v0.19.0 targets are clean ESLint, **85 domain tests**, the unchanged **39 Firestore Security Rules tests**, a successful Vite production build and release-readiness for Hosting target `app`. The Firestore Emulator requires Java 21. Do not run `npm audit fix --force`.

## Included release finalisation

The main updater includes source, tests, documentation and `FINALISE_RELEASE.ps1`. After a successful Hosting deployment, run the included finaliser before committing. No separate documentation package is required.

## Documentation

Start with:

- `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`
- `docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md`
- `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
- `docs/02_GAME_DESIGN/SEASON_COMMAND_CENTRE.md`
- `docs/03_ARCHITECTURE/decisions/ADR-026-season-command-centre-and-role-scoped-reports.md`

## Release boundary

v0.19.0 is **not** v1.0. Full functional, responsive, visual, dark-mode and accessibility review remains deferred until the final pre-v1.0 stage. Power Plays, Diamonds, the full Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive until their rules are separately confirmed.
