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
