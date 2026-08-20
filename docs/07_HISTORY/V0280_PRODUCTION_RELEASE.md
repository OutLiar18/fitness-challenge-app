# Champions Legacy Challenge — v0.28.0 Production Release

Release: v0.28.0
Status: Verified production release
Production activation: 21 August 2026 (Africa/Johannesburg)

## Release identity

Deployed and tagged source commit:
`2f01401a980e0e9573c9b70b4beff00ab7191c16`

Owner-accepted runtime source before the documentation-only 28R freeze:
`7fdfd149df8d9d9e09ddf05bddf1a24a9d1c99c8`

Release tag:
`v0.28.0`

Firebase project:
`fitnesschallengeapp-9e87f`

Hosting target/site:
`app` → `champions-legacy-challenge`

Production URL:
`https://champions-legacy-challenge.web.app`

## Verification evidence

The frozen v0.28 release completed the full application gate before production
activation:

- application tests: 298 / 298 PASS;
- production build: PASS;
- retained v0.27 automated acceptance: PASS;
- owner page-by-page acceptance: complete;
- 28D14 MBTI enhancement acceptance: complete.

The exact production build was independently verified after Hosting activation:

- live `index.html` SHA-256:
  `f18aef3aa90e2ed5220eb1adf881ae36738ba30da95a351ce348ae4950cd1e83`;
- referenced production assets verified: 26;
- SPA routes verified against the deployed index: 10 / 10.

## Firestore boundary

Firestore Rules were not redeployed during the v0.28 Hosting activation.

Canonical Rules SHA-256 remained:
`35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`

This is the same Rules hash retained from the previous production release.

## Product scope delivered in v0.28

v0.28 completed the owner-led page-by-page inspection and polish pass across
the application, including Dashboard/Home, Progress, Seasons, Houses, Inbox,
Analytics, Pocket Week, Legacy Coach, Rulebook, Points Guide, Help & Privacy,
Administration and Profile.

The final accepted identity enhancement added:

- 16 full-colour MBTI mythic identity emblems;
- expanded Legacy Profile personality guidance;
- 16 global MBTI presentation palettes;
- 64 genuinely MBTI-tailored Champion Transmission messages;
- a neutral Champions Legacy crimson fallback when no type is selected.

The release preserved existing scoring, league-authority and evidence-review
contracts unless explicitly changed by previously accepted versioned work.

## Release finalisation convention

`v0.28.0` points to the exact deployed source commit above.

A later documentation-only finalisation commit records production evidence and
is allowed to sit after the release tag. Permanent repository branches are
fast-forwarded to that documentation-finalised commit. The next version branch
is created from the same finalised repository baseline.

No Firebase deployment is performed by release finalisation.
