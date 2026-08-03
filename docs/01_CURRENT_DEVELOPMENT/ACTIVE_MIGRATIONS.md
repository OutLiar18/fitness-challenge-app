# Champions Legacy Challenge — Active Migrations

Last updated: 3 August 2026

## Current migration status

There is no active v0.15.0 data migration.

## Completed — v0.15.0 information-architecture cleanup

Status: Complete and deployed

- Renamed route-level Teams/Leagues concepts to Houses/Seasons while retaining safe legacy redirects.
- Consolidated Announcements and Notifications into one Inbox surface without merging their security models.
- Removed the duplicate desktop Profile destination.
- Moved secondary tools into one structured More menu.
- Added derived personal analytics without new Firestore documents or duplicated scoring.
- Made C.H.A.O.S. prerequisites visible before activation.
- Removed stale Firebase-irrelevant hosting residue.
- Passed 66 domain tests, 25 Rules tests, lint, build and release-readiness.
- Deployed the v0.15.0 frontend to the branded Firebase Hosting site.

## No data migration required

v0.15.0 changes navigation, presentation and pure derived analytics. It does not alter Firestore collection shapes or deployed Rules. Existing announcement read state, private notifications, season data, Houses, contributions and Pocket records remain compatible.

Legacy routes continue to resolve safely to current destinations, including Houses, Seasons and the correct Inbox tab.

## Deferred controlled migrations

- Trusted server-authoritative contribution scoring before prize-bearing competition.
- Paginated personal history.
- Account deletion and data export.
- Full Transfer Market and late-season data models after product confirmation.
