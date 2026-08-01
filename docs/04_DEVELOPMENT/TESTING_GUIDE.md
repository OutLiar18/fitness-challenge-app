# Champions Legacy Challenge — Testing Guide

Last updated: 1 August 2026

## Domain tests

```powershell
npm test
```

v0.11.0 target: **44 passing tests**.

Coverage includes existing scoring, goals, progression, navigation, profiles, announcements and administration plus:

- team invitation normalization and identity validation;
- weekly team snapshots using factual entry points;
- forward-only league lifecycle;
- frozen league rules;
- consistency standings with daily cap and participation bonus;
- Legacy Coach evidence, preferences and optional state.

## Firestore Security Rules tests

```powershell
npm run test:rules
```

v0.11.0 target: **12 passing tests**.

Coverage includes the previous seven tests plus:

- atomic team creation/joining, self-promotion denial and captain transfer;
- owner-private Legacy Coach preferences;
- authorised and audited league Draft creation;
- forward-only audited league lifecycle;
- entry-linked active league contribution integrity.

Expected permission-denied logs are normal for `assertFails` cases.

## Full checks

```powershell
npm run check
npm run check:release
npm audit
```

- `check` runs ESLint, domain tests and production build.
- `check:release` additionally runs Rules tests and release-structure verification.
- Do not run `npm audit fix --force`.

## Defect rule

Reproduce, add regression coverage where practical, apply the smallest maintainable fix, run focused tests, run complete checks and update documentation.
