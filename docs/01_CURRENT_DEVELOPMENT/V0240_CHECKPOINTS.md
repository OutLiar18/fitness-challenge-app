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

Status: implemented for isolated verification in `0.24.0-dev.3`.

- allow only v3/v4 draft seasons to update `ruleset.powerPlayPolicy`;
- require the ruleset version to remain identical to the League's top-level `rulesVersion`;
- use full Power Play-policy validation on deliberate pool maintenance;
- add a legitimate v4 administrator pool-update positive path;
- runtime still defaults to v3;
- no lifecycle, movement persistence, history, override, composition or weekly-balance changes.

If the legitimate v4 pool update reaches the evaluator limit, stop here and redesign this Rules path.

## Checkpoint 2C — v4 draft to registration

Planned only after 2B passes. Test the audited League + invite transition separately with a complete Power Play policy.

## Checkpoint 2D — remaining existing v3 Power Play operations on v4

Planned after registration passes. Extend weekly Power Play selection/redraw/correction to v4 one path at a time before the application starts creating v4 seasons by default.

## Checkpoint 2E — runtime v4 default

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
