# Champions Legacy Challenge — Current State

<!-- RELEASE_STATUS: DEPLOYED -->
Version: 0.22.0  
Production version: 0.22.0  
Last updated: 5 August 2026  
Status: Verified and deployed; release commit pending; pre-v1.0

## Product state

The app now combines factual personal tracking, progression, season Houses, WhatsApp evidence, audited corrections, controlled standings, Season Command Centre operations and free local trusted reconciliation. v0.22.0 completes the previously deferred irreversible account-deletion path.

## Delivered in the v0.22.0 candidate

- Seven-day cancellation period after administrator acknowledgement.
- Player cancellation only before trusted processing starts.
- Local Admin SDK commands to list requests, perform dry audits and process eligible requests.
- Deterministic Former Player aliases that preserve shared history without names or email addresses.
- Deletion of Firebase Authentication and eligible private account records.
- Anonymisation of relevant memberships, contributions, evidence, corrections, Pocket records, votes, snapshots, House records and audits.
- Final Platform Administrator protection, explicit confirmation and final live-plan refresh.
- Resumable failed executions plus administrator-only completion receipts.
- Fresh re-registration allowed with no restored or automatically linked history.
- Personal export schema version 3.

## Verification state

- 108 of 108 domain tests pass in the packaging environment.
- JavaScript syntax and local-import audits pass.
- Windows ESLint, Vite build, 47 Firestore Rules tests and release-readiness remain authoritative and pending.
- Production is v0.22.0 until those gates pass and deployment is approved.

## Boundaries

- No Cloud Functions, paid Firebase plan or automatic deletion schedule.
- A private service-account key is required and must remain outside the project.
- The tool does not bypass the seven-day window or silently repair unrelated malformed records.
- Formal legal/privacy review and a confirmed support contact remain required before public launch.
- Full final cross-device, keyboard, screen-reader, dark-mode and accessibility review remains deferred.
- Do not call or tag v1.0 without explicit approval.
