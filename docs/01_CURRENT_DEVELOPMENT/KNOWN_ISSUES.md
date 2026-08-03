# Champions Legacy Challenge — Known Issues

Last updated: 3 August 2026

## v0.15.0 verification status

The release passed the authoritative Windows gates: 66 domain tests, 25 Firestore Rules tests, clean ESLint, successful Vite production build and release-readiness for Hosting target `app`. The frontend is deployed to production.

## Deferred integrated review

The product owner has deferred the complete functional, responsive, keyboard, visual, dark-mode and accessibility review until the final pre-v1.0 stage. Production therefore has strong automated coverage but has not received the full manual review matrix.

## Performance warning

The production build reports a Firebase vendor chunk above the 500 kB warning threshold. The compressed size is substantially smaller and the warning does not block deployment. Treat route/vendor chunk optimisation as measured later work rather than suppressing the warning without evidence.

## Operational boundaries

- Ballots require authorised manual opening and administrator finalisation; there is no server scheduler.
- Invitation codes are bearer codes, not passwords.
- Firestore Rules validate ownership, shape and atomic relationships but do not independently run the full Points Engine.
- Prize-bearing competition requires trusted server-side contribution recalculation.
- Personal activity history is not yet paginated.

## Inactive mechanics

Power Plays, Diamonds, player prices, House Immunity, the full Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive. The current roster mechanism is one balanced one-for-one swap per participating House per week. Pocket Week is one pre-season window.

## Dependency advisory

`npm audit` reports two high-severity advisories in React Router's React Server Components mode. Champions Legacy Challenge is a client-rendered Vite application and does not use RSC mode. Do not run `npm audit fix --force`; the suggested package change is breaking. Reassess when an upstream non-breaking compatible fix is available.
