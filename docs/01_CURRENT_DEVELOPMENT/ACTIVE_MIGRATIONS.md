# Champions Legacy — Active Migrations

Last updated: 31 July 2026

## Current status

There are no incomplete high-risk architecture migrations in v0.6.0.

## Completed migrations

- Selector consolidation.
- Exercise Library migration.
- Points Engine v2.
- Effective Repetitions and difficulty scoring.
- Statistics decomposition.
- Repository/orchestration separation.
- Validation standardisation.
- Local-date-safe journal.
- Authentication service/context cleanup.
- Daily/weekly goal centralisation.
- Progression service foundation.
- Obsolete service removal.

## Controlled follow-up

### Historical progression aggregation

Status: Planned before pagination

The current progression engine derives streaks, bonuses, XP and achievements from full factual entry history. Before historical entries are paginated, introduce trusted summary checkpoints or server-side aggregation while preserving factual entries as the audit source.

### Ruleset versioning

Status: Required before leagues

Goal and progression events now carry central ruleset identifiers. Competitive seasons still require immutable persisted scoring and goal snapshots tied to those identifiers.

## Migration closure rule

A migration is complete only when all callers use the replacement, obsolete code is removed, tests pass, documentation is updated and live behaviour is verified.
