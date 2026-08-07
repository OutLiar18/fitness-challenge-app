# v0.24.0 Controlled Checkpoints

v0.23.5 is the protected production baseline. v0.24.0 is built only on `development/v0.24.0` and production deployment remains blocked until the release is complete.

## Checkpoint 1 — pure House-movement domain foundation

Status: passed and committed as `0.24.0-dev.1`.

- one-week post-move rest calculation;
- movement eligibility explanations;
- current House leadership protection;
- current-week move protection;
- House weekly-move lock awareness;
- C.H.A.O.S. assignment remains exempt from the post-move rest;
- deterministic future assignment-history identifiers;
- no Firestore Rules changes.

Result on the Windows development machine: 126/126 domain tests, 51/51 Rules tests, build pass, exact v0.23.5 Rules hashes preserved.

## Failed probe — embedded v4 House-movement policy

The first Checkpoint 2A attempt added a nested `houseMovementPolicy` map to the League ruleset and validated it inside the already-large League draft create rule.

The legitimate administrator v4 draft create failed with Firestore's 1,000-expression evaluation limit. No persistence, assignment history, overrides, composition or weekly balance had been added. This established that the embedded policy contract itself was already too expensive for the current League-create validator.

That failed probe must not be committed or extended.

## Checkpoint 2A replacement — lean v4 version contract

Status: prepared as `0.24.0-dev.2` and awaiting full Windows Rules verification.

The replacement architecture does **not** store a redundant House-movement policy map in the League document. Instead, the ruleset version itself is the frozen contract:

- `season-houses-v3` = existing Power Play season behavior;
- `season-houses-v4` = the same draft ruleset shape plus House Movement v1 semantics;
- House Movement v1 means one post-move rest week, C.H.A.O.S. exemption, future immutable assignment history, and Platform Administrator factual-correction support when those persistence checkpoints are added;
- the application default remains v3 during this probe, so no runtime v4 season is created yet;
- no v4 lifecycle, membership persistence, assignment-history collection, override write, composition or weekly-balance rule is added;
- production Rules, Hosting and combined production deploy commands remain blocked.

The decisive Rules regression test creates a legitimate administrator v4 draft with `houseCount: 8` using the same three-write audit + League + invite batch as v3. Its valid path must succeed. A malformed v4 scoring contract must still fail.

If this lean positive path still exceeds 1,000 expressions, stop and refactor the existing League create validator itself before any more v0.24 functionality is introduced.

## Checkpoint 2B — wire v4 creation and registration safely

Planned only after the lean v4 draft positive path passes.

- make new application-created seasons use v4;
- explicitly support v4 Power Play draft maintenance;
- add a legitimate positive registration-opening Rules test;
- do not add movement persistence yet.

## Checkpoint 3 — membership rest-lock persistence

Planned after Checkpoint 2B.

Add only the membership fields needed for the one-week post-move rest and update the existing balanced swap transaction. Add positive and negative Rules tests around a normal weekly swap.

## Later checkpoints

Assignment history, audited factual corrections, privacy-safe composition foundations and weekly House balance remain separate later checkpoints. Each Rules change must have a legitimate positive-path regression test before another Rules feature is added.
