# v0.21.0 Release Candidate Checklist

<!-- RELEASE_STATUS: DEPLOYED -->

## Source and structure

- [x] Package version is 0.21.0.
- [x] Trusted season model and local Admin SDK command are present.
- [x] Season Command Centre trusted status is present.
- [x] `seasonTrustedRuns` client write denial is present.
- [x] Canonical documentation, operating guide and ADR-028 are included.
- [x] Updater contains source, tests, Rules, documentation and finaliser in one package.

## Packaging verification

- [x] 104 domain tests pass.
- [x] JavaScript syntax checks pass.
- [x] Local source imports resolve.
- [x] Rules delimiter checks pass.
- [x] Package excludes credentials, reports, `.env`, `.git`, `node_modules`, `dist`, `.firebase` and logs.

## Authoritative Windows release gates

- [x] `npm install` completes and refreshes the lockfile.
- [x] ESLint passes without warnings.
- [x] 104 domain tests pass on Windows.
- [x] Vite production build passes.
- [x] 46 Firestore Security Rules tests pass using Java 21.
- [x] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions.
- [x] `npm run check:release` confirms v0.21.0 and Hosting target `app`.
- [x] `npm audit` reviewed; no forced breaking fix applied.

## Deployment and finalisation

- [x] Firestore Rules and Hosting deploy with `npm run deploy:production`.
- [x] Branded Hosting target releases successfully.
- [x] Included `FINALISE_RELEASE.ps1` updates candidate documentation.
- [ ] Finalised source is committed without a v1.0 tag.
