# v0.24.0 Production Release Checklist

<!-- RELEASE_STATUS: DEPLOYED -->
Date completed: 9 August 2026

## Frozen source

- [x] `package.json` version is `0.24.0`.
- [x] Deployed source commit is `b5e7c083c0ba7730f21b8a92b30530f3ebb8374c`.
- [x] Final Rules SHA-256 is `2ab1e569f4699e0018f3c5b7e5225a9fb42d65b835215fc9b8917ab21c701573`.
- [x] Final Rules size is 3,501 lines / 160,395 bytes.
- [x] Final release-readiness verifier and 79-test Rules suite are pinned.

## Automated release gates

- [x] ESLint passes.
- [x] 131/131 domain tests pass.
- [x] Vite production build passes.
- [x] 79/79 Firestore Security Rules tests pass.
- [x] Final full Rules suite is evaluator-clean for the 1,000-expression limit.
- [x] `npm run check:release` passes.
- [x] Firebase production mapping verifies project `fitnesschallengeapp-9e87f`, Hosting target `app` and site `champions-legacy-challenge`.

## Production activation

- [x] 9A performed exactly one Firestore Rules-only deployment attempt.
- [x] Firebase compiled and released the frozen Rules successfully.
- [x] Active remote Rules source matches the frozen local source byte-for-byte.
- [x] Runtime executable points to the same active Ruleset.
- [x] 9B performed exactly one Hosting-only deployment attempt.
- [x] Live index and all referenced assets match the verified local build byte-for-byte.
- [x] SPA fallback and configured Hosting headers pass live verification.

## Production smoke

- [x] Dashboard, Activity Log, Houses/Seasons and Profile load normally.
- [x] Sign-out/sign-in succeeds.
- [x] A reversible profile display-name write persists through refresh.
- [x] The original profile display name is restored and persists through refresh.
- [x] No fake challenge activity was created for the smoke test.

## Finalisation

- [x] Detailed release evidence recorded in `docs/07_HISTORY/V0240_PRODUCTION_RELEASE.md`.
- [x] Documentation finalisation commit created.
- [x] Annotated `v0.24.0` tag targets the exact deployed commit.
- [x] Checkpoint 9D verifies the remote branch and tag before declaring success.

Checkpoint 9D contains no Firebase deployment operation. Its success banner is the authoritative confirmation that the final remote Git state was verified.
