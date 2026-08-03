# Release Candidate Checklist

Version: 0.14.0  
Status: Deployed pre-v1.0; final integrated review deferred

## Automated verification

- [x] `npm install`
- [x] `npm run check` passes with 61 domain tests and no ESLint warnings.
- [x] `npm run test:rules` passes all 25 Rules tests.
- [x] `npm run check:release` confirms v0.14.0 and Hosting target `app`.
- [x] `npm audit` reviewed without `--force`.

## Data and deployment

- [x] Legacy competition collections inspected according to `ACTIVE_MIGRATIONS.md`.
- [x] Disposable retired Team and dummy league records removed.
- [x] Firestore Rules deployed successfully without compiler warnings.
- [x] Firebase Hosting preview deployed to branded target.
- [x] Production Hosting deployed to the branded live URL.
- [ ] Direct refresh reviewed on `/leagues`, `/teams`, `/pocket`, `/notifications`, `/rules` and `/points-guide`.

## Season workflow

- [x] Create a themed season and exact House count.
- [ ] Open registration and join with a code.
- [ ] C.H.A.O.S. remains disabled until at least two players per House are registered.
- [ ] C.H.A.O.S. assigns everyone once and creates private notifications.
- [ ] Ballot opens for 24 hours and each House member votes once.
- [ ] Administrator finalises clear, tied and no-vote outcomes correctly.
- [ ] Captain appoints one additional Vice-Captain.
- [ ] Weekly balanced swap locks both Houses and preserves earlier contributions.
- [ ] Pocket deposits earn zero points and valid redemption creates the scored entry once.
- [ ] Individual and House standings are correct before and after a player moves.

## Responsive and accessible review

Deferred by product-owner direction until the final pre-v1.0 review:

- [ ] Mobile 320–430 pixels.
- [ ] Tablet portrait and landscape.
- [ ] Desktop 1280 and 1920 pixels.
- [ ] Keyboard focus, labels, dialogs, error states and reduced-motion behaviour.
- [ ] Light and dark mode.

Do not tag v1.0 from this checklist.
