# Recent Session Summary — v0.24.0 Production Release

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 9 August 2026

v0.24.0 completed the controlled House Movement rebuild and is now verified in production.

## What shipped

- `season-houses-v4` as the current new-season contract.
- One-week post-move roster rest with C.H.A.O.S. exemption.
- Immutable House-assignment history.
- Platform Administrator-only rest correction with factual audit reasons.
- Optional private composition responses.
- `house-balance-v1` privacy-safe weekly snapshots with no scoring effect.
- Themed no-repeat Power Plays preserved across the v4 season contract.
- Evaluator-aware Firestore Rules routing and compact trusted write boundaries.

## Final verification

- 131 domain tests passed.
- 79 Firestore Rules tests passed.
- Final Rules suite produced zero 1,000-expression evaluator-limit messages.
- Frozen Rules SHA-256: `2ab1e569f4699e0018f3c5b7e5225a9fb42d65b835215fc9b8917ab21c701573`.
- Rules-only production activation succeeded and the active remote Ruleset source matched the frozen source byte-for-byte.
- Hosting-only production activation succeeded; the live index and 17 referenced assets matched the verified build byte-for-byte.
- Read-only production navigation and reversible profile-write smoke tests passed.

Deployed source commit: `b5e7c083c0ba7730f21b8a92b30530f3ebb8374c`.

## Next

Begin v0.25.0 design for Five Fires and the remaining competition decisions. Do not touch production while those rules remain unresolved. The project remains pre-v1.0.
