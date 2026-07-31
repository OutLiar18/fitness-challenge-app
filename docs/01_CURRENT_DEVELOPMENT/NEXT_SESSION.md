# Champions Legacy — Next Session

Version target: 0.6.0
Objective: Verify and release the Personal Progression Foundation

## Required sequence

1. Back up `.env` and confirm it remains ignored.
2. Delete `node_modules`.
3. Run `npm install`.
4. Run `npm run check`.
5. Run `npm audit` and do not use `--force`.
6. Start the app with `npm run dev`.

## Focused manual checks

### Goals and bonuses

- Daily tab shows nine goals and excludes Running.
- Weekly tab shows ten goals and uses Monday–Sunday.
- Upper Body, Lower Body and Core progress independently.
- Running duration contributes to Cardio.
- Each completed daily goal shows +1 point.
- A perfect day adds +3 additional points.
- Each completed weekly goal shows +2 points.
- A perfect week adds +8 additional points.
- Total Points includes bonuses; Top Categories does not.

### Running

- A run below 3 km receives zero Running points.
- A run slower than 11:00/km receives zero Running points.
- Both runs remain saved and still receive Cardio credit.
- A qualifying run receives both Running and Cardio points from one document.

### Streak and progression

- Completing one daily goal starts/continues the streak.
- An incomplete current day displays as pending rather than immediately breaking it.
- Seven successful days earn one shield.
- One missed day consumes the shield and preserves the streak.
- A second unprotected miss breaks it.
- XP, level progress, bonus totals and achievements update.

## After verification

- Fix only reproducible defects.
- Add a regression test for each defect.
- Commit with: `feat: add personal progression and streaks`
- Update release notes if behaviour changes during QA.
- Tag `v0.6.0` only after `npm run check` passes locally.
