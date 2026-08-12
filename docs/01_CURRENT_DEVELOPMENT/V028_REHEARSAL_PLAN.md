# Champions Legacy Challenge — v0.28.0 Complete League-Season Rehearsal Plan

Checkpoint: 28A
Date: 12 August 2026
Status: Rehearsal contract and gap inventory established
Production baseline: v0.27.0

## Purpose

v0.28.0 is not a feature-expansion release. Its primary job is to prove that the
existing league/season systems can survive one complete representative season from
registration through final publication, honours and account-deletion edge cases.

The rehearsal must expose integration gaps without changing the accepted competition
design merely to make a test pass.

## Frozen production boundary

Production v0.27.0 remains immutable.

Exact deployed/tagged source:

`701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`

Canonical Firestore Rules SHA-256:

`35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`

During v0.28 development:

- no production Firebase deployment;
- no production league/season rehearsal data;
- no production account deletion;
- no v0.27 tag movement or release-source edits;
- Firestore Rules changes remain isolated and emulator-tested if a rehearsal exposes
  a real Rules defect;
- do not broaden the rehearsal into deferred App Check/CSP/enterprise recovery work.

## Rehearsal strategy

The rehearsal is layered so failures are diagnosable.

### Layer 1 — deterministic domain rehearsal

Use synthetic players, Houses, dates and immutable ledger records to exercise the
existing pure competition models in chronological order.

The first automated happy-path harness must prove one coherent season rather than a
collection of unrelated unit cases.

### Layer 2 — local Firebase emulator rehearsal

Use synthetic identities and local Firestore/Auth-compatible fixtures where service
and Rules behavior must be exercised together.

The rehearsal environment must be unmistakably local/test-only and must fail closed
rather than silently using the production Firebase project.

### Layer 3 — manual local UI rehearsal

Once the automated rehearsal is stable, run the real Houses/Seasons/Admin/Inbox
workspaces against disposable local rehearsal data.

Manual rehearsal is for workflow continuity, role clarity and operator recovery.
It must not create unnecessary production competition data.

## Canonical synthetic season

Use one deterministic representative season fixture throughout v0.28 unless a specific
adversarial case requires a smaller isolated fixture.

Recommended baseline:

- one League Administrator;
- one Platform Administrator;
- 12 synthetic registered players;
- 3 themed Houses with 4 players after C.H.A.O.S.;
- captain + vice-captain leadership per House;
- at least 4 competition weeks so a real roster move can demonstrate the following
  week's stability lock and reopening in the week after;
- Pocket Week immediately before the season;
- a Power Play pool large enough to prove no-repeat weekly selection;
- evidence-required and non-evidence activity categories;
- at least one League Administrator bonus request plus one Platform Administrator
  direct award and one correction;
- enough contribution history to calculate standings, House totals and honours.

Theme names are fixture data only and must not become hard-coded product semantics.

## End-to-end lifecycle matrix

### 1. Draft and registration

Prove:

- League Administrator can create a valid draft league/invite;
- creator is correctly scoped as the initial administrator;
- Houses can be created only within the valid draft boundary;
- House names/presentation remain theme-ready;
- required Power Play setup can block registration readiness when incomplete;
- invitation code normalization works;
- synthetic players can join registration correctly;
- withdrawal during the permitted registration state behaves correctly;
- participant counts and membership state remain consistent;
- a global League Administrator cannot gain authority over another league.

Primary existing surfaces:

- `src/services/leagues/leagueModel.js`
- `src/services/leagues/leagueService.js`
- `src/services/seasons/seasonModel.js`
- `src/services/seasons/seasonService.js`
- `src/services/seasons/powerPlayModel.js`

### 2. C.H.A.O.S. and opening House assignments

Prove:

- readiness explains every missing prerequisite;
- every registered player is assigned exactly once;
- distribution is deterministic for the same seed;
- House sizes remain balanced;
- opening assignment history is immutable/deterministic;
- opening C.H.A.O.S. does not incorrectly create a post-move rest lock;
- composition/profile information remains private-ready and season-scoped.

### 3. Leadership

Prove:

