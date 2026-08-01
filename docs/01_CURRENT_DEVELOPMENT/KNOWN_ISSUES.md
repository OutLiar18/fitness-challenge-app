# Champions Legacy Challenge — Known Issues

Last updated: 1 August 2026

## Community and league limitations

### Friendly team summaries

Team roster progress is derived from factual entries but written by each member’s authenticated client. It is suitable for accountability and encouragement, not prize-bearing competition.

### League score authority

Firestore Rules bind a contribution to an active membership, active league, matching entry identity and frozen rules version. Rules cannot independently recalculate every category’s point formula. Use friendly competition only until a trusted backend recalculates competitive score.

### Team lifecycle

A captain must transfer captaincy before leaving. Team deletion, disbanding and historical team archives are not yet available.

### League access codes

League invitation codes control registration flow but are not designed as confidential secrets. Do not use them as proof of identity or authorization.

### League archives and awards

Completed standings remain readable, but privacy controls, seasonal awards and trophy-cabinet integration are deferred.

### Large league lifecycle transitions

League status changes currently update all registered membership documents in one Firestore batch. This is suitable for the pre-1.0 friendly league size, but a trusted backend with paginated processing is required before supporting very large seasons.

## Existing scale limitations

- PlayerDataProvider still subscribes to the player’s complete activity history.
- Administrative search covers loaded pages rather than the full database.
- First-party error reporting does not include source-map symbolication, session replay or external alert routing.
- The first Platform Administrator still requires trusted bootstrap.
- Built-in and Firestore-published library definitions remain split.

## Dependency advisory

A React Router advisory may remain in `npm audit`. The application is a client-only Vite app and does not use React Server Components actions, but the advisory must still be reviewed before production. Do not run `npm audit fix --force`.

## Defect handling

Record verified defects here, add regression coverage where practical, and remove them only after tests, build and the relevant manual workflow pass.
