# Champions Legacy Challenge — v0.24.0 Checkpoint Plan

Date: 7 August 2026  
Baseline: verified and deployed v0.23.5

## Development rule

v0.24.0 is rebuilt from v0.23.5. Every Firestore Rules change is isolated behind a positive-path checkpoint. A green rejection test is not enough: legitimate maximum-shape writes must succeed.

## Checkpoint 1 — pure House-movement domain foundation

Status: **passed and committed** as `0.24.0-dev.1`.

- one-week post-move rest calculation;
- eligibility explanations;
- leadership, same-week and House-lock checks;
- C.H.A.O.S. remains exempt;
- deterministic future assignment-history identifiers;
- no Firestore Rules changes.

## Checkpoint 2A — lean v4 draft contract

Status: **passed** as `0.24.0-dev.2`.

The first attempt stored a redundant nested House-movement policy map and immediately caused a legitimate v4 draft create to exceed Firestore's 1,000-expression limit. That design was rejected.

The replacement uses `season-houses-v4` itself as the immutable House Movement v1 contract. The legitimate three-write administrator draft batch with `houseCount: 8` passes. The runtime still defaults to v3.

## Checkpoint 2B — v4 draft Power Play maintenance

Status: **passed** as `0.24.0-dev.3`.

The legitimate v4 administrator Power Play-pool update passed with full Power Play validation. The application still defaults to v3.

## Checkpoint 2C — v4 draft to registration

Status: **passed** as `0.24.0-dev.4`.

- extend the existing registration-readiness check from v3 to v3/v4;
- use the shared full v3/v4 ruleset validator before registration opens;
- keep the existing initial Power Play-state requirement;
- add a positive v3 regression path;
- add a legitimate v4 `houseCount: 8` positive transition;
- verify an invalid v4 Power Play policy cannot enter registration;
- runtime still defaults to v3;
- no C.H.A.O.S., Power Play assignment, movement persistence, history, override, composition or weekly-balance expansion.

If the legitimate v4 draft-to-registration transition reaches the evaluator limit, stop here and redesign the lifecycle validator.

## Checkpoint 2D — first weekly Power Play selection on v4

Status: implemented for isolated verification in `0.24.0-dev.5`.

- extend only the League Power Play-state advance and first assignment-create validators from v3 to v3/v4;
- keep the existing v3 weekly-selection positive/regression path;
- add a legitimate v4 audit + assignment + League-state batch;
- do not enable redraw or locked correction on v4 yet;
- runtime still defaults to v3.

If the legitimate first v4 weekly selection reaches the evaluator limit, stop here and redesign this assignment path before adding anything else.

## Checkpoint 2E — pre-week redraw on v4

Planned only after first selection passes. Extend the existing administrator redraw path to v4 with its own positive evaluator test.

## Checkpoint 2F — locked assignment correction on v4

Planned only after redraw passes. Extend the Platform Administrator correction path to v4 with its own positive evaluator test.

## Checkpoint 2G — runtime v4 default

Only after all existing v3 season operations required by a normal season have positive v4 Rules coverage should new application-created seasons switch from v3 to v4.

## Checkpoint 3 — membership rest-lock persistence

Planned after the complete v4 compatibility bridge passes. Add only membership fields needed for the one-week rest and update the existing balanced swap transaction.

## Checkpoint 4 — immutable assignment history

Add assignment-history writes separately and verify maximum C.H.A.O.S. and roster-swap batch behaviour.

## Checkpoint 5 — audited Platform Administrator correction

Add the narrowly scoped correction/override with immutable reason and audit trail. Current-week, House-lock and leadership protections remain non-bypassable.

## Checkpoint 6 — composition/privacy foundation

Composition data remains optional, season-scoped and private. No weekly balance snapshots yet.

## Checkpoint 7 — weekly House balance

Last security-sensitive feature. Informational only; cannot alter earned points. Public/private snapshot architecture must stay below evaluator limits at eight Houses.

## Visual work

The black + dark blood-red warrior/Spartan/knight/samurai redesign is deferred to the dedicated polish release. The Power Plays workspace has a known visual-quality issue and needs a focused CSS/layout pass; do not mix that work into Rules-sensitive checkpoints.
