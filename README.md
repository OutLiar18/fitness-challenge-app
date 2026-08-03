# Champions Legacy Challenge

Version: **0.16.0**  
Production: **v0.16.0**  
Status: **Verified, deployed and committed-ready; pre-v1.0**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase Authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with one central, explainable Points Engine.
- Daily and weekly goals, streaks, Experience Points, achievements, records and timeline.
- Calm adaptive navigation organised around Journey, Competition and Inbox.
- Progressive-disclosure workspaces that keep one clear section visible at a time on dense pages.
- One Inbox for public announcements and private season notifications while preserving separate data and security boundaries.
- Personal Analytics derived from factual entries and the existing Points Engine.
- Searchable Rulebook and a Points Guide generated from live scoring constants.
- Trusted administration, immutable audit history, moderation and versioned shared libraries.
- Season-scoped Houses with C.H.A.O.S., weekly leadership, balanced roster movement and historical contribution integrity.
- One seven-day pre-season Pocket Week; reserves earn zero points until deliberately redeemed.
- Transparent local Legacy Coach guidance, first-party error reporting and Firestore Emulator tests.

## v0.16.0 visual refinement

v0.16.0 introduces one reusable accessible workspace pattern across Progress, Activity Log, Analytics, Profile, Legacy Coach, Points Guide, Seasons, Houses, Pocket Week and Administration. Desktop uses labelled section tabs; small screens use a native section selector. Summary information and the page's primary purpose remain visible, while lower-frequency or dense content is revealed deliberately.

Progress opens on a focused overview. Achievements, records, timeline and level journey no longer compete for attention on first load. Houses keeps C.H.A.O.S. discoverable through a setup callout while moving setup forms and prerequisite detail into a dedicated management workspace.

No Firestore collection shape, Points rule or Security Rule changes were introduced.

## Production

v0.16.0 is deployed at:

`https://champions-legacy-challenge.web.app`

Automated Windows release verification passed clean ESLint, 68 domain tests, 25 Firestore Security Rules tests, the Vite production build and release-readiness for Hosting target `app`. Firebase Hosting released 60 frontend files successfully on 3 August 2026.

## Local setup and verification

```powershell
npm install
Copy-Item .env.example .env
npm run check
npm run test:rules
npm run check:release
npm audit
```

The Firestore Emulator requires Java 21. Do not run `npm audit fix --force` for the current React Router React Server Components advisory.

## Documentation

Start with:

- `docs/06_CHAT_HANDOVER/CHAT_BRIEFING.md`
- `docs/06_CHAT_HANDOVER/RECENT_SESSION_SUMMARY.md`
- `docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
- `docs/01_CURRENT_DEVELOPMENT/ACTIVE_MIGRATIONS.md`
- `docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`

## Release boundary

v0.16.0 is **not** v1.0. Full functional, responsive, visual, dark-mode and accessibility review remains deferred until the final pre-v1.0 stage. Power Plays, Diamonds, the full Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive until their rules are separately confirmed.
