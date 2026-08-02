# Champions Legacy Challenge — Active Migrations

Last updated: 1 August 2026

## Required v0.12.0 league-capacity check

v0.12.0 adds transactionally enforced league capacity fields.

Before deploying the new Rules, inspect every existing `leagues/{leagueId}` document:

- Add or confirm `participantLimit: 200`.
- Set `participantCount` to the actual number of `leagueMemberships` documents for that league.

New leagues receive these fields automatically. If no league documents exist, no migration is required.

Do not guess a populated league’s participant count. Count its membership documents first.

## Completed in v0.12.0

- Team summaries moved to current-week-aware normalization.
- League joins and withdrawals moved to transactions with paired participant counts.
- Entry deletion now preserves completed/archived league history while removing active contributions.
- Invite access changed from listable reads to known-code document reads only.
- Provider state moved to user/scope-keyed subscriptions.
- Production deployment targeting moved fully to branded Hosting target `app`.

## Deferred controlled migrations

### Server-authoritative league scoring

Required before money, prizes or high-stakes public ranking. Use trusted backend recalculation and signed contribution results.

### Historical entry pagination

Replace the complete owner-entry subscription with current-window subscriptions and paginated history while preserving service interfaces.

### Team lifecycle history

Design disbanding and archiving without losing roster history or orphaning league snapshots.

## Closure rule

A migration is complete only when all callers use it, obsolete code is removed, domain and Rules tests pass, the production build passes and documentation matches live behaviour.
