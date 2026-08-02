# Champions Legacy Challenge

Version: **0.13.1**  
Status: **Pre-1.0 reference system complete; verification and user review pending**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with central, explainable scoring.
- Daily and weekly goals, streaks, experience points, achievements and records.
- Responsive Dashboard, Log & Journal, Progress, Announcements and Profile areas.
- Searchable in-app Challenge Rulebook with current rules, season options and inactive 2025 mechanics.
- Public Points Guide generated from the live scoring constants.
- Storage-free Legacy Avatars and constrained profile editing.
- Trusted administration, audited announcements, moderation and versioned shared libraries.
- Persistent Teams, seasonal consistency-weighted Leagues and transparent local Legacy Coach guidance.
- First-party error reporting, Firestore Emulator tests and deployment recovery.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npm run check
npm run dev
```

Add the Firebase web configuration to `.env` before starting the app.

## Verification

```powershell
npm run check
npm run test:rules
npm run check:release
npm audit
```

Expected v0.13.1 verification:

- 54 domain tests.
- 15 Firestore Security Rules tests.
- ESLint and the production build pass.
- Release-readiness and branded Hosting target checks pass.

Do not run `npm audit fix --force`. The Firestore Emulator requires Java 21.

## Deployment

```powershell
npm run deploy:rules
npm run deploy:preview
npm run deploy:hosting
```

The branded site is `https://champions-legacy-challenge.web.app`. Do not run the combined production script until the user approves it.

## Documentation

Start with:

- `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`
- `docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md`
- `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
- `docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`
- `docs/04_DEVELOPMENT/QA_MATRIX.md`

## Release boundary

v0.13.1 is **not** v1.0. It adds the official player-facing rules and scoring references before the full product review.
