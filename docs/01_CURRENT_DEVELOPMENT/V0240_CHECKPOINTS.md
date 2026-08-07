# Champions Legacy Challenge — v0.24.0 Checkpoint Plan

Date: 7 August 2026  
Baseline: verified and deployed v0.23.5

## Development rule

v0.24.0 is rebuilt from v0.23.5. The failed v0.24 source tree is reference material only and must not be copied wholesale.

Every Firestore Rules change is isolated behind a checkpoint. A checkpoint is accepted only when legitimate positive writes and intended negative writes both behave for the maximum supported season shape.

## Checkpoint 1 — pure House-movement domain foundation

Status: implemented in `0.24.0-dev.1`.

- one-week post-move rest calculation;
- eligibility explanations;
- leadership, same-week and House-lock checks;
- C.H.A.O.S. remains exempt from post-move rest;
- deterministic future assignment-history identifiers;
- no Firestore Rules changes;
- no Firestore writes;
- no new v4 season creation;
- no composition or weekly-balance code;
- production deployment blocked while this development checkpoint is active.

The checkpoint must preserve the exact v0.23.5 Rules and Rules-test hashes.

## Checkpoint 2 — minimal v4 Rules contract

Planned next.

Introduce only the minimum schema/ruleset change necessary to create and maintain a `season-houses-v4` season with the House-movement policy frozen into its ruleset. Do not add history collections, composition data or weekly balance yet.

Required tests include a legitimate v4 draft create/update positive path. If this checkpoint reaches the Firestore 1,000-expression ceiling, stop and redesign the League Rules dispatcher before adding any more functionality.

## Checkpoint 3 — membership rest-lock persistence

Planned after checkpoint 2 passes.

Add only the membership fields needed for the one-week player rest and update the existing balanced swap transaction. Add positive and negative Rules tests around a normal weekly swap.

## Checkpoint 4 — immutable assignment history

Planned after checkpoint 3 passes.

Add assignment-history writes separately and verify maximum C.H.A.O.S. and roster-swap batch behaviour.

## Checkpoint 5 — audited Platform Administrator correction

Planned after checkpoint 4 passes.

Add the narrowly scoped post-move-rest override with an immutable reason/audit trail. Current-week, House-lock and leadership protections remain non-bypassable.

## Checkpoint 6 — composition/privacy foundation

Planned only after House movement is stable.

Composition data must remain optional, season-scoped and private. This checkpoint must not add weekly balance snapshots yet.

## Checkpoint 7 — weekly House balance

Planned last because the prior implementation caused the maximum-scale positive write failure.

The calculation remains informational and cannot alter earned points. Public/private snapshot architecture must be redesigned to remain safely below Firestore evaluation limits at the maximum supported House count.

## Visual work

The broader black + dark blood-red warrior/Spartan/knight/samurai application redesign is deferred to the dedicated polish release. The Power Plays workspace has a known visual-quality issue and needs a focused CSS/layout pass; do not mix that work into security-sensitive House movement checkpoints.
