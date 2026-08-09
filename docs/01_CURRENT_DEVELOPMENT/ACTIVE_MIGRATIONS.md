# Champions Legacy Challenge — Active Migrations

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 9 August 2026

## Current status

There is no incomplete v0.24 migration.

The House Movement and weekly-balance rebuild is complete and deployed:

- `season-houses-v4` is the current new-season contract;
- one-week post-move rest state is persisted and enforced;
- C.H.A.O.S. remains exempt from the move-rest rule;
- immutable assignment history is active;
- Platform Administrator rest correction is audited;
- optional private season-composition profiles are active;
- `house-balance-v1` public/private weekly snapshots are active and non-scoring;
- themed no-repeat Power Plays remain integrated with the v4 season contract;
- evaluator-aware Firestore Rules routing is the frozen production boundary.

## Historical compatibility

Existing older season rulesets retain their documented historical behaviour. Do not rewrite an active historical season into v4 merely to make it current.

## Next migration boundary

No v0.25 migration exists yet. Five Fires and any remaining competition mechanics must be designed first. Add a migration plan only if the approved design introduces a real stored-data or rules-contract transition.
