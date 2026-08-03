# Champions Legacy Challenge

Version: **0.15.0**  
Status: **Deployed pre-v1.0 release; final integrated review deferred**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase Authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with one central, explainable Points Engine.
- Daily and weekly goals, streaks, Experience Points, achievements, records and timeline.
- Calm adaptive navigation organised around Journey, Competition and Inbox.
- One Inbox for public announcements and private season notifications while preserving separate data and security boundaries.
- Personal Analytics derived from factual entries and the existing Points Engine.
- Searchable Rulebook and a Points Guide generated from live scoring constants.
- Trusted administration, immutable audit history, moderation and versioned shared libraries.
- Season-scoped Houses with visible C.H.A.O.S. prerequisites, weekly leadership and balanced roster movement.
- Individual and House standings whose historical House allocation is never rewritten.
- One seven-day pre-season Pocket Week; reserves earn zero points until deliberately redeemed.
- Transparent local Legacy Coach guidance, first-party error reporting and Firestore Emulator tests.

## Production

The v0.15.0 frontend is deployed at:

`https://champions-legacy-challenge.web.app`

The v0.15.0 release does not change Firestore collection shapes or Security Rules. The compatible season Rules deployed during v0.14.0 remain active.

## Local setup

```powershell
npm install
Copy-Item .env.example .env
npm run check
npm run dev
```

Add the Firebase web configuration to `.env` before starting the app.

## Verified release gates

```powershell
npm run check
npm run test:rules
npm run check:release
npm audit
```

Verified on Windows for v0.15.0:

- 66 domain tests passed.
- 25 Firestore Security Rules tests passed.
- ESLint passed without warnings.
- Production build passed.
- Release-readiness confirmed Firebase Hosting target `app`.
- `npm audit` reported two high-severity React Router RSC advisories. This Vite client does not use RSC mode; do not run `npm audit fix --force` because the proposed downgrade is breaking.

The Firestore Emulator requires Java 21.

## Documentation

Start with:

- `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`
- `docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md`
- `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
- `docs/01_CURRENT_DEVELOPMENT/ACTIVE_MIGRATIONS.md`
- `docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`

## Release boundary

v0.15.0 is **not** v1.0. Full functional, responsive, keyboard, visual, dark-mode and accessibility review remains intentionally deferred until the final pre-v1.0 stage. Power Plays, Diamonds, the full Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive until their rules are separately confirmed.
