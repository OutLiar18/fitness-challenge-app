# Champions Legacy Challenge — Active Migrations

Last updated: 1 August 2026

## Current status

There are no incomplete high-risk architecture migrations in v0.10.0.

## Completed in v0.10.0

- Approved-suggestion publication into versioned global libraries.
- Published-library consumption in Exercise, Cardio and Skill forms.
- Embedded published-definition snapshots for historical scoring stability.
- Administrative user, audit and error-report pagination.
- Environment-controlled client error reporting.
- Firestore Emulator Security Rules test adoption.
- Firebase Hosting preview and deployment configuration.

## Controlled follow-up

### Historical entry pagination

Status: Planned after release-candidate review

Replace the complete owner-entry subscription with a current-window subscription and paginated historical queries while preserving the repository interface.

### Server-side administrative search

Status: Deferred until data volume requires it

Add intentionally indexed server queries or a dedicated search service. Do not simulate full search by repeatedly downloading all user or audit documents.

### External observability

Status: Optional future enhancement

Consider an external monitoring provider only when first-party error reports prove insufficient. Any provider must be reviewed for privacy, cost, source-map handling and data retention.

## Migration closure rule

A future migration is complete only when:

- the replacement is used by all callers;
- the legacy implementation is removed;
- domain and Security Rules tests pass;
- the production build passes;
- relevant documentation is updated;
- live Firebase behavior is verified.
