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

Status: **passed** as `0.24.0-dev.5`.

- extend only the League Power Play-state advance and first assignment-create validators from v3 to v3/v4;
- keep the existing v3 weekly-selection positive/regression path;
- add a legitimate v4 audit + assignment + League-state batch;
- do not enable redraw or locked correction on v4 yet;
- runtime still defaults to v3.

If the legitimate first v4 weekly selection reaches the evaluator limit, stop here and redesign this assignment path before adding anything else.

## Checkpoint 2E — pre-week redraw on v4

Status: **passed** as `0.24.0-dev.6`.

- extend only the existing administrator pre-week redraw validator from v3 to v3/v4;
- use the real audit + assignment update + League Power Play-state advance batch;
- keep the locked Platform Administrator correction validator v3-only;
- runtime still defaults to v3;
- no House-movement persistence, history, override, composition or weekly-balance Rules.

If the legitimate v4 pre-week redraw reaches the evaluator limit, stop here and redesign this update path before adding anything else.

## Checkpoint 2F — locked assignment correction on v4

Status: **passed** as `0.24.0-dev.7`.

- extend only the existing locked Platform Administrator correction validator from v3 to v3/v4;
- keep the existing v3 correction test as a regression path;
- add a legitimate v4 audit + assignment update + League Power Play-state update positive path;
- runtime still defaults to v3;
- no House-movement persistence, history, movement override, composition or weekly-balance Rules.

If the legitimate v4 locked correction reaches the evaluator limit, stop here and redesign this correction path before switching runtime to v4.

## Checkpoint 2G — v4 C.H.A.O.S. assignment compatibility

Status: **passed** as a zero-Rules-change scale probe in `0.24.0-dev.8`.

- keep `firestore.rules` byte-for-byte equivalent to the passed Checkpoint 2F Rules;
- keep runtime creation on v3;
- exercise the existing audited C.H.A.O.S. transaction on a v4 season;
- use the maximum supported eight-House configuration with the minimum viable sixteen registered players;
- write the real audit + League activation + 16 membership assignments + 16 private notifications in one batch;
- add no House-movement rest fields, assignment-history documents, movement overrides, composition data or weekly-balance data.

This probe is intentionally designed to reveal Firestore batched-write document-access or evaluation limits in the existing C.H.A.O.S. architecture. If the legitimate eight-House v4 batch fails, stop here and redesign C.H.A.O.S. persistence before switching runtime creation to v4.

## Checkpoint 2H — runtime v4 default

Status: **passed** as a zero-Rules-change runtime switch in `0.24.0-dev.9`.

- change only `LEAGUE_RULESET_VERSION` from `season-houses-v3` to `season-houses-v4`;
- keep the v4 document shape identical to the proven lean v3-compatible shape;
- add a domain test proving normal validated new-season input emits v4;
- keep `firestore.rules` unchanged from Checkpoint 2F/2G;
- keep the full 59-test Firestore Rules suite unchanged from Checkpoint 2G;
- do not add rest-lock persistence, assignment-history documents, movement overrides, composition data or weekly-balance data;
- keep production deployment blocked.

If the unchanged Rules suite or runtime-creation domain test fails after this switch, stop before Checkpoint 3.

## Checkpoint 3A — membership rest-state schema

Status: implemented in `0.24.0-dev.10` as the first post-bridge Rules change.

- add only `rosterLockThroughWeekKey` and `rosterEligibleWeekKey` to the allowed membership schema;
- normal new registrations persist both fields as empty strings;
- Rules force both fields to remain empty at registration, while still accepting older membership-create payloads that omit them;
- add a legitimate v4 registration positive path with the empty fields;
- add a negative path proving a player cannot pre-seed a fake rest lock;
- do not change C.H.A.O.S. assignment, weekly roster-swap writes, assignment history, movement overrides, composition or weekly balance.

If the legitimate registration path fails or reaches the evaluator ceiling, stop before authorising any roster-swap rest-lock write.

## Checkpoint 3B — audited roster-swap rest-lock write

After 3A passes, update only the existing balanced weekly swap transaction so v4 moves write the calculated one-week rest window. Keep v3 behaviour compatible and test the legitimate swap positive path before adding assignment history.

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
