# Champions Legacy Challenge — Known Issues

Last updated: 4 August 2026

## v0.17.0 release status

Automated Windows release verification and production deployment succeeded. Clean ESLint, 71 domain tests, the Vite production build, 30 Firestore Rules tests and release-readiness all passed. Firestore Rules compiled and deployed successfully, and Firebase Hosting released 62 frontend files. The full manual integrated review remains deferred.

## Deferred integrated review

The product owner has deferred the complete functional, responsive, visual, dark-mode and accessibility review until the final pre-v1.0 stage. New onboarding and account tools are designed around existing accessible patterns but still require that final manual matrix.

## Account deletion boundary

The app records and acknowledges deletion requests but does not automatically delete Firebase Authentication or every eligible record. A trusted server/Admin SDK worker, operational completion record and shared-history anonymisation policy remain required before public launch.

## Privacy and support readiness

Help & Privacy is plain-language product guidance, not final legal text. A confirmed public support contact and formal legal/privacy review remain required.

## Performance warning

The production build reports a Firebase vendor chunk of approximately 575.67 kB minified and 169.22 kB gzip, above Vite's 500 kB warning threshold. The warning does not block deployment. Treat optimisation as measured work rather than suppressing the warning without evidence.

## Operational boundaries

- Ballots require authorised manual opening and administrator finalisation; there is no server scheduler.
- Invitation codes are bearer codes, not passwords.
- Firestore Rules validate ownership, shape and atomic relationships but do not run the full Points Engine.
- Prize-bearing competition requires trusted server-side contribution recalculation.
- Personal activity history is not yet paginated.

## Inactive mechanics

Power Plays, Diamonds, player prices, House Immunity, the full Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive. Pocket Week remains one pre-season window.

## Dependency advisory

`npm audit` reports two high-severity advisories in React Router's React Server Components mode. This is a client-rendered Vite application and does not use that mode. Do not run `npm audit fix --force`; reassess when a non-breaking compatible fix is available.
