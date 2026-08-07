# Champions Legacy Challenge — Known Issues

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 5 August 2026

## v0.23.0 Power Play boundaries

- Weekly selection is administrator-driven; there is no background scheduler.
- Player listeners attach only to official weeks that have started when the Seasons page loads. Refresh at a week boundary to reveal the new week immediately.
- Existing v1/v2 seasons intentionally remain Power Play-disabled.
- A season must have at least as many enabled, unique, theme-confirmed plays as official weeks before registration opens.
- A wrongly selected locked assignment needs an audited Platform Administrator correction; the replacement must also be unused.

## Dependency advisories

`npm audit` currently reports eight advisories: six moderate and two high. The React Router advisory concerns RSC Mode, which this Vite SPA does not use. The UUID advisory is transitive through Firebase Admin dependencies. The suggested forced fixes are breaking downgrades. Do not run either automatic audit-fix command during this release.

## Build and Rules output

- The Firebase vendor chunk may exceed 500 kB after minification. This is a non-blocking optimisation item.
- Firestore Rules may report the existing unused `entryId` warning. It is non-blocking and scheduled for the hardening release.
- Expected emulator `PERMISSION_DENIED` logs are negative security assertions, not failures when the tests pass.

## Trusted operations

- Season reconciliation and account deletion require the private Admin SDK key outside the repository.
- Local reports must remain outside the repository.
- No Cloud Functions, paid plan or automatic trusted scheduler is used.

## Deferred final review

Full manual cross-device, keyboard, screen-reader, dark-mode, visual and accessibility review remains scheduled for the final pre-v1.0 polish iteration.


## v0.23.5 stabilization note

The attempted v0.24 House Movement / weekly-balance Rules expansion can exceed Firestore's per-request expression evaluation budget on legitimate maximum-scale writes. It is intentionally excluded from v0.23.5. Do not copy `houseMovementModel.js`, `houseMovementService.js`, `tests/house-movement.test.mjs`, `season-houses-v4` constants or v0.24 Rules blocks into the stabilization branch.
