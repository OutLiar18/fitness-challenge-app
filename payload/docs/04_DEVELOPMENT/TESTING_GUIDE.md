# Champions Legacy — Testing Guide

Last updated: 1 August 2026

## Required command

```powershell
npm run check
```

This runs:

1. ESLint.
2. Node domain tests.
3. Vite production build.

## Automated suites in v0.7.0

- `domain.test.mjs` — points, validation, Running/Cardio and dates.
- `goals.test.mjs` — daily/weekly goal rules.
- `progression.test.mjs` — bonuses, streaks, XP and achievements.
- `records.test.mjs` — personal records.
- `timeline.test.mjs` — grouped chronological progression events.
- `experience.test.mjs` — navigation integrity, future previews and motivation determinism.

Expected total: **26 tests**.

## Manual route checks

- Authenticate and refresh every protected route.
- Navigate desktop and mobile layouts.
- Verify goal-card deep links select the correct Log category.
- Save/delete entries and review date locking.
- Compare Dashboard and Progress totals.
- Confirm Admin exposes no privileged actions to a normal user.
- Test keyboard focus and 320 px layout.

## Defect rule

Every reproducible domain defect should receive a regression test. UI-only defects should receive a documented manual test until a browser test framework is intentionally adopted.
