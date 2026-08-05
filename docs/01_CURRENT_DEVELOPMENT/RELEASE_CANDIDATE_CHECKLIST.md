# v0.22.0 Release Candidate Checklist

<!-- RELEASE_STATUS: DEPLOYED -->

## Installation and automated gates

- [x] `npm install` completes.
- [x] ESLint passes without warnings.
- [x] 108 domain tests pass on Windows.
- [x] Vite production build passes.
- [x] 47 Firestore Security Rules tests pass using Java 21.
- [x] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions.
- [x] `npm run check:release` confirms v0.22.0 and Hosting target `app`.
- [x] `npm audit` reviewed; no automatic or forced breaking fix applied.

## Product and safety checks

- [ ] New requests store request version 2, policy version and seven-day defaults.
- [ ] Players may cancel requested or acknowledged requests only.
- [ ] Administration displays timing, processing, failed and completed states.
- [ ] Dry audit changes no Firebase data.
- [ ] Trusted processing is blocked before eligibility and for the final Platform Administrator.
- [ ] Credentials and local reports remain outside the repository and archives.
- [ ] Shared history keeps points while replacing identity.

## Deployment and finalisation

- [x] Firestore Rules and Hosting deploy with `npm run deploy:production`.
- [x] Branded Hosting target releases successfully.
- [x] Included `FINALISE_RELEASE.ps1` updates candidate documentation.
- [ ] Release is committed without creating a v1.0 tag.
