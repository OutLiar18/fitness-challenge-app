# Champions Legacy Challenge — Roadmap

<!-- RELEASE_STATUS: VERIFIED_PRODUCTION -->
Last updated: 10 August 2026

## Current production — v0.25.0

v0.25.0 is the verified production baseline. Firestore Rules and Hosting were activated independently on 10 August 2026 and verified against the frozen release source. Production release evidence is recorded in `docs/07_HISTORY/V0250_PRODUCTION_RELEASE.md`.

## v0.25.0 — COMPLETE

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

### Production activation — COMPLETE
- deployed application source commit: `1e11f5ff8ca5af7e9d758f62b9d377e1c6ddd94d`;
- final gate: 148/148 application tests and 94/94 Firestore Rules tests;
- active Firestore Rules source independently matched SHA-256 `17217b471feb4f7e2db3df72b9456cc64e1451eb2c529228490b6ef8e47f376e`;
- Hosting target `app` released 66 files to `champions-legacy-challenge`;
- live build integrity and 10/10 critical SPA routes passed;
- logged-in manual production smoke passed;
- release tag `v0.25.0` points to the exact deployed source commit, while the later finalisation commit is documentation-only.

Five Fires and Buddy Bonuses are intentionally removed from the pre-v1.0 roadmap. Unspecified late-season twists are not blockers for v1.0 and will only be implemented if explicitly designed and approved later.

## v0.26.0 — Security and operational hardening
### 26A — Security baseline
- administrator permission and role-source inventory;
- public/private Firestore read inventory;
- Rules size/complexity baseline;
- App Check/client-attestation readiness review before any enforcement;
- dependency advisory/outdated-package capture without automatic fixes;
- trusted account-deletion/recovery and partial-failure review;
- Hosting security-header and deployment-safeguard inventory;
- full application and Firestore Rules regression gate;
- no Firebase deployment.

### 26B — Canonical Platform Administrator authority — COMPLETE
- use the trusted Firestore profile role as the single Platform Administrator authority source;
- remove the Auth-token `admin:true` fallback from Firestore Rules and client UI gating;
- make the existing Rules administrator context profile-only so the full suite proves that authority path;
- prove claim-only and stale-claim sessions cannot retain Platform Administrator access;
- no Firebase deployment.

### 26C — League Administrator scope guard — COMPLETE
- retain the global `leagueAdmin` profile role as a bounded bootstrap capability for league + invite creation;
- keep all existing-league operational authority scoped by the target league's `administratorIds`;
- prove the global role alone cannot read another administrator's private draft;
- prove the global role alone cannot self-assign into another league;
- keep Firestore Rules byte-for-byte unchanged from 26B;
- no Firebase deployment.

### 26D — Development dependency advisory remediation — COMPLETE
- classify the npm advisories by package, severity, direct/transitive relationship and fix availability;
- keep production dependency vulnerabilities at zero;
- use only compatible package-lock remediation without `--force`;
- preserve all direct dependency specifications;
- validate the candidate from a clean detached worktree before acceptance;
- 1 of 7 development/tooling advisories were cleared; 6 lower-severity advisories remain documented;
- no Firebase deployment.

### Advanced client/Hosting hardening — DEFERRED UNTIL SCALE REQUIRES IT
- App Check enforcement and explicit CSP rollout are not current friends-scale requirements;
- prior 26E research remains available in Git history;
- active readiness tooling is removed in 26I;
- existing Hosting security headers remain.

### 26F — Trusted account-deletion interruption recovery — COMPLETE
- freeze a private recovery plan before a trusted deletion enters processing;
- bind the recovery-plan SHA-256 and operation count into the trusted execution record;
- persist execution phase and Firestore batch progress;
- replay the frozen path/mode plan idempotently on processing/failed recovery;
- fail closed if the recovery plan is missing, mismatched, incomplete or conflicts with another execution;
- preserve Auth disable/revocation before Firestore mutation and Auth deletion after Firestore completion;
- run no production account deletion and perform no Firebase deployment.

### Advanced Firestore disaster recovery — DEFERRED UNTIL SCALE REQUIRES IT
- Google Cloud IAM/PITR/backup-schedule inventory and automated restore planning are deferred;
- prior 26G research remains available in Git history;
- active recovery-planner/test tooling is removed in 26I;
- trusted per-account deletion recovery remains because it supports a real app operation.

### 26I — Practical security + Rules simplification — COMPLETE
- remove redundant explicit deny blocks for retired permanent Team collections;
- fully retire the old evidence-reviewer collection from client Rules;
- collapse redundant league-read aliases into the existing scoped administrator helper;
- retain the recursive deny-all fallback and all current gameplay/security contracts;
- remove active enterprise-readiness tooling that is not needed at current scale;
- complete the full application + Rules regression gate with no Firebase deployment.

### Remaining v0.26 work
- run the final release gate;
- perform one reviewed v0.26 production activation and verification;
- then move directly to v0.27.

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
