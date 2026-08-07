# v0.23.5 Stability Release Candidate Checklist

<!-- RELEASE_STATUS: DEPLOYED -->

- [ ] `npm install` completes.
- [ ] ESLint passes.
- [ ] 120 domain tests pass.
- [ ] Vite production build passes.
- [ ] 51 Firestore Rules tests pass.
- [ ] `firestore.rules` matches the verified v0.23 baseline hash.
- [ ] The v0.24 House Movement files and Rules markers are absent.
- [ ] `npm run check:release` confirms v0.23.5 and Hosting target `app`.
- [ ] `npm run deploy:production` deploys Rules first, then Hosting.
- [ ] Production site is manually smoke-tested before finalisation.

---

# v0.23.0 Release Candidate Checklist

<!-- RELEASE_STATUS: DEPLOYED -->

## Automated gates

- [x] `npm install` completes.
- [x] ESLint passes without warnings.
- [x] 120 domain tests pass on Windows.
- [x] Vite production build passes.
- [x] 51 Firestore Security Rules tests pass using Java 21.
- [x] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions.
- [x] `npm run check:release` confirms v0.23.0 and Hosting target `app`.
- [x] `npm audit` reviewed; no automatic or forced breaking fix applied.

## Power Play checks

- [ ] A draft v3 season contains ten base category Power Plays.
- [ ] Theme names can be edited and must be confirmed and unique.
- [ ] Custom plays support only 2×/3× and one or more valid categories.
- [ ] Registration is blocked when the enabled no-repeat pool cannot cover every official week.
- [ ] A selected play is never eligible again, including after a redraw or locked correction.
- [ ] Players cannot see a future week's selection before the official start.
- [ ] Activity points multiply by activity week; evidence/goal/progression bonuses do not.
- [ ] Individual, House and honours calculations use the same adjusted contribution.
- [ ] Trusted reconciliation blocks duplicate or definition-mismatched assignments.

## Deployment and finalisation

- [x] Firestore Rules and Hosting deploy with `npm run deploy:production`.
- [x] Branded Hosting target releases successfully.
- [x] Included `FINALISE_RELEASE.ps1` updates candidate documentation.
- [ ] Release is committed without a v1.0 tag.
