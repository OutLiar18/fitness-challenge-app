# Champions Legacy Challenge — Release Candidate Checklist

Version: 0.15.0  
Status: Automated gates passed and production deployed; manual integrated review deferred

## Automated gates

- [x] `npm install` completes on Windows.
- [x] `npm run check` passes clean ESLint, 66 domain tests and production build.
- [x] `npm run test:rules` passes all 25 Rules tests using Java 21.
- [x] `npm run check:release` confirms v0.15.0 and Hosting target `app`.
- [x] `npm audit` was reviewed without `npm audit fix --force`.

## Focused regression

The following manual checks remain intentionally deferred until the final pre-v1.0 review:

- [ ] Direct refresh on `/seasons`, `/houses`, `/pocket`, `/inbox`, `/analytics`, `/rules` and `/points-guide`.
- [ ] Legacy route redirects preserve the selected season and private Inbox tab.
- [ ] Desktop has no duplicate Profile destination.
- [ ] Inbox unread badge equals public plus private unread counts.
- [ ] Analytics handles empty and populated histories without altering Points or Experience Points.
- [ ] C.H.A.O.S. checklist accurately reports status, House count, registered players and previous activation.
- [ ] Responsive, keyboard, visual, dark-mode and accessibility review.

## Release boundary

- [x] No inactive competition mechanic was invented or activated.
- [x] Documentation and release notes match the deployed implementation after this sync.
- [x] No `.env`, credentials, `node_modules`, `dist`, `.git`, `.firebase` or debug logs entered the handover packages.
- [x] No v1.0 tag or declaration was created.
- [x] Production Hosting deployed to the branded `app` target.

## Open release risk

Production deployment proceeded without the deferred manual smoke test by explicit product-owner choice. Automated coverage is strong, but visual and interaction defects may remain until the final integrated review.
