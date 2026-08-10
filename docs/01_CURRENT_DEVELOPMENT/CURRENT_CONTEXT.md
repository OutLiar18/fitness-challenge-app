# Champions Legacy Challenge — Current Context

<!-- RELEASE_STATUS: DEVELOPMENT -->
Current source: v0.25.0 development
Current production: v0.24.0
Last updated: 10 August 2026

v0.24.0 is the verified production baseline and must remain untouched during ordinary v0.25 development.

v0.25.0 has four controlled work areas:
1. 25A — basic existing-app correctness fixes — complete;
2. 25B — 16-profile MBTI identity system with a 12-question rough-estimate flow and external 16Personalities link — complete;
3. 25C — safe Platform Administrator draft deletion/recovery semantics — complete;
4. 25D — League Season bonus points with Platform Administrator direct awards and Platform-reviewed League Administrator requests.

Five Fires and Buddy Bonuses have been removed from the roadmap. Broad visual polish is deferred to v0.27.0, but every implementation must remain responsive across desktop/tablet/mobile. Current acceptance observations are being made on desktop only.

25B introduces one optional player-profile field, `mbtiType`. All 16 profile definitions, quick-test questions/scoring, guidance and emblem-style artwork remain local frontend data. Firestore Rules only validate the permitted four-letter type values and the existing player-owned profile update boundary.

25C permits Platform Administrator-only hard deletion of unused draft Houses/seasons with immutable audit binding. Draft season deletion removes its Houses and closed invite atomically; once registration opens, historical structures cannot be hard-deleted. Authentication-user deletion remains trusted Admin SDK work. No production deployment occurs during development checkpoints.
