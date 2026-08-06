# Champions Legacy Challenge

<!-- RELEASE_STATUS: DEPLOYED -->
Source version: **0.23.0**  
Production version: **0.23.0**  
Status: **v0.23.0 verified and deployed; release commit pending; pre-v1.0**

Champions Legacy Challenge is a gamified personal-development platform that rewards consistent, factual progress across fitness, reading, nutrition, movement and skill development.

## Current capabilities

- Firebase Authentication, protected routes and branded Firebase Hosting.
- Ten factual activity categories with one central explainable Points Engine.
- Goals, streaks, shields, Experience Points, achievements, records, timeline and Personal Analytics.
- Trusted administration, immutable audit history, moderation, shared libraries and first-party error reporting.
- Season-scoped Houses with C.H.A.O.S., leadership, roster movement, Pocket Week and historical House allocation.
- External WhatsApp proof, immutable published standings, audited factual corrections, trusted season reconciliation and trusted account deletion.

## v0.23.0 — Themed Power Plays

New `season-houses-v3` seasons gain one theme-named Power Play per official season week:

- ten required base Power Plays, one for each activity category;
- unique season-themed names such as **Release the Kraken** for a mythological Water week;
- controlled custom Power Plays covering one or multiple categories at 2× or 3×;
- deterministic random selection from the unused enabled pool;
- no selected, redrawn or corrected Power Play can ever be used again in that season;
- activity-date scoring, including proof released later for Running or Steps;
- activity points are multiplied before the ordinary league activity cap;
- evidence bonuses, goals, missions, streaks, Experience Points and administrator adjustments are not multiplied;
- identical multiplied contributions drive individual standings, House standings and honours;
- immutable weekly assignment history, audit records and trusted-reconciliation checks.

Power Play names and definitions freeze when registration opens. Existing v1 and v2 seasons retain their historical behaviour.

## Production

v0.23.0 is deployed at:

`https://champions-legacy-challenge.web.app`

## Release gates

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

Expected v0.23.0 targets are **120 domain tests**, **51 Firestore Security Rules tests**, clean ESLint, a successful Vite build and release-readiness for Hosting target `app`. Do not run `npm audit fix` or `npm audit fix --force`.

## Power Play documentation

- `docs/02_GAME_DESIGN/POWER_PLAYS.md`
- `docs/04_DEVELOPMENT/POWER_PLAY_OPERATIONS.md`
- `docs/03_ARCHITECTURE/decisions/ADR-030-themed-no-repeat-power-plays.md`

## Release boundary

v0.23.0 is not v1.0. Weekly roster stability, weekly gender-composition balancing, Five Fires, the Buddy Bonus decision, late-season twists, hardening, full-product polish and the complete season rehearsal still remain ahead.
