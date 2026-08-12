# Champions Legacy Challenge - v0.27.0 Production Release Evidence

Date: 12 August 2026
Status: Verified production release
Firebase project: `fitnesschallengeapp-9e87f`
Hosting target: `app`
Hosting site: `champions-legacy-challenge`

## Release source

- Branch at deployment: `development/v0.27.0`.
- Exact deployed application source: `701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`.
- Accepted 27G runtime baseline: `ad92777cfa86481002639297ce8c7dce69b0e269`.
- Package version: `0.27.0`.
- Release tag: `v0.27.0` points to the exact deployed application source above.
- The later documentation-only finalisation commit is intentionally not the deployed-code tag target.

## Final automated gate

Before production activation:

- 188/188 application tests passed;
- ESLint passed;
- the Vite production build succeeded;
- 27G automated acceptance passed;
- 27G authenticated manual visual acceptance passed;
- 27R release-readiness verification passed;
- Firebase project and Hosting target mapping were verified;
- development-repository production deployment/finalisation scripts remained blocked.

Firestore Rules were byte-for-byte unchanged from the verified v0.26.0 production baseline. The existing Rules suite retained 98 tests, but the emulator suite was intentionally not rerun during 27R because the canonical Rules source hash had not changed.

## Firebase Hosting preview verification

The frozen v0.27 build was first deployed to the short-lived `v027-activation` Firebase Hosting preview channel.

Preview integrity verification passed:

- `index.html` exactly matched the frozen local build;
- `index.html` SHA-256: `37d1dcf890f8836b17cfe128219fe8313ff0e15520d43547379cfe61007fac38`;
- 10/10 critical SPA routes served the frozen application shell;
- 25/25 assets referenced by the production index matched the corresponding local build bytes;
- 4/4 configured Hosting security headers matched expectations.

Live production was not changed until preview verification passed.

## Firebase Hosting production activation

Scope: Hosting target `app` only.

Firestore Rules were **not** included in the deployment command.

Firebase Hosting result:

- site: `champions-legacy-challenge`;
- live URL: `https://champions-legacy-challenge.web.app`;
- Firebase finalized and released the new Hosting version successfully.

## Automated live verification

After activation, the read-only live verification confirmed:

- live `index.html` exactly matched the same frozen local build;
- local/live `index.html` SHA-256: `37d1dcf890f8836b17cfe128219fe8313ff0e15520d43547379cfe61007fac38`;
- 10/10 critical SPA routes passed;
- 25/25 index-referenced assets matched;
- 4/4 configured Hosting security headers matched.

A final local post-live verification also confirmed:

- HEAD remained `701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`;
- branch remained `development/v0.27.0`;
- working tree remained clean;
- local Firestore Rules SHA-256 remained `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`;
- local `dist/index.html` SHA-256 remained `37d1dcf890f8836b17cfe128219fe8313ff0e15520d43547379cfe61007fac38`.

## Firestore Rules boundary

v0.27.0 did not change or redeploy Firestore Rules.

Canonical unchanged SHA-256:

`35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`

The Hosting activation command was explicitly restricted to `hosting:app`, keeping Firestore outside the deployment surface.

## Authenticated production smoke

The logged-in production smoke was accepted on 12 August 2026 after checking the live v0.27 experience.

The accepted smoke covered the main authenticated navigation and core v0.27 presentation/interaction changes, including the Dashboard, Log Activity, Progress, Analytics, Profile, Houses, Seasons, crimson/black visual treatment and URL-backed same-page scroll behaviour.

No unnecessary production test data was required.

## Release conclusion

v0.27.0 is operational and verified in production.

Release tag `v0.27.0` is intentionally pinned to exact deployed source `701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`. This finalisation checkpoint changes documentation and Git release state only and performs no Firebase deployment.

The next planned phase is v0.28.0 complete league-season rehearsal.
