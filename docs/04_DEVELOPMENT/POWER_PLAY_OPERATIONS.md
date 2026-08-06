# Champions Legacy Challenge — Power Play Operations

Applies to new `season-houses-v3` seasons.

## 1. Prepare the draft pool

Open the season's **Power Plays** workspace while the season is Draft.

- Rename all ten base category plays to fit the season theme.
- Write a clear player-facing description.
- Confirm each enabled name as theme-appropriate.
- Ensure names are unique.
- Add optional custom 2×/3× one- or multi-category plays.
- Keep enough enabled confirmed plays to cover every official week without repeats.

Example for a mythological-creatures Water play: **Release the Kraken**.

## 2. Freeze the season

Registration cannot open until the readiness checks pass. Opening Registration freezes the pool and canonical definition map. Do not expect to rename or change multipliers after this point.

## 3. Select a week

An authorised administrator may select the current or a future official week. Selection is random from the unused pool. The selected ID immediately becomes consumed for the season.

Players see the assignment only once its official week starts. Reloading the Seasons page at a week boundary attaches the new started-week listener immediately.

## 4. Redraw before the week starts

A pre-week redraw requires a reason of at least the configured minimum length. The replaced play remains consumed and cannot return later.

## 5. Correct after the week starts

Only a Platform Administrator may correct a locked assignment.

- Record a factual correction reason.
- Choose an enabled, confirmed and unused replacement.
- Never reuse the original or any previously selected play.
- Preserve the previous assignment in history.

## 6. Standings and evidence

No manual score recalculation is needed. Standings use each contribution's challenge date. Proof accepted later for Running or Steps still receives the activity week's multiplier. Evidence bonuses and progression rewards remain unmultiplied.

## 7. Publication

Before publishing important standings:

1. confirm the weekly assignment is correct;
2. run the trusted season dry audit;
3. resolve any Power Play duplicate, frozen-definition or used-state blocker;
4. publish only after the audit is clean.

## Recovery

Do not edit weekly documents directly in Firestore. Use the provided audited redraw or Platform Administrator correction path. Direct edits can break trusted reconciliation and published standings integrity.
