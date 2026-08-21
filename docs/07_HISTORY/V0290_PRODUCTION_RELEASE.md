# Champions Legacy Challenge — v0.29.0 Production Release

Release: v0.29.0
Status: Verified production release
Production activation: 21 August 2026 (Africa/Johannesburg)

## Release identity

Deployed and tagged source commit:
`d34065b5352fff6c2e13941fcc2f566ce519c926`

Release tag:
`v0.29.0`

Firebase project:
`fitnesschallengeapp-9e87f`

Hosting target/site:
`app` → `champions-legacy-challenge`

Production URL:
`https://champions-legacy-challenge.web.app`

## Verification evidence

- Application tests: 302 / 302 PASS.
- Production build: PASS.
- UI Quality verification: PASS.
- Release Readiness: PASS.
- Live index SHA-256: `400b029c799d0c323c87589151b53556ec795e5de2ee3594864cc2420d91962d`.
- Referenced live assets verified: 26.
- SPA routes verified against the deployed index: 10 / 10.

## Firestore boundary

Firestore Rules were not redeployed during the v0.29 Hosting activation.

Committed Rules Git blob:
`c8e1b5542a05650b0e013a4e9aaed59b4008b583`

Canonical Rules SHA-256:
`35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`

The committed Rules content is unchanged from v0.28.0.

## Product scope delivered in v0.29

- broad repository/source cleanup;
- removal of proven dead/generated/release-specific residue;
- version-neutral automated UI quality verification;
- shared theme-token and visual hierarchy polish;
- responsive/small-screen hardening;
- no intentional scoring, league-authority, evidence-review or Firestore-security changes.

## Deferred to v0.30

- mobile Lighthouse Performance and Best Practices investigation and targeted remediation;
- final owner-requested polish and release hardening before a v1.0 decision.

## Release finalisation convention

`v0.29.0` points to the exact deployed source commit above. A later documentation-only finalisation commit may sit after the release tag; `main` and `development/v0.30.0` advance to that documentation-finalised baseline. No Firebase deployment is performed by repository finalisation.
