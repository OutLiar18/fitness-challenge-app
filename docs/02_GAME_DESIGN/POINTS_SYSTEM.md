# Champions Legacy Challenge — Points System

Current engine: **Points Engine v2**  
Public guide: **points-v2**

## Principle

Points reward measurable effort without allowing athletic ability to overwhelm consistency. Factual activity, evidence decisions, competitive Points and Experience Points remain distinct.

## Public activity scoring

- Water, Steps, Reading, Skill, Running and workout thresholds come from central constants/services.
- Fruit earns five points per complete qualifying serving.
- Cardio applies its configured difficulty multiplier after base duration points.
- Workouts use Effective Repetitions and moderate difficulty multipliers.
- Running earns Running points only at three kilometres or more and 11:00 per kilometre or faster.
- Running duration also earns Cardio points at Tier 3.

## v2 season evidence effects

- Qualifying Running: Cardio points are immediate; Running points remain pending until proof is accepted.
- Non-qualifying Running: Cardio only; no Running evidence claim is required.
- Steps: competitive Steps points remain pending until proof is accepted.
- Water: normal points remain immediate; accepted proof may add one configured daily evidence bonus.
- Fruit: normal points remain immediate up to the season's daily serving cap; accepted proof may add one configured daily evidence bonus.
- Current defaults are three bonus points after 750 photographed millilitres of Water and three bonus points after three photographed Fruit servings.

Evidence bonuses:

- count toward individual and historical House totals;
- are Points, not Experience Points;
- are stored as `pointGroup: evidenceBonus`;
- sit outside the ordinary league activity cap;
- are reversible only through signed audited contributions.

## League scoring

The existing consistency ranking logic remains versioned and season-frozen. v2 adds evidence-aware activity allocation and a five-serving Fruit scoring cap without rewriting v1 seasons.

## Change rules

- Never hardcode scoring tables in pages.
- Never silently edit calculated points.
- Correct factual mistakes through a future audited correction workflow.
- Correct evidence decisions through reversal and replacement.
- Add domain and Rules tests for every scoring or trust-boundary change.
- Never retrospectively rewrite completed season standings.
