# Recent Session Summary

Date: 3 August 2026  
Release: v0.14.0 Season Houses, C.H.A.O.S. and Pocket Week

## Implemented

- Retired permanent Teams and replaced them with season-scoped Houses.
- Added balanced deterministic C.H.A.O.S., private assignments and weekly House leadership.
- Added one balanced player swap per House/week while preserving historical contribution allocation.
- Added private zero-point Pocket reserves, canonical redemption and immutable receipts.
- Added individual/House standings, season honours and private competition notifications.
- Updated Rulebook, Points Guide, navigation, profiles, architecture, security and release documentation.

## Verification completed

- ESLint passed with no warnings.
- All 61 domain tests passed.
- All 25 Firestore Security Rules tests passed.
- The Vite production build passed.
- `npm run check:release` confirmed v0.14.0 and Hosting target `app`.
- `npm audit` still reports the known React Router advisory; do not use `npm audit fix --force`.

## Firestore and deployment

- Retired Team records and one dummy pre-v0.14 draft league were confirmed as disposable test data and removed.
- No pre-existing `leagueMemberships` or `leagueContributions` required conversion.
- Core `users`, `challengeEntries` and `auditEvents` data was preserved.
- Final Firestore Rules compiled without warnings and deployed successfully.
- A seven-day Hosting preview was deployed.
- v0.14.0 was deployed to the branded production URL.
- A production smoke test confirmed that season and House creation work for a Platform Administrator.

## Product decisions

- Pocket Week is one seven-day window immediately before the season.
- Pocket Week does not recur every challenge week.
- The full functional, responsive and accessibility review is deferred until the final pre-v1.0 stage.

## Next

Commit the deployed v0.14.0 state. Then improve C.H.A.O.S. prerequisite visibility: the console is currently hidden during Draft, although activation correctly requires Registration, all configured Houses and at least two registered players per House. Still not v1.0.
