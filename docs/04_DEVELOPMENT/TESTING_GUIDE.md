# Champions Legacy Challenge — Testing Guide

<!-- RELEASE_STATUS: DEPLOYED -->
Current release target: v0.23.0

## Authoritative release commands

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

## v0.23.0 expected baseline

- 120 domain tests.
- 51 Firestore Security Rules tests.
- Clean ESLint.
- Successful Vite production build.
- Release-readiness confirmed for v0.23.0 and Hosting target `app`.

Expected negative `PERMISSION_DENIED` emulator logs are passing security assertions. Do not run either audit-fix command.

## Power Play domain coverage

- ten base categories;
- theme confirmation and unique names;
- enough unused definitions for every week;
- full final-calendar-day timing;
- deterministic selection from the supplied pool;
- activity-only multiplier exclusions;
- Running/Cardio score-category separation;
- identical individual/House calculations;
- honours integration;
- trusted duplicate and state-mismatch blocking;
- Command Centre readiness and missing-week actions.

## Power Play Rules coverage

- valid audited draft-pool updates;
- unique frozen definition enforcement;
- authorised weekly selection and player started-week visibility;
- future assignment privacy;
- no-repeat used-state enforcement;
- locked assignment immutability and Platform Administrator correction;
- all client writes to trusted-run records remain denied.
