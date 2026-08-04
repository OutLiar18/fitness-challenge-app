# v0.20.0 Release Candidate Checklist

<!-- RELEASE_STATUS: DEPLOYED -->

## Source and structure

- [x] Package version is 0.20.0.
- [x] Audited entry correction model, service and administrator workspace are present.
- [x] Active-history resolution and Journal recorded-day pagination are present.
- [x] Personal export schema includes correction records.
- [x] ADR-027 and canonical correction documentation are included.
- [x] Updater contains source, tests, Rules, documentation and finaliser in one package.

## Packaging verification

- [x] 96 domain tests pass in the packaging environment.
- [x] JavaScript syntax checks pass.
- [x] Local source imports resolve.
- [x] No source module or stylesheet is left unreferenced.
- [x] Package excludes `.env`, `.git`, `node_modules`, `dist`, `.firebase` and logs.

## Authoritative Windows release gates

- [x] `npm install` completes.
- [x] ESLint passes without warnings.
- [x] 96 domain tests pass on Windows.
- [x] Vite production build passes.
- [x] 44 Firestore Security Rules tests pass using Java 21.
- [x] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions.
- [x] `npm run check:release` confirms v0.20.0 and Hosting target `app`.
- [x] `npm audit` reviewed; no forced breaking fix applied.

## Deployment and finalisation

- [x] Firestore Rules and Hosting deploy with `npm run deploy:production`.
- [x] Branded Hosting target releases successfully.
- [x] Included `FINALISE_RELEASE.ps1` updates candidate documentation.
- [ ] Finalised source is committed without a v1.0 tag.
