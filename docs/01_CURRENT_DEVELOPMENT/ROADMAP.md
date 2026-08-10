# Champions Legacy Challenge — Roadmap

<!-- RELEASE_STATUS: DEVELOPMENT -->
Last updated: 10 August 2026

## Current production — v0.24.0

v0.24.0 remains the verified production baseline. Its Firestore Rules and Hosting release were activated and independently verified on 9 August 2026. Production must not be changed by ordinary development checkpoints.

## Current development — v0.25.0

### 25A — Existing-app correctness foundations — COMPLETE
- snap route/navigation changes to the top of the page;
- make `Log activity` use its green navigation treatment only while that route is active;
- label the shell lifetime score as `total points`;
- move Champion Transmission into the welcome area and make message cycling more discoverable;
- expand the built-in motivational message library;
- remove the redundant Dashboard four-stat summary;
- remove the redundant Profile PageHeader icon block while retaining the actual profile identity section;
- keep all touched layouts responsive even though dedicated mobile/tablet visual acceptance remains scheduled for v0.27.0.

### 25B — MBTI-based player profiles — COMPLETE
- provide exactly 16 MBTI-based Legacy Profiles with local emblem-style profile pictures;
- let players directly select a known MBTI type;
- when unsure, offer a 12-question in-app quick estimate using three original questions per E/I, S/N, T/F and J/P dimension;
- show answer leans and require the player to review/select the suggested type rather than silently assigning it;
- offer an external link to the current 16Personalities free personality test, after which the player manually selects the result;
- persist only the optional selected `mbtiType` while keeping profile definitions, guidance, test logic and artwork in the frontend;
- provide strengths, possible challenges, Challenge/thriving suggestions and interpersonal tendencies as guidance rather than deterministic psychological claims;
- retain legacy avatar data only as backward-compatible fallback for players who have not selected a Legacy Profile yet.

### 25C — Safe Platform Administrator deletion/recovery behaviour — COMPLETE
- Platform Administrators may permanently delete an empty House only while its season is still an unused zero-participant draft;
- Platform Administrators may permanently delete an unused zero-participant draft season together with its draft Houses and closed invitation record in one atomic batch;
- every direct draft House deletion and every draft season deletion is paired with a deterministic immutable audit event;
- League Administrators cannot use the hard-delete path;
- once registration opens, Houses and seasons remain historical competition structures and cannot be hard-deleted through the app;
- Authentication-user deletion remains in the existing trusted Admin SDK workflow, with shared competition facts anonymised/preserved instead of being corrupted.

### 25D — League Season bonus points — COMPLETE
- Platform Administrators may directly award a player bonus points with a mandatory reason;
- League Administrators may submit scoped requests but cannot alter competitive totals directly; Platform Administrators receive a global Inbox review signal and must approve or reject;
- approval/direct award atomically creates an immutable award, matching contribution and audit history;
- the same raw bonus amount is added to the player and the House recorded at award/approval time, bypassing activity caps, participation bonuses and Power Play multipliers;
- later roster movement cannot relocate historical bonus points;
- corrections are separate positive/negative ledger adjustments and remain attached to the original award's House rather than the player's current House.

### 25R — v0.25 release-readiness freeze — COMPLETE
- freeze the completed 25A–25D application source at commit `0f5b715e4888d12ddc53ede334a9cfe13c5e2048`;
- refresh the release-readiness verifier from the retired v0.24 assumptions to v0.25.0;
- require the consolidated 148-test application gate and 94-test Firestore Rules emulator gate;
- keep development-branch production deploy scripts blocked;
- perform no Firebase production deployment during release-readiness verification.

Five Fires and Buddy Bonuses are intentionally removed from the pre-v1.0 roadmap. Unspecified late-season twists are not blockers for v1.0 and will only be implemented if explicitly designed and approved later.

## v0.26.0 — Security and operational hardening
- administrator permission review;
- public/private read audit;
- Rules complexity/simplification review;
- dependency and Rules-warning review without breaking automatic fixes;
- trusted-tool recovery, backup and operational checks.

## v0.27.0 — Full application UX, accessibility and performance review
- every page and workflow;
- dedicated desktop, tablet and mobile acceptance review;
- keyboard, screen-reader and focus management;
- dark mode, visual consistency, loading/empty/error states and performance;
- bundle/code-splitting review.

Responsive behaviour remains a requirement for every earlier implementation even though detailed mobile visual review is deferred to this release.

## v0.28.0 — Complete league-season rehearsal
- registration, C.H.A.O.S., Houses and leadership;
- Pocket Week, evidence, corrections and roster changes;
- Power Plays, bonus-point administration and weekly balancing;
- trusted reconciliation, publication, honours and account deletion;
- adversarial Rules cases, recovery runbook and final release checklist.

Only after this may the project become a v1.0 candidate, and only with explicit approval.

## Confirmed inactive/rejected mechanics
- Diamonds, player prices and the old transfer-market model remain rejected.
- Original one-player-per-House immunity remains replaced by the one-week post-move stability rule.
- Five Fires is removed from the planned product.
- Buddy Bonuses are removed from the planned product.
