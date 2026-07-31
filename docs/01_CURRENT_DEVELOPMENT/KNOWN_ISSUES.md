# Champions Legacy — Known Issues

Last updated: 31 July 2026

## Open

### React Router audit advisory

`npm audit` reports the React Router RSC CSRF advisory for the installed 7.x range. Champions Legacy uses client-side browser routing and does not use React Server Components mode. Do not apply the suggested forced downgrade. Reassess when a non-breaking patched release is available.

### Large production bundle

The Vite build reports a JavaScript chunk above 500 kB. This is not a functional blocker. Add route-level code splitting when more routes are introduced rather than hiding the warning.

### Full-history progression calculation

Streaks, bonuses, XP and achievements are derived from the user's complete subscribed entry history. This is correct at current scale but must be paired with historical aggregation before paginating entries.

### Ruleset history

Changing current goal or progression configuration still recalculates historical derived values. Events expose ruleset identifiers, but leagues require immutable persisted snapshots before results can be frozen.

### Dedicated progression views

The dashboard shows the progression summary, but full achievement browsing, category mastery, detailed milestones and personal-record history still need dedicated routes.

## Closed in v0.6.0

- Workout goals counting entries instead of Effective Repetitions.
- Running points awarded below 3 km or slower than 11:00/km.
- Missing daily/weekly goal separation.
- Missing goal-completion bonus points.
- Missing streak recovery behaviour.
- Duplicate/obsolete service files with broken imports.
