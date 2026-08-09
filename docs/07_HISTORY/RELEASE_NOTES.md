# v0.24.0 — House Movement and Weekly Balance

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 9 August 2026
Status: Verified production deployment and smoke validation complete

## Summary

v0.24.0 completes the safer rebuild of House Movement that was deliberately deferred from v0.23.5. The release adds weekly roster stability, immutable movement history and privacy-safe composition balancing while preserving themed Power Plays and existing competition integrity.

## New competition behaviour

- Players moved during a weekly roster period receive a one-week post-move rest before they may be moved again.
- Opening C.H.A.O.S. assignment does not count as a move.
- C.H.A.O.S. and weekly moves create immutable House-assignment history.
- Platform Administrators may override only an active rest restriction and must record a factual reason.
- Same-week repeat movement, House weekly locks and captain/vice-captain protection cannot be overridden.

## Composition privacy and weekly balance

- Season members may optionally provide one private season-scoped composition response.
- Individual responses remain visible only to the owner and authorised administrators.
- Weekly House-balance snapshots suppress small disclosed groups and keep exact counts administrator-only.
- Balance classifications are informational; they do not alter points, standings or Power Plays.

## Security hardening

The final Rules hardening sequence reduced evaluator pressure while preserving authority boundaries. Evidence decisions remain Platform Administrator-only. Trusted write paths were simplified and routed to relevant validators before the production Rules freeze.

## Verification

- 131 domain tests passed.
- 79 Firestore Security Rules tests passed.
- Complete final Rules suite contained zero 1,000-expression evaluator-limit messages.
- Active production Rules source exactly matches SHA-256 `2ab1e569f4699e0018f3c5b7e5225a9fb42d65b835215fc9b8917ab21c701573`.
- Hosting live index and all referenced build assets matched the verified local build byte-for-byte.
- Production read-only navigation and reversible profile-write smoke tests passed.

This remains pre-v1.0.

---

# v0.23.5 — Stability Checkpoint

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 7 August 2026
Status: Verified production deployment complete

## Purpose

v0.23.5 restores one dependable source and security baseline after the unfinished v0.24 House Movement Rules expansion proved too complex for safe production use. It is intentionally conservative.

## Preserved

- The complete verified v0.23.0 application behaviour.
- `season-houses-v3`.
- Themed no-repeat Power Plays.
- Existing weekly House roster swaps from v0.23.
- Evidence, corrections, trusted reconciliation and trusted account deletion.
- The verified v0.23 Firestore Rules and 51-test Rules suite.

## Deferred

- `season-houses-v4`.
- One-week post-move rest/eligibility locks.
- Composition-profile collection and privacy workflow.
- Weekly public/private House-balance snapshots.
- The v0.24 Rules expansion supporting those features.

## Safer deployment

`npm run deploy:production` now verifies the candidate, deploys Firestore Rules first, and deploys Hosting only after Rules succeed.

## Verification target

120 domain tests, 51 Firestore Rules tests, clean ESLint/build and v0.23.5 release-readiness on Hosting target `app`.

This remains pre-v1.0.

---

## Previous release notes — v0.23.0

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 5 August 2026
Status: Verified production deployment

## What is new

Every new v3 season now has a theme-specific Power Play system. Administrators rename ten base category plays to fit the season theme, may add controlled custom 2×/3× plays, and must provide enough unique confirmed definitions for every official week.

A week selects randomly from the unused pool. Selection is permanent for no-repeat purposes: a play cannot return later even when it is redrawn or replaced through an audited correction.

## Scoring

Power Plays multiply competitive activity points according to the activity date and before the ordinary daily league activity cap. The same adjusted contribution drives individual and House standings and season honours. Running or Steps proof accepted later retains the original activity week's multiplier.

Evidence bonuses, goals, missions, streaks, Experience Points, active-day values and administrator adjustments remain unchanged.

## Operations and integrity

- Draft readiness and registration freeze.
- Future-week administrator preparation with player reveal only after start.
- Reasoned pre-week redraw.
- Platform Administrator-only locked correction.
- Frozen canonical definitions.
- Firestore Rules and trusted reconciliation block repeats and mismatches.

## Compatibility

Existing v1/v2 seasons remain unchanged and Power Play-disabled. No migration, background scheduler, Cloud Functions or paid plan is required.

## Verification target

120 domain tests, 51 Firestore Rules tests, clean ESLint/build and v0.23.0 release-readiness on Hosting target `app`.

This remains pre-v1.0.
