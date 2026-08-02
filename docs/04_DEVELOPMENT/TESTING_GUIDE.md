# Champions Legacy Challenge — Testing Guide

Last updated: 2 August 2026

## Domain suite

```powershell
npm test
```

v0.13.1 target: **54 passing tests**.

Coverage includes scoring, goals, progression, records, navigation, profiles, announcements, administration, libraries, monitoring, Teams, Leagues, Legacy Coach, Rulebook filtering and generated Points Guide data.

## Firestore Security Rules

```powershell
npm run test:rules
```

v0.13.1 target: **15 passing tests**. The Rulebook and Points Guide are bundled read-only references and add no Firestore permissions.

Permission-denied output is expected for `assertFails` cases.

## Full verification

```powershell
npm run check
npm run test:rules
npm run check:release
npm audit
```

- `check` runs ESLint, domain tests and production build.
- `check:release` verifies the version, announcement and branded Hosting target.
- Do not run `npm audit fix --force`.

## Reference-page manual tests

- Search and filter Rulebook rules by text and legacy number.
- Verify accordion keyboard behaviour, jump navigation and empty states.
- Compare displayed goals with Dashboard/Progress.
- Compare every Points Guide range with the scoring engine.
- Test direct-route refreshes and 320-pixel layouts.

## Defect rule

Reproduce, add regression coverage where practical, apply the smallest maintainable fix, run focused tests, run complete checks and update documentation.
