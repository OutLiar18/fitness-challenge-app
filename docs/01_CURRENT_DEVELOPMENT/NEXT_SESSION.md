# Champions Legacy — Next Session

## Objective

Release-readiness QA for v0.5.0.

## Required sequence

1. Delete the old `node_modules` folder on the target computer.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and restore Firebase values.
4. Run `npm run lint` and `npm run build`.
5. Run `npm test` and confirm all domain tests pass.
6. Deploy `firestore.rules` to the development Firebase project.
7. Run the manual test checklist below.

## Manual test checklist

### Authentication

- Register a new account.
- Confirm the user profile document is created.
- Sign out and sign back in.
- Verify protected-route redirects.

### Every category

- Save one valid entry.
- Confirm invalid entries show useful errors.
- Confirm the journal updates in real time.
- Confirm daily goals and statistics update correctly.
- Delete today’s entry.

### Running

Confirm one Running entry:

- creates one Firestore document;
- displays Running points;
- displays Cardio Bonus points;
- contributes distance to Running;
- contributes duration to Cardio;
- contributes points to both Top Categories totals.

### Workouts

- Test a repetition exercise.
- Test a timed-hold exercise.
- Test an older Upper Body library exercise.
- Test a Tier 5 custom exercise.
- Verify Effective Repetitions appear in the point detail.

### Libraries and suggestions

- Select an existing book.
- Enter a new book and confirm personal library creation.
- Submit a custom Exercise, Cardio activity and Skill.
- Confirm suggestion documents are created with `pending` status.

### Journal and dates

- Navigate to yesterday and add/delete an entry.
- Navigate to an older date and confirm read-only behaviour.
- Confirm the date picker never shifts by one day.

### Responsive/accessibility

- Test keyboard-only selector use.
- Test at 320 px, tablet width and desktop width.
- Test light and dark operating-system themes.

## After QA

Fix only verified defects, expand the domain tests for each defect, record the release in `CHANGELOG.md`, then plan Streaks and XP.
