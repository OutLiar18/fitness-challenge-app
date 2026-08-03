# Champions Legacy Challenge — Active Migrations

Last updated: 3 August 2026

## v0.14.0 verification and deployment migration

Status: Complete

Windows verification passed clean ESLint, all 61 domain tests, all 25 Firestore Rules tests, the production build and release-readiness for Hosting target `app`.

The required live-data inspection found only disposable test records in the retired Team collections and one dummy pre-v0.14 draft league. Those records were removed while `users`, `challengeEntries` and `auditEvents` were preserved. No production data conversion was required.

The final Firestore Rules compiled without warnings and deployed successfully. The Hosting preview and production frontend were deployed, and a production smoke test confirmed themed season and House creation.

## Competition-data migration outcome

- `teams`, `playerTeams` and `teamInvites`: retired test data removed.
- Legacy `leagues` and `leagueInvites`: dummy pre-v0.14 draft data removed.
- `leagueMemberships` and `leagueContributions`: no pre-existing documents.
- No active pre-v0.14 season was converted in place.
- New competition data uses season-scoped Houses and `season-houses-v1`.

## Completed in v0.14.0

- Permanent Team providers, services, constants and routes removed.
- Retired Team collections denied by Rules.
- House membership moved into `leagueMemberships`.
- Historical House identity copied into every contribution.
- C.H.A.O.S., elections, votes, swap locks, Pocket reserves, redemptions and private notifications added.
- Pocket Week confirmed as one pre-season seven-day window.

## Deferred controlled migrations

- Trusted server-authoritative league scoring before prize-bearing competition.
- Paginated personal history.
- Administrator-authored season rule packs.
- Full Transfer Market and late-season twist data model after product confirmation.

## Closure rule

A migration is complete only when obsolete callers are removed, domain and Rules tests pass, production build passes, live data is inspected, deployment succeeds and documentation matches behaviour.