- election window is one day;
- only eligible House members participate;
- captain and vice-captain ranking is deterministic;
- ties and no-vote outcomes require the correct administrator resolution;
- captain/vice-captain authority is House-scoped;
- additional vice-captain behavior does not grant Platform or League Administrator
  authority.

### 4. Pocket Week

Prove:

- Pocket Week is exactly the seven days before season start;
- eligible factual activity can be stored;
- canonical partial quantities and whole-session redemptions work;
- redemption preserves original activity identity while changing only permitted
  quantity/date information;
- invalid dates, quantities and ownership are rejected;
- redemption cannot bypass later evidence/correction/competition integrity rules.

### 5. Evidence and leaderboard publication

Prove:

- qualifying evidence-required entries hold only the intended points;
- non-required components remain available immediately;
- only Platform Administrators decide evidence;
- League Administrators cannot approve/reject proof;
- expiration, late acceptance and reversals remain auditable;
- verified proof has a matching immutable released contribution;
- leaderboard publication timing and publication source are deterministic;
- publication cannot silently omit a required contribution.

### 6. Entry corrections

Prove:

- factual corrections preserve immutable history;
- correction head/current-version behavior is stable;
- corrected qualifying Running preserves immediate Cardio while re-evaluating pending
  Running proof;
- correction to a non-qualifying run removes the required-proof allocation correctly;
- Pocket redemption entries remain outside the ordinary replacement workflow;
- trusted reconciliation detects missing/orphan/gapped correction records.

### 7. Weekly roster movement and stability

Prove:

- only captain/vice-captain/allowed administrator actions can move players;
- a valid move updates both affected Houses consistently;
- history records the source and destination House;
- the moved player is stable/locked for the following week;
- movement reopens in the week after;
- historical points and bonuses stay attached to the House recorded when earned;
- current-week and House-lock restrictions are understandable and enforced.

### 8. Power Plays

Prove:

- one theme-ready play exists per supported activity category;
- registration readiness requires enough unique confirmed plays;
- weekly selection is deterministic from the eligible unused pool;
- a used play cannot be repeated;
- corrections cannot create inconsistent used-state history;
- multipliers apply only to eligible activity contribution points;
- evidence bonuses and League Season bonus points are not multiplied;
- Running/Cardio cross-category contributions use their correct score category;
- individual and House standings consume the same adjusted contribution.

### 9. League Season bonus points

Prove:

- League Administrator submits a scoped request with mandatory reason;
- Platform Administrator approves/rejects;
- Platform Administrator may award directly;
- corrections are separate immutable adjustments;
- award-time House identity is preserved through later roster movement;
- player and historical House totals move equally;
- awards bypass activity caps, participation bonuses and Power Plays;
- bonuses affect overall/House honours but never create category champions.

### 10. Weekly House balancing

Prove:

- each House is compared with the season distribution;
- private composition data remains appropriately suppressed;
- small disclosed groups are not exposed in member snapshots;
- status wording remains informational rather than deterministic/personality-labelling;
- balance output never silently moves players by itself.

### 11. Trusted reconciliation

Prove one complete immutable ledger can produce a publishable trusted audit.

Also prove blockers for:

- missing evidence contribution links;
- verified proof with no released contribution;
- missing correction reconciliation contributions;
- repeated/mismatched Power Play state;
- malformed season-bonus contribution;
- stale or mismatched published standings;
- inconsistent House attribution.

Use the existing trusted fingerprint so source-array ordering cannot change the audit
identity.

### 12. Completion, publication and honours

Prove:

- lifecycle only moves forward through allowed states;
- final trusted standings match the immutable ledger;
- publication history is immutable;
- individual titles crown exactly one valid player per title;
- House honours preserve historical House chapters;
- Power Play-adjusted standings feed honours correctly;
- season bonus affects only the honours dimensions already defined by product rules;
- archived/completed season structures remain historical and cannot use draft hard
  deletion.

### 13. Trusted account deletion during/after a season

Prove:

- the cancellation window is respected;
- the final Platform Administrator cannot be deleted;
- the frozen recovery plan binds exact paths/modes and operation fingerprint;
- shared competition records preserve facts while replacing identity where required;
- replay is idempotent;
- conflicting or drifted recovery state fails closed;
- completed season facts, standings and honours are not corrupted.

