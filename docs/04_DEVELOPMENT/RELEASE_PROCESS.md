# Champions Legacy Challenge — Release Process

Last updated: 4 August 2026

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
10. Deploy a temporary Hosting preview channel when the product owner requests preview review.
11. Complete the release-appropriate manual QA; the full integrated matrix remains mandatory before v1.0.
12. Fix verified defects and add regression coverage.
13. Obtain explicit deployment approval.
14. Deploy the exact verified candidate. Rule-changing releases use `npm run deploy:production`.
15. Synchronise deployment documentation and commit. Do not create a v1.0 tag without explicit approval.

## Commands

```powershell
npm run check
npm run test:rules
npm run check:release
npm audit
npm run deploy:preview
npm run deploy:production
```

## Pre-1.0 boundary

v0.17.0 is a pre-v1.0 candidate, not v1.0. Do not create a v1.0 tag until the user explicitly approves the final visual, gameplay and operational scope.

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
