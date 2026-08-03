# Champions Legacy Challenge — Chat Briefing

Last updated: 3 August 2026  
Current production: v0.16.0  
Status: Verified and deployed; documentation sync and release commit pending; pre-v1.0

## Product

Champions Legacy Challenge is a gamified personal-development platform. It rewards factual effort, consistency and improvement without shaming players. Fitness is one part of a broader system that also includes reading, nutrition, movement and skill development.

## Stack

React + Vite, Firebase Authentication, Cloud Firestore and classic Firebase Hosting. Branded URL: `https://champions-legacy-challenge.web.app`.

## Latest release

v0.16.0 reduces visual crowding through one shared progressive-disclosure workspace:

- desktop tabs with icons, descriptions and optional count/status badges;
- a native section selector on small screens;
- Arrow-key, Home/End and visible-focus support;
- reduced-motion handling;
- safe pure helpers for active-section fallback and keyboard movement.

Applied to Progress, Activity Log, Analytics, Profile, Legacy Coach, Points Guide, Seasons, Houses, Pocket Week and Administration. Progress opens on Overview rather than exposing Achievements, Records, Timeline and Level Journey at once. Houses keeps C.H.A.O.S. discoverable through an overview setup callout while detailed setup lives in Management.

Dashboard remains direct. Inbox keeps its specialised communications tabs. Rulebook keeps native disclosure sections.

## Data and game boundaries

- No Firestore collection or Security Rule change in v0.16.0.
- No scoring, Experience Points or goal logic change.
- Store facts and derive scoring/progression/analytics.
- Preserve local calendar dates and historical House contribution snapshots.
- Pocket Week is one seven-day window immediately before a season.
- C.H.A.O.S. is Registration-only, balanced, one-time and requires at least two registered players per configured House.
- Do not invent Power Plays, Diamonds, full Transfer Market, Buddy Bonuses, Five Fires or late-season twists.

## Verification and deployment

- ESLint passed.
- 68 domain tests passed.
- Vite production build passed.
- 25 Firestore Rules tests passed.
- Release-readiness confirmed v0.16.0 on Hosting target `app`.
- Firebase Hosting deployed 60 frontend files successfully.
- Firestore Rules were unchanged.
- `npm audit` still reports two React Router React Server Components advisories; do not run `npm audit fix --force`.

The full manual functional, responsive, visual, dark-mode and accessibility review remains deferred until the final pre-v1.0 stage.

## Immediate action

Apply the v0.16.0 deployment documentation sync and commit with a clean working tree. Do not tag or declare v1.0 without explicit approval.

## First files to read

1. `RECENT_SESSION_SUMMARY.md`
2. `../01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
3. `../01_CURRENT_DEVELOPMENT/ACTIVE_MIGRATIONS.md`
4. `../01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`
5. ADR-021, ADR-022 and ADR-023.
