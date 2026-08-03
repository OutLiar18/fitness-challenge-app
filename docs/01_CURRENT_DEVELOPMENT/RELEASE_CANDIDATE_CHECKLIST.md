# Champions Legacy Challenge — Release Checklist

Version: 0.16.0  
Status: Automated verification and production Hosting deployment complete; documentation sync and Git commit pending

## Packaging gates

- [x] ESLint passed without warnings.
- [x] 68 domain tests passed.
- [x] JSX/JavaScript syntax parsing passed.
- [x] Static import/reference audit found no unresolved or unreferenced source files.
- [x] No scoring, Firestore collection or Security Rule changes were introduced.

## Authoritative Windows gates

- [x] `npm install` completed.
- [x] `npm run check` passed lint, 68 domain tests and production build.
- [x] `npm run test:rules` passed all 25 Rules tests using Java 21.
- [x] `npm run check:release` confirmed v0.16.0 and Hosting target `app`.
- [x] `npm audit` was reviewed without `npm audit fix --force`.

## Deployment

- [x] Production Hosting deployed to the branded `app` target.
- [x] 60 frontend files released successfully.
- [x] Firestore Rules correctly left unchanged.
- [ ] Deployment documentation synchronised.
- [ ] v0.16.0 committed with a clean working tree.

## Deferred manual matrix

- [ ] Desktop tabs and mobile section selectors across all refined pages.
- [ ] Arrow-key, Home/End and visible-focus operation.
- [ ] Empty/populated states, dark mode and reduced motion.
- [ ] C.H.A.O.S. management discoverability and phase-dependent Pocket tabs.
- [ ] Full responsive and accessibility review.

These checks remain intentionally deferred until the final pre-v1.0 review by product-owner decision.

## Release boundary

- [x] No inactive competition mechanic was invented or activated.
- [x] No `.env`, credentials, `node_modules`, `dist`, `.git`, `.firebase` or debug logs belong in handover packages.
- [x] No v1.0 tag or declaration is permitted.
