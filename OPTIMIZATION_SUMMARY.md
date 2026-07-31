# Champions Legacy v0.6.0 Optimisation Summary

Date: 31 July 2026

## Architecture

- Removed goal values from category presentation configuration.
- Added dedicated goal and progression configuration modules.
- Added pure progression services with no React or Firebase dependencies.
- Kept activity points, factual statistics and personal progression as separate responsibilities.
- Removed obsolete monolithic statistics, migration, Cardio points and exercise-option services.
- Preserved one Firestore entry per activity.

## Correctness

- Running points require 3 km and 11:00/km or faster.
- Ineligible runs still contribute Cardio points and duration.
- Workout goals use Effective Repetitions.
- Daily and weekly periods preserve local dates.
- Goal bonuses are awarded once per goal per period.
- Streak milestone bonuses are awarded once per lifetime threshold.
- XP remains separate from competitive points.

## Scalability

- Progression event IDs are deterministic.
- Bonus completion dates are derived from the first date a target is reached.
- XP participation is capped to one event per category per day, preventing split-entry farming.
- UI consumes one progression summary instead of recomputing formulas.
- Future pagination requires trusted historical aggregation; this is documented rather than hidden.

## Verification

- 17 automated domain tests pass.
- Local lint and production build remain required after a fresh platform-correct dependency install.
