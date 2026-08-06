# ADR-030 — Themed No-Repeat Power Plays

Status: Accepted  
Date: 5 August 2026

## Context

The season competition needs weekly thematic variation without arbitrary scoring, repeated advantages or history that cannot be reconstructed. Power Play names must belong to the season theme, custom ideas must remain controlled, and a selected play may never return later in the same season.

## Decision

1. New seasons use `season-houses-v3` and freeze a `power-play-v1` policy.
2. Every draft receives ten base definitions, one per activity category.
3. Every enabled definition needs a unique, administrator-confirmed theme name.
4. Custom definitions support only 2× or 3× and one or more approved categories.
5. One play is selected for each season-relative official week by deterministic random selection from unused enabled definitions.
6. Selection is without replacement for the whole season. Selected, redrawn and corrected-away IDs all remain consumed.
7. Activity points are multiplied by the activity date before the normal league activity cap.
8. Evidence bonuses, goals, missions, streaks, Experience Points, active-day values and administrator adjustments are excluded.
9. Individual standings, House standings and honours use the same adjusted contribution.
10. Weekly assignments copy and must match the frozen canonical definition map.
11. Pre-week redraw needs an audit reason. Locked-week correction is Platform Administrator-only and must use another unused definition.
12. Existing v1/v2 seasons remain unchanged.

## Consequences

- The enabled confirmed pool must be at least as large as the number of official weeks.
- Administrators must prepare theme names before registration.
- The app does not need a background scheduler; operators may select or preselect weeks.
- Trusted reconciliation must include assignment history and used-state consistency.
- Player reads can remain limited to started weeks while administrators retain operational visibility.

## Rejected alternatives

- Pool reset after exhaustion: rejected because it violates the season no-repeat rule.
- Reusing a play after redraw: rejected because selection itself consumes the play.
- Arbitrary formulas or multipliers: rejected as difficult to explain, secure and reconcile.
- Multiplying all bonuses: rejected because it would overpower consistency and mix competition with personal progression.
- Silently enabling old seasons: rejected because it would rewrite historical rules.
