# Champions Legacy Challenge — Chat Briefing

Last updated: 3 August 2026  
Current release: v0.15.0, deployed, pre-v1.0

## Product

Champions Legacy Challenge is a gamified personal-development platform. It rewards factual effort, consistency and improvement without shaming players. Fitness is one part of a broader system that also includes reading, nutrition, movement and skill development.

## Stack

React + Vite, Firebase Authentication, Cloud Firestore and classic Firebase Hosting. Branded URL: `https://champions-legacy-challenge.web.app`.

## Current implementation

v0.15.0 is deployed and adds:

- grouped, less crowded adaptive navigation;
- no duplicate desktop Profile destination;
- one Inbox for public announcements and private season notifications;
- derived Personal Analytics that reuses factual entries and the Points Engine;
- visible C.H.A.O.S. prerequisites during Draft and Registration;
- current semantic route/page names with safe redirects from old URLs;
- removal of stale Netlify routing residue.

Season Houses remain season-scoped. C.H.A.O.S. performs the opening assignment and requires all configured Houses plus at least two registered players per House. Pocket Week is one seven-day window immediately before a season.

## Verification and deployment

- 66 domain tests passed.
- 25 Firestore Rules tests passed.
- ESLint and Vite production build passed.
- Release-readiness confirmed Hosting target `app`.
- Production Hosting deployed successfully with 58 files.
- v0.15.0 did not change Firestore Rules or collection shapes.
- Full manual visual/mobile/accessibility review was deferred by product-owner decision.

## Engineering rules

- Documentation is part of the software.
- Store facts and derive scoring/progression/analytics.
- Never duplicate the Points Engine in UI code.
- Preserve local calendar dates.
- Preserve historical House contribution snapshots after roster moves.
- Keep public announcements and private notifications separate below the Inbox presentation layer.
- Do not run `npm audit fix --force` for the current React Router RSC advisory.
- Do not invent Power Plays, Diamonds, full Transfer Market, Buddy Bonuses, Five Fires or late-season twists.
- Do not tag or declare v1.0 without explicit approval.

## Recommended next scope

Commit v0.15.0, then prioritise first-use onboarding, privacy/support, personal-data export/account deletion, history pagination and measured performance work. Trusted server-side scoring is required before prize-bearing competition and may require a separate infrastructure decision.

## First files to read

1. `RECENT_SESSION_SUMMARY.md`
2. `../01_CURRENT_DEVELOPMENT/CURRENT_STATE.md`
3. `../01_CURRENT_DEVELOPMENT/ACTIVE_MIGRATIONS.md`
4. `../01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`
5. ADR-021 and ADR-022 for competition and navigation/analytics changes.
