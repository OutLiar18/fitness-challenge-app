# Champions Legacy Challenge — Release Process

## Standard sequence

1. Freeze an exact release source commit.
2. Run the authoritative Windows release gate.
3. Resolve every real gate failure before production.
4. Choose the smallest production deployment scope required by the release.
5. Deploy each production scope through a reviewed release runner with no automatic retry.
6. Perform read-only remote/live verification after deployment.
7. Perform a minimal production smoke test that avoids fake competition history.
8. Finalise release documentation.
9. Tag the exact deployed source commit and verify the remote branch/tag.

## Verification

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
```

Review dependency advisories deliberately. Do not use `npm audit fix --force` as a release shortcut.

## Production deployment boundary

Production deployment scripts inside the development repository are intentionally blocked. A release that changes production must use a separately reviewed runner whose scope is explicit, for example Rules-only or Hosting-only.

A runner must:

- identify the exact Firebase project;
- identify the exact deployment scope;
- verify the frozen source before deployment;
- perform at most one deployment attempt unless an explicit later decision authorises another;
- contain no unrelated deployment command;
- stop on any failed gate;
- record enough output for independent verification.

## v0.24.0 release pattern

v0.24.0 used a deliberately sequential production release:

1. **9A — Firestore Rules only** after the complete 131-domain/79-Rules gate.
2. Read-only Rules API verification of the active Release, full Ruleset source and runtime executable.
3. **9B — Hosting target `app` only** after the full gate passed again.
4. Read-only live verification of index/assets/SPA fallback/headers.
5. **9C — production smoke** using read-only navigation plus a reversible profile write instead of fake challenge activity.
6. **9D — documentation and Git tag finalisation only**.

The `v0.24.0` tag points to exact deployed source commit `b5e7c083c0ba7730f21b8a92b30530f3ebb8374c`, not to the later documentation-only finalisation commit.

## Rollback principle

Never automatically redeploy after a production failure. First determine whether production changed, what resource is active, and what exact source/version is live. Hosting and Firestore Rules can have different activation/rollback mechanisms and must be inspected independently.

## Trusted operations are not a deployed backend

Trusted season reconciliation and trusted account-deletion tools remain local administrator operations using credentials outside the repository. No Cloud Functions, paid scheduler or credential bundle is deployed with the web application.

## Pre-v1.0 boundary

All `0.x.x` releases remain active development. Do not create a v1.0 tag without explicit approval after the final functional, visual, responsive, accessibility, security and operational review.
