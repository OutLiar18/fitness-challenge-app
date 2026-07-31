# Champions Legacy — Current Context

Last updated: 31 July 2026
Version target: 0.6.0
Phase: Personal Progression Foundation

## Current focus

The release-readiness work for v0.5.1 exposed missing goal rules and progression requirements. The current code now centralises daily/weekly goals, adds moderate completion bonuses, and implements the first complete personal-progression layer.

## Recently completed

- Running eligibility: minimum 3 km and maximum 11:00/km for Running points.
- Cardio credit retained for every saved run.
- Independent daily and weekly goals for Upper Body, Lower Body and Core.
- Daily/weekly dashboard tabs.
- Goal and mission bonus points.
- Forgiving streaks with one earned shield.
- Streak milestone points and XP.
- Personal XP, levels and titles.
- Starter achievement set and progression dashboard card.
- Eighteen automated domain tests.
- Obsolete statistics, migration, Cardio configuration and exercise-option services removed.

## Architectural direction

- Entries remain factual.
- Activity points remain owned by the Points services.
- Goals remain owned by Statistics/Goals services.
- Bonus events, streaks, XP and achievements remain owned by Progression services.
- UI consumes summaries and never duplicates formulas.
- Goal and progression balancing lives in configuration.

## Next focus

1. Local lint/build verification and visual QA.
2. Document and tag v0.6.0.
3. Build a dedicated personal progress/profile route.
4. Expand achievements and category milestones without duplicating progression rules.
5. Design scalable historical aggregation before entry pagination.
