# Champions Legacy — Active Migrations

Last updated: 1 August 2026

## Current status

There are no incomplete high-risk architecture migrations in v0.7.0.

## Completed in v0.7.0

- Dashboard workspace split into Dashboard and Log & Journal routes.
- Repeated per-page Firebase subscriptions replaced by `PlayerDataProvider`.
- Protected routes moved under a shared `AppShell`.
- Route pages converted to lazy-loaded chunks.
- Progress timeline integrated with existing derived progression events.
- Static announcements placed behind a replaceable service boundary.
- Legacy unused utility, duration picker and empty easter-egg files removed.

## Controlled follow-up

### Persisted announcements

Status: Planned after secure administration

Replace the static announcement source with a repository only when admin claims, Firestore rules, publishing validation and audit history exist.

### Historical data windowing

Status: Deferred until data volume requires it

Replace the all-history live subscription with current-window subscriptions and paginated history while preserving page and repository interfaces.

### Competitive ruleset snapshots

Status: Required before leagues

Persist immutable season/ruleset snapshots before scores can be used for formal competition.
