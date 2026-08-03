# Champions Legacy Challenge — Known Issues

Last updated: 3 August 2026

## v0.16.0 release status

Automated Windows release verification and Firebase Hosting deployment succeeded. Clean ESLint, 68 domain tests, the Vite production build, 25 Firestore Rules tests and release-readiness all passed. The full manual integrated review remains deferred.

## Deferred integrated review

The product owner has deferred the complete functional, responsive, visual, dark-mode and accessibility review until the final pre-v1.0 stage. The new workspace pattern is designed for accessibility and small screens but has not yet received the final manual matrix.

## Performance warning

The production build reports a Firebase vendor chunk of approximately 575.67 kB minified and 169.22 kB gzip, above Vite's 500 kB warning threshold. The warning does not block deployment. Treat route/vendor chunk optimisation as measured later work rather than suppressing the warning without evidence.

## Operational boundaries

- Ballots require authorised manual opening and administrator finalisation; there is no server scheduler.
- Invitation codes are bearer codes, not passwords.
- Firestore Rules validate ownership, shape and atomic relationships but do not independently run the full Points Engine.
- Prize-bearing competition requires trusted server-side contribution recalculation.
- Personal activity history is not yet paginated.

## Inactive mechanics

Power Plays, Diamonds, player prices, House Immunity, the full Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive. The current roster mechanism is one balanced one-for-one swap per participating House per week. Pocket Week is one pre-season window.

## Dependency advisory

`npm audit` reports two high-severity advisories in React Router's React Server Components mode. Champions Legacy Challenge is a client-rendered Vite application and does not use React Server Components mode. The available forced action would install a breaking dependency version. Do not run `npm audit fix --force`; reassess when an upstream non-breaking compatible fix is available.
