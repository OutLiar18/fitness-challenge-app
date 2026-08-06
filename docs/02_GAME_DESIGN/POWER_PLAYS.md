# Champions Legacy Challenge — Power Plays

Version: `power-play-v1`  
Introduced: v0.23.0  
Applies to: newly created `season-houses-v3` seasons

## Purpose

A Power Play gives every official season week a visible thematic identity and creates focused strategy without replacing consistency. The modifier is simple, transparent and reconstructable from immutable records.

## Weekly rule

- Exactly one Power Play is selected for each official season week.
- It lasts from that week's season-relative start date through the complete final calendar day.
- Selection is random from the enabled, theme-confirmed, unused pool.
- Once a Power Play is selected, it is permanently consumed for that season. A redrawn or corrected-away play also remains consumed.
- The pool does not reset during the season.

## Theme identity

Every enabled Power Play needs a unique name written for that season's theme. Names are not generic category labels. For example, a mythological-creatures Water Power Play could be named **Release the Kraken**.

Every new v3 season begins with ten editable base definitions, one for each category:

1. Water
2. Fruit
3. Reading
4. Running
5. Upper Body
6. Lower Body
7. Core
8. Cardio
9. Skill Development
10. Steps

All enabled base and custom names must be confirmed as theme-appropriate before registration opens.

## Custom Power Plays

Authorised season creators may add controlled custom definitions while the season is Draft:

- unique name;
- player-facing description;
- 2× or 3× multiplier;
- one or multiple activity categories;
- enabled/inactive state;
- theme-name confirmation.

Arbitrary formulas are not allowed. A season may have at most the configured pool limit, and the enabled confirmed pool must contain at least one unique play per official week.

## What is multiplied

Power Plays multiply competitive **activity points** only. The multiplier is applied before the ordinary daily league activity cap.

Included:

- immediate activity contributions;
- proof-released Running or Steps activity points;
- individual standings;
- historical House standings;
- category totals and season honours derived from those contributions.

Excluded:

- evidence bonuses;
- daily and weekly goal bonuses;
- mission bonuses;
- streak rewards or shields;
- Experience Points and achievements;
- administrator adjustments or unrelated special bonuses;
- active-day participation values.

## Activity-date rule

The challenge date of the activity determines the relevant official week. A Running or Steps contribution released after proof review still receives the Power Play that applied when the activity occurred, not the week when a reviewer accepted it.

Running's Cardio and Running contribution groups are evaluated separately by their score category. A Cardio-only Power Play does not multiply the Running portion, and vice versa, unless both categories are targeted.

## Selection, redraw and correction

- An authorised season administrator may select or preselect an unused play.
- Before the week begins, an existing selection may be redrawn only with a recorded reason.
- When the week begins, the assignment locks.
- After locking, only a Platform Administrator may perform an audited factual correction.
- The replacement must be enabled, theme-confirmed and unused.
- Previous assignments remain in history; they are never silently erased.

## Visibility

Administrators may prepare future weeks. Players see only assignments whose official week has started. The active play displays its name, multiplier, target categories and week dates.

## Historical integrity

The season freezes both its editable pool and a canonical definition map when registration opens. Weekly assignment records copy the frozen name, multiplier and categories and must match that map. Trusted reconciliation verifies:

- one assignment per official week;
- no repeated Power Play IDs;
- consistency with frozen definitions;
- consistency with the season used-ID state;
- correct Power Play-adjusted individual and House standings.

Existing v1/v2 seasons remain unchanged.
