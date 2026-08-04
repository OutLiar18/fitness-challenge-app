# Champions Legacy Challenge — Release Checklist

Version: 0.17.0  
Status: Automated verification and production deployment complete; documentation sync and release commit pending

## Packaging gates

- [x] 71 domain tests passed.
- [x] ESLint passed without warnings on Windows.
- [x] Vite production build passed on Windows.
- [x] Static import/reference audit found no unresolved or unreferenced source files.
- [x] Scoring, Experience Points and season-history logic remain unchanged.

## Firestore and security

- [x] New profile onboarding fields are constrained.
- [x] Account request ownership and lifecycle are constrained.
- [x] Administrator acknowledgement requires an audit event.
- [x] Own private votes and own sanitised error reports are export-readable.
- [x] 30 Firestore Rules tests passed using Java 21.

## Windows release gates

- [x] `npm install` completed.
- [x] `npm run check` passed.
- [x] `npm run test:rules` passed.
- [x] `npm run check:release` confirmed v0.17.0 and Hosting target `app`.
- [x] `npm audit` reviewed without `npm audit fix --force`.

## Deployment

- [x] Firestore Rules deployed.
- [x] Production Hosting deployed.
- [ ] Deployment documentation synchronised.
- [ ] v0.17.0 committed with a clean working tree.
- [x] No v1.0 tag created.
