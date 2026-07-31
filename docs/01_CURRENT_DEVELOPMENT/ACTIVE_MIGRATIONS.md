# Champions Legacy — Active Migrations

Last updated: 30 July 2026

## Current status

There are no incomplete high-risk architecture migrations in v0.5.

The following migrations were completed during Platform Stabilisation:

- Selector consolidation.
- Exercise Library migration.
- Points Engine v2 migration.
- Effective Repetitions and difficulty scoring.
- Statistics service decomposition.
- Entry repository/orchestration separation.
- Validation standardisation.
- Local-date-safe journal migration.
- Authentication service/context cleanup.
- Legacy service and component removal.

## Remaining controlled follow-up

### Automated testing adoption

Status: Planned

Introduce tests around domain services before starting XP and streak features. This is a development capability improvement, not a replacement of current runtime architecture.

### Paginated entry history

Status: Deferred until data volume requires it

Replace the all-user real-time subscription with a current-window subscription and paginated historical queries while preserving the repository interface.

## Migration closure rule

A future migration is complete only when:

- the replacement is used by all callers;
- the legacy implementation is removed;
- lint/tests pass;
- relevant documentation is updated;
- Firestore and statistics behaviour are verified.
