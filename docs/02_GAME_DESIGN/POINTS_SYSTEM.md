# Champions Legacy Challenge — Points System

Current engine: **Points Engine v2**  
Public guide: **points-v2**

## Purpose

Points reward measurable effort without allowing athletic ability to overwhelm consistency. Difficulty changes scores moderately. Personal points, experience points and league ranking values remain separate.

## Calculation sources

- `src/constants/points/points.js` — Water, Reading, Skill, Running, Cardio and Steps thresholds.
- `src/constants/points/workoutPoints.js` — Effective Repetitions thresholds.
- `src/constants/libraries/difficulty.js` — Tier multipliers.
- `src/services/points/categoryPoints.js` — category-specific calculation, including Fruit.
- `src/services/points/pointsGuideModel.js` — player-facing guide generated from those sources.
- `/points-guide` — public scoring presentation.

The old 2025 points image is historical reference only and must never be used for calculation.

## Public activity scoring

- Water, Steps, Reading, Skill, Running and workout thresholds are shown as complete ranges, including zero-point ranges.
- Fruit earns five points per complete qualifying serving.
- Cardio applies the configured difficulty multiplier after base duration points.
- Workouts apply exercise difficulty to repetitions before the Effective Repetitions table.
- A Running entry earns Running points only when distance is at least 3 kilometres and pace is 11:00 per kilometre or faster.
- Running duration also earns Cardio points at Tier 3 automatically.

## Public visible bonuses

The Points Guide may show:

- one point per completed daily goal;
- three additional points for completing every daily goal;
- two points per completed weekly goal;
- eight additional points for completing every weekly goal;
- league daily activity cap and active-day participation bonus.

## Intentionally undisclosed progression rewards

The public Points Guide omits one-off or discovery-oriented progression details such as streak milestone points and achievement/experience surprises. The engine and tests remain authoritative; omission from the guide does not alter calculation.

## League scoring

The default `consistency-v1` league day score is:

`min(20, activity points) + 5 when the player is active that day`

This is a seasonal ranking value and does not replace personal points. A league freezes its ruleset version when created.

## Change rules

- Never hardcode scoring tables in React pages.
- Update central constants/services and let the guide regenerate.
- Add domain tests for every balancing change.
- Never retrospectively rewrite completed league standings.
- Keep hidden rewards separate from repeatable public activity calculations.
