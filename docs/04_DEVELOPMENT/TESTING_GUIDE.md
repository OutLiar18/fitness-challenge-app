# Champions Legacy Challenge — Testing Guide

Current release target: v0.17.0

## Standard release commands

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
```

`npm run check` runs ESLint, all domain tests and the Vite production build. The Firestore Emulator requires Java 21.

## v0.17.0 expected baseline

- 71 domain tests.
- 30 Firestore Security Rules tests.
- Clean ESLint.
- Successful Vite production build.
- Release-readiness confirmed for version 0.17.0 and Hosting target `app`.

Expected negative `PERMISSION_DENIED` emulator output is normal when a test asserts that an unauthorised write fails. The final test summary must still report zero failures.

## Required account-foundation coverage

- New profiles begin at onboarding version `0`.
- Legacy profiles without onboarding fields are not forced into the guide.
- Completion and replay cannot alter trusted role fields.
- Deletion request create, cancel and reopen are owner-only.
- Administrator acknowledgement requires a matching audit event.
- Personal export serialises timestamps and records unavailable sections.
- Players can read/query only their own private votes and sanitised error reports.

## Release rules

Do not deploy when lint, domain tests, Rules tests, build or release-readiness fails. Do not run `npm audit fix --force`; review advisories and upgrade only through a deliberate compatible change.
