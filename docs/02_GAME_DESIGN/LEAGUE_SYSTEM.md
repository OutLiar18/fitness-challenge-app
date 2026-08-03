# Champions Legacy Challenge — Season League System

Last updated: 3 August 2026  
Implemented foundation: v0.14.0

## Purpose

A season is a time-limited themed competition with simultaneous individual and House standings. Personal progression remains permanent while each season begins its own competitive chapter.

## Lifecycle

1. **Draft** — create identity, dates, theme, rules and Houses.
2. **Registration** — invitation opens and players register as individuals.
3. **C.H.A.O.S.** — administrator assigns every registered player to a House.
4. **Active** — entries and Pocket redemptions create eligible contributions.
5. **Completed** — scoring closes and honours become final.
6. **Archived** — historical read-only season.

Firestore stores Draft, Registration, Active, Completed and Archived as the formal status sequence. C.H.A.O.S. is a one-time Registration action.

## Frozen rules

Every new season stores `season-houses-v1`:

- Points Engine `points-v2`;
- all ten factual categories;
- 20-point daily raw-activity cap per player;
- five-point daily participation bonus;
- Houses, C.H.A.O.S., leadership elections, roster swaps and Pocket Week enabled;
- Power Play, full Transfer Market, Buddy Bonus and Five Fires disabled.

## Dual standings

For each player/day, eligible activity points are capped and the participation bonus is added. Individual standings sum those daily scores.

House standings repeat the same day calculation against each contribution’s historical House snapshot. Current membership is never used to rewrite earlier House totals.

## Season honours

- Legacy Champion.
- Category champions in the established prestige order, with one individual title per player.
- One House Champion per House.
- House of Champions.

Honours are provisional during an Active season and final after completion.

## Trust boundary

The client calculates category points while Rules enforce active membership, source-entry linkage, historical House identity, frozen rule version and immutability. Friendly competition is supported; prize-bearing competition requires trusted backend recalculation.