## Adversarial Firestore Rules matrix

28D must execute the full existing Rules emulator gate and add focused adversarial
cases only where the rehearsal identifies missing coverage.

At minimum confirm:

- profile role is the only Platform Administrator authority source;
- global League Administrator role cannot read/manage a foreign private draft;
- evidence decisions remain Platform Administrator-only;
- immutable contributions/audit/history cannot be rewritten by ordinary clients;
- roster/movement writes obey current season/week/leadership boundaries;
- bonus direct/review authority is not client-escalatable;
- draft hard deletion cannot cross the zero-participant unused-draft boundary;
- retired Team/reviewer paths remain denied by the recursive fallback.

Rules edits, if any, must be isolated from ordinary rehearsal code and pass the full
emulator suite before they are accepted.

## Recovery runbook scenarios

The permanent v0.28 runbook must explain recovery from:

1. interrupted trusted season reconciliation;
2. stale trusted run;
3. incomplete leaderboard publication;
4. evidence decision/contribution mismatch;
5. incomplete correction chain;
6. Power Play assignment mismatch;
7. interrupted trusted account deletion with a valid frozen recovery plan;
8. account-deletion recovery-plan drift/conflict;
9. accidental rehearsal interruption before season completion.

Every recovery path must identify whether it is replay-safe, requires an administrator
decision, or is a hard stop.

## Checkpoint order

### 28A — rehearsal contract + gap inventory — COMPLETE

- branch from finalised v0.27.0 documentation state;
- freeze the production boundary;
- map the complete lifecycle to current models/services/tests;
- define one canonical synthetic season and adversarial matrix;
- no application behavior, package version, Rules or Firebase changes.

### 28B — local rehearsal environment + deterministic happy path

- advance package version to 0.28.0;
- add fail-closed local rehearsal/emulator plumbing where needed;
- add one chronological deterministic season harness from draft/registration through
  ordinary active-season weekly operations;
- prove C.H.A.O.S., leadership, Pocket Week and baseline contributions in one coherent
  fixture;
- keep production Firebase untouched.

### 28C — adversarial weekly operations

- add evidence, corrections, roster movement/stability, Power Plays, bonus requests/
  awards/corrections and weekly House-balance scenarios;
- test both permitted and rejected role/state combinations;
- repair only real integration defects discovered by the rehearsal.

### 28D — trusted closeout + recovery + Rules acceptance

- reconcile the full synthetic ledger;
- publish final standings and honours;
- rehearse trusted account deletion/recovery effects on competition history;
- run/adapt adversarial Firestore Rules coverage;
- produce the permanent recovery runbook;
- complete the manual local UI rehearsal;
- no production deployment.

### 28R — release freeze

- full application regression;
- full Rules emulator regression;
- production build and existing v0.27 UX/performance acceptance guard;
- v0.28 rehearsal acceptance report;
- final recovery/release checklist;
- dedicated production activation only after the freeze passes.

## 28A gap inventory

Existing coverage is strong at the unit/domain level:

- season lifecycle/C.H.A.O.S./leadership/Pocket models;
- evidence allocation/decision/publication;
- correction history/integrity;
- movement/rest and House-balance calculations;
- Power Play pool/readiness/selection/multipliers;
- bonus award/correction contribution behavior;
- trusted reconciliation and snapshot comparison;
- trusted account deletion/recovery;
- 98 Firestore Rules tests;
- 188 application tests at the v0.27 release baseline.

The key v0.28 gap is not absence of individual rules. It is absence of one
chronological synthetic season that proves these systems interoperate while state
moves from registration through completion.

A second gap is safe end-to-end rehearsal infrastructure. The production app currently
does not connect its normal browser flow to Firebase emulators, so 28B must establish a
clearly test-only, fail-closed rehearsal path before manual UI rehearsal is attempted.

## Acceptance boundary

28A is complete when this plan is committed on `development/v0.28.0` and the unchanged
v0.27 application gate still passes.

No product behavior is changed by 28A.
