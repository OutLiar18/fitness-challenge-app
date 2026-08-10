# Champions Legacy Challenge — Current Context

<!-- RELEASE_STATUS: VERIFIED_PRODUCTION -->
Current source: v0.25.0 release finalised
Current production: v0.25.0
Last updated: 10 August 2026

v0.25.0 is the verified production baseline. The exact deployed application source is commit `1e11f5ff8ca5af7e9d758f62b9d377e1c6ddd94d`; release tag `v0.25.0` must point to that deployed source rather than the later documentation-only finalisation commit.

v0.25.0 has four controlled work areas:
1. 25A — basic existing-app correctness fixes — complete;
2. 25B — 16-profile MBTI identity system with a 12-question rough-estimate flow and external 16Personalities link — complete;
3. 25C — safe Platform Administrator draft deletion/recovery semantics — complete;
4. 25D — League Season bonus points with Platform Administrator direct awards and Platform-reviewed League Administrator requests — complete.

Five Fires and Buddy Bonuses have been removed from the roadmap. Broad visual polish is deferred to v0.27.0, but every implementation must remain responsive across desktop/tablet/mobile. Current acceptance observations are being made on desktop only.

25B introduces one optional player-profile field, `mbtiType`. All 16 profile definitions, quick-test questions/scoring, guidance and emblem-style artwork remain local frontend data. Firestore Rules only validate the permitted four-letter type values and the existing player-owned profile update boundary.

25C permits Platform Administrator-only hard deletion of unused draft Houses/seasons with immutable audit binding. Draft season deletion removes its Houses and closed invite atomically; once registration opens, historical structures cannot be hard-deleted. Authentication-user deletion remains trusted Admin SDK work. No production deployment occurs during development checkpoints.
25D adds an immutable League Season bonus ledger. League Administrators request only; Platform Administrators receive a pending-review Inbox signal and may approve/reject, award directly or create corrective adjustments. Awarded points bypass activity caps and Power Plays, credit player and historical House equally, and never move when rosters change.
25R freezes the completed v0.25 application/Rules source at commit `0f5b715e4888d12ddc53ede334a9cfe13c5e2048` and refreshes release-readiness verification to the 148-application-test / 94-Rules-test v0.25 baseline. No production deployment occurs during 25R.

Production activation completed on 10 August 2026. The live default Cloud Firestore release points to Ruleset `9e476b71-9b9b-4b05-bedd-5bc3b1932d2d`, whose source SHA-256 exactly matches the frozen local candidate `17217b471feb4f7e2db3df72b9456cc64e1451eb2c529228490b6ef8e47f376e`. Hosting target `app` released the 66-file frozen build to `https://champions-legacy-challenge.web.app`. Automated smoke matched the live index and 16 referenced assets byte-for-byte, verified 10/10 critical SPA routes, and the logged-in manual smoke passed. The remaining Vite Firebase-vendor chunk-size warning is non-blocking and stays deferred to v0.27.0.
