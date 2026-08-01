# Champions Legacy Challenge — Known Issues

Last updated: 1 August 2026

## Open release-candidate limitations

### Historical entry subscription

The player-data provider still subscribes to the player’s complete activity history. This is acceptable for the current dataset but requires windowed queries and paginated history before large-scale use.

### Administrative search scope

Players, audit history and error reports are paginated. Search operates on records already loaded into the browser rather than performing a server-side full-database search.

### Lightweight error monitoring

The first-party Firestore reporter provides sanitised error collection and resolution tracking, but it does not provide source-map symbolication, release health, alert routing, session replay or performance traces.

### First administrator bootstrap

The first Platform Administrator must be assigned through a trusted Firebase Console or Admin SDK process. This is intentional and prevents self-promotion.

### Built-in and published library split

Built-in library items remain source-controlled while community-published items live in Firestore. A future maintenance tool may migrate built-in definitions into the same versioned data model, but this is not required for the current release candidate.

### Remaining dependency advisory

A React Router advisory may remain in `npm audit` because the affected React Server Components pathway is not used by this client-only Vite application. Do not use `npm audit fix --force` without reviewing the proposed downgrade and application impact.

## Defect handling rule

Record verified defects here, add regression coverage where practical, and remove the issue only after the fix, tests, build and relevant manual workflow have passed.
