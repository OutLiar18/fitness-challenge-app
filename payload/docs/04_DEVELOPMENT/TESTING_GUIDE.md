# Champions Legacy Challenge — Testing Guide

Last updated: 1 August 2026

## Required command

```powershell
npm run check
```

This runs:

1. ESLint.
2. Node domain and architecture tests.
3. Vite production build.

## Automated suites in v0.9.0

- `domain.test.mjs` — points, validation, Running/Cardio and dates.
- `goals.test.mjs` — daily and weekly goal rules.
- `progression.test.mjs` — bonuses, streaks, experience points and achievements.
- `records.test.mjs` — personal records.
- `timeline.test.mjs` — grouped chronological progression events.
- `experience.test.mjs` — navigation integrity, future previews and motivation determinism.
- `profile-announcements.test.mjs` — Legacy Avatars, profile validation and announcement filters.
- `admin-platform.test.mjs` — trusted identifiers, announcement validation and merging, plus complete player-facing measurement wording.

Expected total: **33 tests**.

## Manual player checks

- Authenticate and refresh every protected route.
- Navigate desktop, tablet and mobile structures.
- Save and delete entries.
- Confirm date locking and local-date preservation.
- Compare Dashboard and Progress totals.
- Confirm player-facing units use complete words.
- Confirm announcement read state synchronises across browsers.

## Manual administration checks

- Verify a normal player cannot load privileged Firestore data.
- Create and publish an announcement.
- Archive a published announcement.
- Review an Exercise suggestion.
- Review a Cardio or Skill suggestion.
- Change another player’s role and team.
- Confirm every privileged write creates a matching audit event.
- Confirm audit documents cannot be edited or deleted.

## Security-rule testing direction

Add Firebase Emulator Suite tests before production scale. Tests should cover:

- player ownership;
- profile-field restrictions;
- draft-announcement privacy;
- administrator authorization;
- required audit events;
- suggestion state transitions;
- self-role-change denial;
- audit immutability.

## Defect rule

Every reproducible domain or security defect should receive a regression test. UI-only defects should receive a documented manual test until a browser test framework is intentionally adopted.
