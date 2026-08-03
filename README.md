# Champions Legacy Challenge

Version: **0.14.0**  
Status: **Pre-1.0 season-system foundation; Windows verification and user review pending**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase Authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with central, explainable scoring.
- Daily and weekly goals, streaks, experience points, achievements and records.
- Responsive Dashboard, Log & Journal, Progress, Announcements, Profile and reference areas.
- Searchable Rulebook and a Points Guide generated from live scoring constants.
- Storage-free Legacy Avatars and constrained profile editing.
- Trusted administration, audited announcements, moderation and versioned shared libraries.
- Season-scoped Houses with C.H.A.O.S. assignment, weekly leadership voting and one balanced roster swap per House each week.
- Individual and House leaderboards whose historical House allocation is never rewritten.
- Seven-day Pocket Week reserves that earn zero points until deliberately activated.
- Private season notifications and transparent local Legacy Coach guidance.
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

Expected v0.14.0 verification:

- 61 domain tests.
- 25 Firestore Security Rules tests.
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
- `docs/01_CURRENT_DEVELOPMENT/ACTIVE_MIGRATIONS.md`
- `docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`

## Release boundary

v0.14.0 is **not** v1.0. Power Plays, Diamonds, the full Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive until their rules are separately confirmed.
