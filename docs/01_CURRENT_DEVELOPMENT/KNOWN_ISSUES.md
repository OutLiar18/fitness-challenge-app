# Champions Legacy Challenge — Known Issues

Last updated: 3 August 2026

## v0.14.0 deployment status

All technical release gates pass: clean ESLint, 61 domain tests, 25 Firestore Rules tests, production build and release-readiness for Hosting target `app`.

Legacy competition test data was inspected and removed. Firestore Rules compile without warnings and are live. The v0.14.0 frontend is live on the branded Hosting site. A production smoke test confirmed season and House creation.

The full integrated visual, responsive and accessibility review is deferred until the final pre-v1.0 review stage.

## C.H.A.O.S. discoverability

The C.H.A.O.S. console currently appears only when a season has moved from Draft to Registration. This is correct for activation authority but can make the feature seem missing during Draft.

Activation requirements remain:

- the season is in Registration;
- every configured House has been created;
- C.H.A.O.S. has not already run;
- the season has at least two registered players per House in total.

Houses do not need existing assigned members. C.H.A.O.S. creates the opening assignments.

## Season mechanics still awaiting decisions

- Power Play voting and category multipliers are inactive.
- Diamonds, player prices, House Immunity and the full Transfer Market are inactive.
- Buddy Bonuses and Five Fires are inactive.
- Late-season twists have not been defined.
- The current weekly roster mechanism is one balanced one-for-one swap involving each participating House at most once that week.
- Pocket Week is confirmed as one seven-day reserve window immediately before the season and is not recurring.

## Operational boundaries

- Ballots are not opened or finalised by a server scheduler. A current House leader or administrator opens the 24-hour ballot; an administrator finalises it after closure.
- Invitation codes are bearer codes, not passwords.
- Evidence uploads and administrator adjudication are not implemented.
- Firestore Rules protect shape, ownership and atomic relationships but do not independently recalculate the complete activity Points Engine.
- Prize-bearing competition requires trusted server-side contribution recalculation.

## Data and scale

- v0.14 supports no more than 160 participants per season.
- C.H.A.O.S. requires at least two registered players per House.
- Existing pre-v0.14 permanent-Team data is not auto-converted.
- PlayerDataProvider still subscribes to the player’s complete activity history.
- Administrative search covers loaded pages rather than the entire database.

## Product lifecycle gaps

Account deletion, personal-data export, privacy/support content, first-use onboarding, server alerts and final performance/accessibility review remain before v1.0.

## Dependency advisory

A React Router advisory may remain in `npm audit`. Do not run `npm audit fix --force`; the suggested change may be breaking and the affected React Server Components mode is not used by this Vite client application.
