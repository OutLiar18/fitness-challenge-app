# Champions Legacy Challenge

Source version: **0.17.0**  
Production version: **0.17.0**  
Status: **v0.17.0 verified and deployed; release documentation sync and commit pending; pre-v1.0**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase Authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with one central explainable Points Engine.
- Daily and weekly goals, streaks, shields, Experience Points, achievements, records and timeline.
- Calm adaptive navigation and accessible progressive-disclosure workspaces.
- Unified Inbox presentation for public announcements and private season notifications while preserving separate permissions.
- Personal Analytics derived from factual entries and the existing Points Engine.
- Searchable Rulebook and a Points Guide generated from live scoring constants.
- Trusted administration, immutable audit history, moderation, shared libraries and first-party error reporting.
- Season-scoped Houses with C.H.A.O.S., weekly leadership, balanced roster movement and immutable historical contribution snapshots.
- One seven-day pre-season Pocket Week; reserves earn zero points until deliberately redeemed.
- Transparent local Legacy Coach guidance.

## v0.17.0

v0.17.0 adds a versioned new-player guide, a Help & Privacy route, on-demand personal JSON export and a trusted account-deletion request workflow. Players may submit, cancel or reopen their request. Platform Administrators may acknowledge it only with an immutable audit event.

Acknowledgement is not final deletion. Removing Firebase Authentication and eligible records while preserving legitimate shared season history remains a trusted server/Admin SDK operation before public launch.

No scoring, Experience Points, Pocket balance, roster or historical House-allocation logic changes in this release.

## Production

v0.17.0 is deployed at:

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

Automated Windows verification passed clean ESLint, 71 domain tests, 30 Firestore Security Rules tests, the Vite production build and release-readiness for Hosting target `app`. Firestore Rules compiled and deployed successfully, and Firebase Hosting released 62 frontend files on 4 August 2026. The Firestore Emulator requires Java 21. Do not run `npm audit fix --force` for the current React Router React Server Components advisory.

## Documentation

Start with:

- `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`
- `docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md`
- `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
- `docs/02_GAME_DESIGN/ACCOUNT_AND_PRIVACY.md`

## Release boundary

v0.17.0 is **not** v1.0. Full functional, responsive, visual, dark-mode and accessibility review remains deferred until the final pre-v1.0 stage. Power Plays, Diamonds, the full Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive until their rules are separately confirmed.
