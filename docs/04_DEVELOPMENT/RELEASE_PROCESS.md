# Champions Legacy Challenge — Release Process

Last updated: 1 August 2026

## Standard sequence

1. Confirm product rules and release scope.
2. Implement in small, reviewable changes.
3. Run domain tests.
4. Run ESLint.
5. Run the production build.
6. Run Firestore Emulator Security Rules tests for rule changes.
7. Update documentation.
8. Review `npm audit` without forcing breaking changes.
9. Deploy Firestore Rules to development.
10. Deploy a temporary Hosting preview channel.
11. Complete manual QA.
12. Fix verified defects and add regression coverage.
13. Obtain explicit release approval.
14. Deploy the approved environment.
15. Commit and tag the release.

## Commands

```powershell
npm run check
npm run test:rules
npm run check:release
npm audit
npm run deploy:rules
npm run deploy:preview
```

## Pre-1.0 boundary

v0.16.0 is a pre-review refinement release, not v1.0. Do not create a v1.0 tag until the user explicitly approves the final visual, gameplay and operational scope.

## Rule changes

Security Rules changes are incomplete until:

- emulator tests pass;
- rules compile through the Firebase CLI;
- the target Firebase project is confirmed;
- rules are deployed;
- live workflows are tested with normal-player and administrator accounts.

## Rollback preparation

Before deployment:

- preserve the previous Git tag;
- confirm Hosting release history is available;
- keep factual data migrations separate from frontend deployment;
- avoid destructive cleanup of player data.
