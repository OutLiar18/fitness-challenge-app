# Champions Legacy Challenge — Active Migrations

Last updated: 4 August 2026

## v0.17.0 player-readiness foundation

Status: Implementation, automated verification and production deployment complete; documentation sync and Git commit pending

- Adds onboarding fields to new user profiles.
- Adds the `accountDeletionRequests` collection on first player request.
- Extends Security Rules for onboarding updates, request ownership and audited administrator acknowledgement.
- Allows players to read/list their own sanitised export records where previously only administrators could list them.

## Compatibility

No bulk migration is required.

- Legacy profiles without `onboardingVersion` are treated as already onboarded.
- Replaying the guide adds the fields through an allowed profile update.
- Existing entries, memberships, contributions, Pocket balances and notifications remain unchanged.
- `accountDeletionRequests` does not appear until the first request is created.

## Release completion

- Windows release gates passed: clean lint, 71 domain tests, Vite production build, 30 Rules tests and release-readiness.
- Firestore Rules compiled and deployed successfully.
- Firebase Hosting released 62 frontend files to the branded `app` target.
- Remaining release administration: apply this documentation sync and commit v0.17.0.

## Deferred controlled migrations

- Trusted server-side account deletion and anonymisation.
- Paginated personal history with appropriate aggregates.
- Server-authoritative contribution scoring before prize-bearing competition.
- Full Transfer Market and late-season data models after product confirmation.
