# Champions Legacy Challenge — Release Candidate Checklist

<!-- RELEASE_STATUS: DEPLOYED -->
Version: 0.18.0  
Production before release: 0.17.0

## Source and domain

- [x] Package version is 0.18.0.
- [x] External evidence media is not uploaded or stored.
- [x] Season v2 evidence policy requires explicit confirmation.
- [x] Verification IDs are stable and human-readable.
- [x] Running Cardio remains immediate while qualifying Running points wait for proof.
- [x] Steps points wait for proof.
- [x] Water and Fruit bonus rules and Fruit five-serving cap are implemented.
- [x] Category reviewer scope and Platform Administrator override are implemented.
- [x] Published player snapshots and live administrator standings are separate.
- [x] 80 domain tests pass in the packaging environment.

## Windows release gates

- [x] `npm install` completes.
- [x] ESLint passes without warnings.
- [x] 80 domain tests pass on Windows.
- [x] Vite production build passes.
- [x] 39 Firestore Security Rules tests pass using Java 21.
- [x] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions.
- [x] `npm run check:release` confirms v0.18.0 and Hosting target `app`.
- [x] `npm audit` reviewed; no forced breaking fix applied.

## Deployment

- [x] Firestore Rules compile successfully.
- [x] Rules and Hosting deploy together with `npm run deploy:production`.
- [x] Branded Hosting target releases successfully.
- [x] Included `FINALISE_RELEASE.ps1` updates candidate documentation.
- [ ] v0.18.0 committed with a clean working tree (complete after the next Git commit).

## Boundaries

- [x] No media-upload feature added.
- [x] No true scheduler claimed where none exists.
- [x] No undefined competition mechanic activated.
- [x] No v1.0 tag or declaration.
