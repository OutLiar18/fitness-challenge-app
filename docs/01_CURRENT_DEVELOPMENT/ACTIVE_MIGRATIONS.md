# Champions Legacy Challenge — Active Migrations

Last updated: 3 August 2026

## v0.16.0 route-workspace refinement

Status: Implementation, automated verification and production Hosting deployment complete; documentation sync and Git commit pending

- Introduced a shared progressive-disclosure component for dense route pages.
- Reorganised existing UI sections without changing stored data or business rules.
- Keeps frequent summaries visible and moves lower-frequency detail behind labelled selection.
- Preserves legacy URLs, current providers, scoring services and Firestore contracts.
- Keeps Inbox and Rulebook on their existing appropriate disclosure patterns.

## No data migration required

v0.16.0 is a presentation and component-architecture release. It does not alter Firestore collection shapes, deployed Security Rules, activity facts, point formulas, Experience Points, season contribution snapshots, Pocket balances or notification documents.

## Release completion

- Windows release gates passed: clean lint, 68 domain tests, Vite build, 25 Rules tests and release-readiness.
- Hosting-only deployment completed on the branded `app` target.
- Firestore Rules remained unchanged.
- Remaining release administration: apply this documentation sync and commit v0.16.0.

## Deferred controlled migrations

- Trusted server-authoritative contribution scoring before prize-bearing competition.
- Paginated personal history.
- Account deletion and personal-data export.
- Full Transfer Market and late-season data models after product confirmation.
