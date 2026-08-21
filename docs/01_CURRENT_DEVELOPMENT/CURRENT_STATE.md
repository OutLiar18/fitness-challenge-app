# Champions Legacy Challenge — Current State

Last updated: 21 August 2026

## Release state

- Current development branch: `development/v0.29.0`
- Development baseline: `2d6bd416fd2e0b9b807bccc2f28be4f6d8301c44`
- Production version: **v0.28.0**
- Production deployed/tagged source: `2f01401a980e0e9573c9b70b4beff00ab7191c16`
- Verified live index SHA-256: `f18aef3aa90e2ed5220eb1adf881ae36738ba30da95a351ce348ae4950cd1e83`
- Firestore Rules canonical SHA-256: `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`
- v0.28 development branch: deleted locally and remotely after finalisation.

## Current phase

v0.29 is a focused cleanup and hardening line. The previous mandatory external-tester cycle and full season rehearsal have been removed from the release path. Work should concentrate on maintainability, responsiveness, visual consistency, dead-code removal and owner-requested fixes without reopening accepted gameplay contracts.

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
