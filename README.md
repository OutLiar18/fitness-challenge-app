# Champions Legacy Challenge

<!-- RELEASE_STATUS: DEPLOYED -->
Source version: **0.18.0**  
Production version: **0.18.0**  
Status: **v0.18.0 verified, deployed and ready to commit; pre-v1.0**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase Authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with one central explainable Points Engine.
- Daily and weekly goals, streaks, shields, Experience Points, achievements, records and timeline.
- Personal Analytics, accessible workspaces, a unified Inbox, Rulebook and generated Points Guide.
- Trusted administration, immutable audit history, moderation, shared libraries and first-party error reporting.
- Season-scoped Houses with C.H.A.O.S., weekly leadership, balanced roster movement and historical House snapshots.
- One seven-day pre-season Pocket Week with private zero-point reserves.
- Guided onboarding, Help & Privacy, personal JSON export and an audited account-deletion request workflow.

## v0.18.0 — External Evidence and Published Standings

v0.18.0 adds a no-media-cost evidence workflow for proof submitted through the season WhatsApp group:

- short verification IDs link WhatsApp proof to the correct in-app activity;
- qualifying Running points and Steps points remain pending until proof is accepted;
- Running Cardio points and statistics remain immediate;
- Water and Fruit may receive one audited three-point photo bonus per day after their season threshold is met;
- category reviewers see only assigned evidence queues, while Platform Administrators may review everything;
- late proof requires a Platform Administrator exception and reason;
- evidence decisions use immutable audit, reversal and replacement records;
- administrators see live standings while players see the latest published daily snapshot;
- manual, corrected and 10:00 Africa/Johannesburg administrator-session fallback publication are supported.

No media is stored by the app. Season evidence rules are configured and frozen when the season is created.

## Production

v0.18.0 is deployed at:

`https://champions-legacy-challenge.web.app`

## Local setup and verification

```powershell
npm install
Copy-Item .env.example .env
npm run check
npm run test:rules
npm run check:release
npm audit
```

Authoritative Windows verification passed clean ESLint, **80 domain tests**, **39 Firestore Security Rules tests**, the Vite production build and release-readiness for Hosting target `app`. Firestore Rules and branded Firebase Hosting deployed together successfully. The Firestore Emulator requires Java 21. Do not run `npm audit fix --force` for the current React Router React Server Components advisory.

## Included release finalisation

The main update package includes all documentation and a `FINALISE_RELEASE.ps1` script. After a successful production deployment, run that included script to convert candidate release records to deployed records before committing. No separate documentation package is required.

## Documentation

Start with:

- `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`
- `docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md`
- `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
- `docs/02_GAME_DESIGN/EVIDENCE_AND_PUBLISHED_STANDINGS.md`
- `docs/03_ARCHITECTURE/decisions/ADR-025-external-evidence-and-published-standings.md`

## Release boundary

v0.18.0 is **not** v1.0. Full functional, responsive, visual, dark-mode and accessibility review remains deferred until the final pre-v1.0 stage. Power Plays, Diamonds, the full Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive until their rules are separately confirmed.
