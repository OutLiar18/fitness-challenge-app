# Champions Legacy Challenge — Current State

<!-- RELEASE_STATUS: DEPLOYED -->
Version: 0.21.0  
Production version: 0.21.0  
Last updated: 5 August 2026  
Status: Verified and deployed; release commit pending; pre-v1.0

## Product state

Champions Legacy Challenge combines factual tracking, personal progression, season Houses, external WhatsApp proof, controlled standings, audited corrections and a Season Command Centre. v0.21.0 adds the first elevated recalculation and publication path for prize-bearing season standings without requiring paid cloud infrastructure.

## Delivered in the v0.21.0 candidate

### Trusted recalculation model

- Rebuilds individual standings, House standings and honours from the frozen season ruleset, memberships and immutable contributions.
- Produces a deterministic fingerprint independent of Firestore query order.
- Compares the trusted result with the latest published snapshot.
- Reports blocking, warning and informational integrity findings.
- Reuses the existing league calculation model rather than introducing alternate scoring.

### Free local Admin SDK command

- Dry run is the default and changes no Firebase competition state.
- Detailed reports are written to ignored local `trusted-reports` JSON files.
- Publication requires an explicit command and `PUBLISH` confirmation.
- Publication is blocked while integrity errors remain.
- Unchanged trusted fingerprints do not create duplicate snapshots.
- Successful publication creates immutable snapshot, run and audit records, then advances the league publication pointer.

### Command Centre and security

- Platform and season administrators can read trusted publication summaries.
- The Command Centre shows whether a trusted publication is missing, stale or blocked and displays the operating commands.
- All browser clients are denied writes to `seasonTrustedRuns`.
- Service-account credentials are explicitly excluded from the repository.

## Verification state

- 104 of 104 domain tests pass in the packaging environment.
- JavaScript syntax and local-import audits pass.
- Windows ESLint, Vite build, 46 Firestore Rules tests and release-readiness are pending.
- Production is v0.21.0 until those gates pass and deployment is approved.

## Existing complete systems

Authentication, profiles, Legacy Avatars, ten activity categories, Points Engine v2, local-date Journal, goals, bonuses, streaks, shields, Experience Points, levels, achievements, records, timeline, Personal Analytics, trusted client administration, moderation, shared libraries, Inbox, Rulebook, Points Guide, error monitoring, Firebase Hosting, Legacy Coach, season Houses, C.H.A.O.S., leadership voting, roster swaps, Pocket Week, notifications, dual standings, honours, onboarding, personal export, account requests, external evidence, published standings, Season Command Centre and audited factual corrections.

## Boundaries

- No Cloud Functions, paid Firebase plan or automatic background schedule.
- Actual reconciliation requires a private service-account key outside the project.
- The tool reports integrity problems but does not silently repair them.
- Account-deletion execution and anonymisation remain undefined.
- Full final cross-device, keyboard, screen-reader, dark-mode and accessibility review remains deferred.
- Do not call or tag v1.0 without explicit approval.
