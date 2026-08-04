# Champions Legacy Challenge — Known Issues

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 4 August 2026

## Verification environment

- The packaging environment could not install the full npm dependency tree because its internal registry did not contain one ESLint transitive package.
- 96 domain tests and static JavaScript/import audits pass.
- Authoritative Windows verification passed the Vite build, ESLint, all 44 Firestore Rules tests and release-readiness.

## Current correction-workflow boundaries

- Correction transactions run from the trusted Platform Administrator client. A trusted backend remains preferable for prize-bearing competition.
- Pocket redemption records are diagnosed but not replaceable in v0.20.0 because they are immutable activation receipts tied to reserve balances.
- Daily Water/Fruit evidence bonuses remain attached to their one-per-day claim. A factual entry correction links the replacement entry but does not automatically revoke an already reviewed photo bonus.
- Reconciliation diagnostics are targeted to one correction chain and do not run as a background whole-database scan. Blocking errors stop another correction until the missing records are reconciled.
- The active-history resolver can fall back to the newest readable replacement when documents arrive out of order; the warning still requires administrator review.

## Existing operational boundaries

- The 10:00 leaderboard fallback requires an authorised administrator session; there is no guaranteed no-cost background scheduler.
- Account deletion remains an audited request workflow rather than automatic Firebase Authentication/data deletion.
- Full personal history still uses a live owner query; v0.20.0 limits rendered Journal date rows but does not yet cursor-page the underlying Firestore subscription.
- The Firebase vendor bundle remains larger than 500 kB after minification; this is a non-blocking build warning.
- `npm audit` reports the known React Router RSC-mode advisory. This app does not use RSC mode. Do not run `npm audit fix --force` because it applies a breaking downgrade.

## Deferred review

Full desktop/mobile, dark-mode, visual, keyboard, screen-reader and reduced-motion review remains deferred to the final pre-v1.0 stage.
