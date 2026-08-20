# Champions Legacy Challenge — v0.28.0 Points Guide Reconciliation

Checkpoint: 28D10

## Review outcome

The Points Guide already sources activity ladders, workout difficulty, goal bonuses
and daily season caps from live scoring constants. The main inconsistency after the
28D9 Rulebook reconciliation was that the public scoring reference still omitted the
active evidence scoring effects and approved season adjustments that can change
season standings.

28D10 closes that gap without changing the scoring engine.

## Changes

- Challenge Rulebook is recorded as owner-accepted;
- Points Guide advances from `points-v3` to `points-v4`;
- ordinary page, tab, intro, goal-bonus, season-note and boundary chrome uses the
  shared Phosphor-backed ThemeIcon system;
- activity/category identity continues to use the existing data-driven category
  artwork;
- `One action, one calculation` is replaced because one factual activity can
  legitimately contribute through more than one scoring path, especially Running;
- Steps, Water, Fruit and Running guides now disclose their evidence-enabled season
  behaviour;
- Water/Fruit evidence thresholds, bonus values, proof deadline and Fruit league cap
  are derived from the active season evidence policy instead of duplicated numbers;
- Season scoring gains a focused `Evidence and approved adjustments` surface covering
  proof timing, Running/Steps holds, Water/Fruit bonuses and approved season bonus
  treatment;
- approved season bonuses are described as audited adjustments rather than disguised
  as an activity formula;
- the existing Rulebook cross-reference and URL-backed tab/category state remain.

## Important scoring clarity

- qualifying Running can contribute both Running and Cardio;
- during an evidence-enabled season, qualifying Running releases Cardio immediately
  while Running points wait for proof;
- Steps points wait for proof;
- Water and Fruit base points are not held for their photo bonus;
- qualifying Water/Fruit proof can each add +3 season points once per category/day
  at the active policy thresholds;
- current league standings cap Fruit activity at five servings per player/day;
- approved season bonuses sit outside the daily activity cap and Power Plays and are
  credited to both the player and their historical House attribution;
- one-off Experience Point / hidden progression rewards remain outside this public
  competitive scoring reference.

## Safety boundary

28D10 does not change:

- activity point tables or formulas;
- workout difficulty multipliers;
- goal bonus values;
- evidence calculations or decisions;
- league daily caps or participation bonus values;
- season bonus calculation/authority;
- Power Plays;
- Firestore Rules;
- Firebase deployment state.

Broad CSS consolidation remains deferred to v0.31.
