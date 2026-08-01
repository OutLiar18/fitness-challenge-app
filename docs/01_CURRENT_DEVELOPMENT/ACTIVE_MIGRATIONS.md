# Champions Legacy Challenge — Active Migrations

Last updated: 1 August 2026

## Current status

No incomplete destructive migration exists in v0.11.0. The new modules use additive collections and routes.

## Completed in v0.11.0

- Structured preview routes migrated to real `/teams`, `/leagues` and `/coach` systems.
- Entry persistence migrated to an atomic batch that may include league contribution snapshots.
- Entry deletion migrated to remove linked league contributions in the same batch.
- League Administrator changed from a reserved label to league-scoped operational authority.
- Protected application providers extended with Team, League and Coach state.

## Controlled follow-up

### Server-authoritative league scoring

Status: Deferred until competitive stakes justify server infrastructure

Recalculate and sign league contributions through a trusted backend before using leagues for prizes, money or high-stakes public competition.

### Historical entry pagination

Status: Planned after integrated review

Replace the complete owner-entry subscription with current-window subscriptions and paginated history while preserving service interfaces.

### Team lifecycle history

Status: Deferred

Design team archiving and disbanding without losing roster history or orphaning league snapshots.

## Closure rule

A migration is complete only when all callers use it, obsolete code is removed, domain and Rules tests pass, the production build passes and documentation matches live behavior.
