# Champions Legacy Challenge — Release Candidate Checklist

<!-- RELEASE_STATUS: DEPLOYED -->
Version: 0.19.0  
Production before release: 0.18.0

## Source and domain

- [x] Package version is 0.19.0.
- [x] Command centre is limited to eligible v2 season operators.
- [x] Operational guidance is derived from existing immutable records.
- [x] Category reviewer visibility remains scoped.
- [x] Evidence decision and snapshot history remain read-only.
- [x] Downloaded reports contain no WhatsApp media.
- [x] No scoring rule, Firestore collection or Security Rule changed.
- [x] 85 domain tests pass in the packaging environment.

## Windows release gates

- [x] `npm install` completes.
- [x] ESLint passes without warnings.
- [x] 85 domain tests pass on Windows.
- [x] Vite production build passes.
- [x] 39 Firestore Security Rules tests pass using Java 21.
- [x] Expected negative `PERMISSION_DENIED` logs are confirmed as passing assertions.
- [x] `npm run check:release` confirms v0.19.0 and Hosting target `app`.
- [x] `npm audit` reviewed; no forced breaking fix applied.

## Deployment

- [x] Hosting deploys with `npm run deploy:hosting`.
- [x] Branded Hosting target releases successfully.
- [x] Included `FINALISE_RELEASE.ps1` updates candidate documentation.
- [ ] v0.19.0 is committed with a clean working tree.

## Boundaries

- [x] No media-upload feature added.
- [x] No true scheduler claimed where none exists.
- [x] No direct point editing or silent history rewrite added.
- [x] No undefined competition mechanic activated.
- [x] No v1.0 tag or declaration.
