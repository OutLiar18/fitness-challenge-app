# Champions Legacy Challenge — Points System

Current engine: **Points Engine v2**  
Current season guide: **points-v3**

## Principle

Points reward measurable effort without allowing athletic ability to overwhelm consistency. Factual activity, evidence decisions, Power Play modifiers, competitive Points and Experience Points remain distinct.

## Public activity scoring

- Water, Steps, Reading, Skill, Running and workout thresholds come from central constants/services.
- Fruit earns five points per complete qualifying serving.
- Cardio applies its configured difficulty multiplier after base duration points.
- Workouts use Effective Repetitions and moderate difficulty multipliers.
- Running earns Running points only at three kilometres or more and 11:00 per kilometre or faster.
- Running duration also earns Cardio points at Tier 3.

## Evidence effects

- Qualifying Running: Cardio points are immediate; Running points remain pending until proof is accepted.
- Non-qualifying Running: Cardio only; no Running evidence claim is required.
- Steps: competitive Steps points remain pending until proof is accepted.
- Water and Fruit: normal points remain immediate; accepted proof may add one configured daily evidence bonus.
- Evidence bonuses count for the individual and historical House, are Points rather than Experience Points, sit outside ordinary activity caps and are reversible only through signed audited contributions.

## Power Play calculation in v3 seasons

For an eligible contribution:

`Power Play activity points = base activity points × weekly multiplier`

Then the ordinary league daily activity cap is applied to the adjusted activity points. The activity's challenge date selects the week. Proof released later retains the activity week's multiplier.

Power Plays include ordinary and proof-released activity contributions but exclude evidence bonuses, goals, missions, streaks, Experience Points, active-day participation and administrator adjustments.

## League scoring

The consistency ranking logic remains versioned and season-frozen. v2 adds evidence-aware activity allocation and the Fruit cap. v3 adds theme-named no-repeat Power Plays without rewriting v1/v2 seasons.

## Change rules

- Never hardcode scoring tables in pages.
- Never silently edit calculated points.
- Correct factual mistakes through audited replacement records.
- Correct evidence decisions through reversal and replacement.
- Correct locked Power Play facts through the audited Platform Administrator path.
- Add domain and Rules tests for every scoring or trust-boundary change.
- Never retrospectively rewrite completed season standings without immutable correction history.
