# Champions Legacy Challenge — Current State

<!-- RELEASE_STATUS: CANDIDATE -->
Version: 0.23.5  
Production version: 0.23.0  
Last updated: 7 August 2026  
Status: Stability release candidate; production deployment pending; pre-v1.0

## Product state

The app combines factual personal tracking, progression, season Houses, WhatsApp evidence, audited corrections, controlled published standings, trusted reconciliation and trusted account deletion. v0.23.5 is a stabilization checkpoint based on the verified v0.23.0 runtime and Firestore security model, with themed no-repeat Power Plays preserved.

## Preserved in the v0.23.5 stability candidate

- New `season-houses-v3` ruleset and `power-play-v1` policy for newly created seasons.
- Ten base category Power Plays that administrators rename to match the season theme.
- Unique, confirmed theme names required before registration.
- Custom 2× or 3× Power Plays for one or multiple activity categories.
- One immutable assignment per official season week.
- Deterministic random selection without replacement; no selected play returns later in the season.
- Pre-week redraw with a reason and locked-week Platform Administrator correction with an audit trail.
- Player reveal only after the official week starts; authorised operators may prepare future weeks.
- Activity-date multiplier resolution for immediate and proof-released contributions.
- Individual, House, honours, command-centre and trusted-reconciliation integration.
- Frozen definition map so weekly assignments cannot silently change names, multipliers or categories.
- Responsive Power Play season workspace and player notifications.

## Verification state

- Runtime and Firestore Rules are restored to the verified v0.23.0 contract.
- Expected release gates are 120 of 120 domain tests, 51 of 51 Firestore Rules tests, clean ESLint, a successful Vite build and release-readiness.
- `firestore.rules` and `tests/firestore.rules.test.mjs` are byte-for-byte identical to the verified v0.23.0 baseline.
- Production remains v0.23.0 until the v0.23.5 gates pass and the sequential Rules-then-Hosting deployment succeeds.

## Boundaries

- v0.24 development now has the `season-houses-v4` movement core, immutable assignment history, audited Platform Administrator rest correction, optional private season composition profiles and the non-scoring `house-balance-v1` weekly privacy-safe snapshot system. The next step is the v0.24 integration/release gate.
- Existing v1 and v2 seasons do not silently gain Power Plays.
- No background scheduler is introduced; authorised administrators select or preselect weekly plays.
- A player may need to refresh the Seasons page when a new official week begins so the new started-week listener attaches.
- Power Plays never multiply evidence bonuses, goal/mission bonuses, streaks, Experience Points or administrator adjustments.
- Formal legal/privacy review and a confirmed support contact remain required before public launch.
- Full final cross-device, keyboard, screen-reader, dark-mode and accessibility review remains deferred.
- Do not call or tag v1.0 without explicit approval.
