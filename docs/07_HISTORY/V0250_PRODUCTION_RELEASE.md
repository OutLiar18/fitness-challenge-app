# Champions Legacy Challenge — v0.25.0 Production Release Evidence

Date: 10 August 2026
Status: Verified production release
Firebase project: `fitnesschallengeapp-9e87f`
Hosting site: `champions-legacy-challenge`

## Release source

- Branch at deployment: `development/v0.25.0`.
- Exact deployed application source: `1e11f5ff8ca5af7e9d758f62b9d377e1c6ddd94d`.
- Frozen 25A–25D application/Rules baseline: `0f5b715e4888d12ddc53ede334a9cfe13c5e2048`.
- Package version: `0.25.0`.
- Release tag: `v0.25.0` points to the exact deployed application source above.
- The later documentation-only finalisation commit is intentionally not the deployed-code tag target.

## Final automated gate

Checkpoint 25R refreshed and froze the v0.25 release-readiness contract. Before production activation:

- 148/148 application tests passed;
- 94/94 Firestore Security Rules tests passed;
- zero failed/cancelled/skipped Rules tests;
- the Vite production build succeeded;
- Firebase project / Hosting target mapping was verified;
- development-repository production deploy scripts remained blocked.

Expected emulator `PERMISSION_DENIED` logs represented negative security assertions and were accepted only because every corresponding Rules test passed.

The production build continued to report the known non-blocking Firebase vendor chunk-size warning at approximately 575.67 kB. Performance/code splitting remains scheduled for v0.27.0.

## Firestore Rules production activation

Scope: Cloud Firestore Security Rules only. Hosting was not deployed in this stage.

Immediately before activation:

- the frozen release source was verified at `1e11f5ff8ca5af7e9d758f62b9d377e1c6ddd94d`;
- canonical local Rules SHA-256 was verified as `17217b471feb4f7e2db3df72b9456cc64e1451eb2c529228490b6ef8e47f376e`;
- all 94 Firestore Rules emulator tests passed again;
- Firebase CLI version was `15.26.0`.

Firebase compiled, uploaded and released `firestore.rules` successfully.

Read-only remote verification then confirmed:

- active Release: `projects/fitnesschallengeapp-9e87f/releases/cloud.firestore`;
- active Ruleset: `projects/fitnesschallengeapp-9e87f/rulesets/9e476b71-9b9b-4b05-bedd-5bc3b1932d2d`;
- Release update time: `2026-08-10T11:37:07.255032Z`;
- Ruleset create time: `2026-08-10T11:37:02.826591Z`;
- active Rules SHA-256: `17217b471feb4f7e2db3df72b9456cc64e1451eb2c529228490b6ef8e47f376e`;
- active and local Rules source hashes matched exactly.

The remote verifier performed read-only API requests and made no Firebase writes.

## Firebase Hosting production activation

Scope: Hosting target `app` only. Firestore Rules were not redeployed in this stage.

The activation runner verified the frozen source and Rules hash, created a fresh production build, confirmed Firebase CLI `15.26.0`, then deployed only `hosting:app`.

Hosting result:

- 66 files in `dist`;
- target `app`;
- site `champions-legacy-challenge`;
- live URL `https://champions-legacy-challenge.web.app`;
- Firebase reported the new Hosting version finalized and released successfully.

## Automated production smoke

The read-only smoke test confirmed:

- live `index.html` exactly matched the frozen local build;
- local/live `index.html` SHA-256: `e40e19fbf102ab066a4394604d8c108f437d85032e8aafbb8be5d0f75c06571a`;
- 16 assets referenced by the production index matched the corresponding frozen local build bytes;
- 10/10 critical SPA routes returned the deployed application shell:
  - `/login`;
  - `/signup`;
  - `/dashboard`;
  - `/log-activity`;
  - `/seasons`;
  - `/houses`;
  - `/profile`;
  - `/inbox`;
  - `/rulebook`;
  - `/points-guide`.

The smoke test made no Firebase writes and no Git changes.

## Logged-in manual production smoke

Manual production review on 10 August 2026 found the deployed v0.25 experience operating normally, including the core logged-in navigation and newly introduced v0.25 surfaces. No unnecessary activity, bonus-point or competition-history test data was created.

## Release conclusion

v0.25.0 is operational and verified in production. The frontend is tied to deployed source commit `1e11f5ff8ca5af7e9d758f62b9d377e1c6ddd94d`, and the active Cloud Firestore Rules source is hash-matched to the frozen v0.25 candidate. This finalisation checkpoint changes documentation/Git release state only and performs no Firebase deployment.
