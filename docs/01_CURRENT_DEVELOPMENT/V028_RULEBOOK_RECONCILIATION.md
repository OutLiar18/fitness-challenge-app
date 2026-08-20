# Champions Legacy Challenge — v0.28.0 Challenge Rulebook Reconciliation

Checkpoint: 28D9

## Purpose

28D9 is a full Rulebook reconciliation, not only a visual pass. Every current
Rulebook rule was reviewed against the active application systems before the
presentation was tightened.

The 2025 Revision 2 rulebook was consulted only where historical wording or an
inactive mechanic needed to be checked. The owner explicitly requested restoration
of the original cheating consequence, including the `3 Stripes of a Prison Zebra
Debacle`.

## Rule-content reconciliation

### Challenge structure and data integrity

- Monday-to-Sunday weeks and the Today/Yesterday editable window remain current.
- migration commentary about the former Tuesday/Monday and WhatsApp workflow is
  removed from player-facing rules;
- immutable factual corrections are now documented: the original history is
  preserved, category/date remain fixed, a reason is required, and Pocket
  redemptions cannot use the replacement workflow.

### Evidence

The previous Rulebook incorrectly described proof as merely optional/future-facing.
The current season evidence contract is now documented:

- active evidence seasons create proof claims and player-facing verification codes;
- proof is delivered through the approved evidence channel, currently WhatsApp,
  rather than uploaded as media into Champions Legacy;
- the normal proof deadline is 24 hours;
- qualifying Running releases Cardio points immediately while Running points wait
  for proof;
- Steps points wait for proof;
- Water at 750 ml and Fruit at 3 servings can each earn one verified +3 season-point
  photo bonus per day;
- only Platform Administrators make evidence decisions, including late verification.

### Competition scoring

The Rulebook now states the live season defaults that were previously only implied:

- up to 20 competitive activity points per player per day;
- +5 participation points on a day with counted activity;
- evidence and approved season bonus awards sit outside the daily activity cap;
- season bonus awards require a positive whole-number value and factual reason,
  increase the player and historical House equally, bypass Power Plays/daily caps,
  and do not create a category title;
- Fruit activity is capped at five servings per player per day for current league
  standings.

### Houses and movement

- the supported balanced weekly House swap remains current;
- a player who moves cannot move again in the following challenge week and becomes
  eligible again the week after, subject to the app's exceptional audited override.

### Learning

- the unsupported primary-skill season requirement is removed;
- the unsupported professional-study exception is removed from Reading.

### Inactive mechanics

- the obsolete inactive `photo-bonus` rule is removed because Water/Fruit photo
  bonuses are now active season mechanics;
- routine WhatsApp activity posting/manual logging remains inactive, while WhatsApp
  is explicitly allowed as the current evidence-delivery channel;
- the former Power Play voting, House-position multiplier table and 40% individual
  contribution penalty are explicitly inactive; current Power Plays use configured
  no-repeat 2x/3x plays;
- Transfer Market currency, Buddy Bonuses and Five Fires remain inactive.

## Rule presentation

- Rulebook version advances to `2026-08-v3`;
- every rule receives a stable hierarchical number such as `Rule 1.1`;
- numbers are assigned before search/status filtering, so a rule does not change
  number when filters change;
- rule numbers are searchable;
- `Adapted from 2025 ...`, `Added for the app` and `Why this changed:` are removed
  from player-facing presentation;
- the meaningful No Excuses clarification remains as a parenthetical aside;
- ordinary Rulebook chrome uses the shared Phosphor-backed `ThemeIcon` system while
  category identity in the goals table stays data-driven;
- desktop rule cards, section headers, particulars and the intro are made slightly
  denser while existing 46 px search/filter/jump touch targets remain intact.

## Deferred

Minor Legacy Coach padding noted during owner review is intentionally deferred to
v0.31 alongside broader CSS cleanup.

## Safety boundary

28D9 does not change the underlying scoring engine, evidence engine, House movement
engine, Power Play engine, season bonus model, Firestore data model, Firestore Rules
or Firebase deployment state. It makes the Rulebook accurately describe those
already-implemented systems.
