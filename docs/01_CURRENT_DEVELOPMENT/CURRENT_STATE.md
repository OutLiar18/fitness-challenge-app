# Champions Legacy Challenge — Current State

Last updated: 21 August 2026

## Release state

- Current development branch: `development/v0.30.0`
- Production version: **v0.29.0**
- Production deployed/tagged source: `d34065b5352fff6c2e13941fcc2f566ce519c926`
- Verified live index SHA-256: `400b029c799d0c323c87589151b53556ec795e5de2ee3594864cc2420d91962d`
- Firestore Rules canonical SHA-256: `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`
- v0.29 development branch is retired after release finalisation.

## v0.29.0 verified production release

v0.29 completed the focused source cleanup, visual polish and hardening pass. The final release gate passed 302 / 302 application tests, the production build, UI Quality verification and Release Readiness. Firebase Hosting was verified against the exact gated build. Firestore Rules were unchanged and were not redeployed.

## Current phase

v0.30 is the shortened final hardening line before a v1.0 decision. It owns the mobile Lighthouse Performance / Best Practices investigation plus any owner-requested polish or fixes. External tester rounds and a full season rehearsal are not mandatory. Accepted gameplay, scoring, evidence authority and Firestore security boundaries remain frozen unless explicitly changed.

## Product foundations currently implemented

- factual activity logging with category-specific validation;
- daily/weekly goals and statistics;
- XP, levels, achievements, streaks, personal records and timeline;
- season-scoped individual and House standings;
- House leadership and audited roster movement;
- Power Plays and bonus-point workflows;
- external evidence with controlled published standings;
- Platform-Administrator-only evidence decisions;
- account/privacy tools and trusted deletion workflows;
- rulebook and points guide;
- Legacy Coach;
- MBTI Legacy Profiles, mythic emblems and global theme palettes;
- responsive accessible application shell and workspace navigation.

## Locked behavioral boundaries

- Running earns Running points only at distance ≥ 3 km and average pace ≤ 11:00 min/km. Ineligible runs are still recorded and contribute duration to Cardio.
- Diamonds, player prices and the old Transfer Market are not part of the product.
- The old one-player-per-House immunity mechanic is not active; one-week post-move stability is authoritative.
- Evidence approval/rejection/review belongs to Platform Administrators only.
- League Administrators retain league-management duties but do not decide evidence claims.
- Visual cleanup must not silently alter scoring, competition authority or Firestore security.

## Engineering state

The application uses React 19, Vite 8 and Firebase 12. The source uses service/model boundaries for domain behavior, configuration-driven scoring/rules, lazy page loading and shared UI primitives. Generated build output, Firebase cache/debug logs and local secrets are not source artifacts.
