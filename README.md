# Champions Legacy Challenge

Version: **0.11.0**  
Status: **Pre-1.0 community and coaching foundation**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase email-and-password authentication and protected routes.
- Ten factual activity categories with explainable scoring.
- Daily and weekly goals, streaks, experience points, achievements and records.
- Responsive Dashboard, Log & Journal, Progress, Announcements and Profile areas.
- Built-in Legacy Avatars and constrained profile editing.
- Trusted administration, audited announcements, moderation and shared libraries.
- Persistent teams with local emblems, invitation codes, rosters and weekly accountability.
- Seasonal leagues with immutable `consistency-v1` rules, player and team standings, and forward-only lifecycle stages.
- Transparent, optional Legacy Coach recommendations generated locally from the player’s own entries.
- First-party error reporting, Firestore Emulator tests and Firebase Hosting configuration.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npm run check
npm run dev
```

Add the real Firebase web configuration to `.env` before starting the app.

## Verification commands

```powershell
npm run check
npm run test:rules
npm run check:release
npm audit
```

Expected v0.11.0 verification:

- 44 domain tests.
- 12 Firestore Security Rules tests.
- ESLint and production build pass.
- Release-readiness structure passes.

Do not run `npm audit fix --force` without reviewing breaking dependency changes. The Firestore Emulator requires Java 21.

## Deployment

```powershell
npm run deploy:rules
npm run deploy:preview
```

Do not run `npm run deploy:production` until the user has reviewed the complete pre-1.0 product and explicitly approved a v1.0 release.

## Documentation

Start with:

- `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`
- `docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md`
- `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
- `docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`
- `docs/04_DEVELOPMENT/QA_MATRIX.md`

## Release boundary

v0.11.0 is **not** v1.0. Teams, leagues and Legacy Coach are implemented for integrated testing and later review, not declared final.
