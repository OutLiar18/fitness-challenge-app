# Champions Legacy Challenge — Roadmap

<!-- RELEASE_STATUS: VERIFIED_PRODUCTION -->
Last updated: 12 August 2026

## Current production — v0.27.0

v0.27.0 is the verified production baseline. The exact deployed/tagged source is `701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`; live/local `index.html` SHA-256 is `37d1dcf890f8836b17cfe128219fe8313ff0e15520d43547379cfe61007fac38`; Firestore Rules were not redeployed and remain SHA-256 `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`.

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

### 26R — v0.26 release-readiness freeze — COMPLETE
- freeze the completed 26I application/security source;
- pin the simplified Firestore Rules SHA and 98-test Rules gate;
- refresh the stale v0.25 release verifier for the practical v0.26 release surface;
- permit only release documentation/verifier drift before activation;
- keep development deployment scripts blocked;
- perform no Firebase deployment.

### v0.26.0 production release — COMPLETE
- exact deployed source/tag: `c057fca0598fe4a07ff101ea13808f1da8918aa8`;
- Firestore Rules SHA-256: `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`;
- Rules and Hosting activation completed successfully;
- live Hosting verification passed for 10/10 SPA routes and all 16 referenced assets;
- v0.26 enterprise-grade App Check/CSP and Google Cloud DR work remains deferred until scale requires it;
- v0.26 is closed.



## v0.27.0 — Full application UX, accessibility and performance review

### 27A — Full application audit — COMPLETE
- static route/page/component/CSS inventory;
- existing accessibility and responsive foundations inventoried;
- page/workspace complexity and repeated interaction patterns prioritized;
- current build/bundle sizes captured;
- detailed plan recorded in `V027_UX_AUDIT.md`;
- no application behaviour or Firebase deployment changes.

### 27B — Design system + application shell — COMPLETE
- implement approved black/charcoal + dark-blood-red Champions Legacy visual direction;
- establish accessible light/dark tokens with separate readable accent and primary-control colours;
- standardise shared button/card/form/focus/PageHeader/WorkspaceTabs patterns;
- polish desktop sidebar, tablet rail, mobile header, More surface and bottom navigation without changing behaviour;
- raise excessively small primary shell/status/navigation text;
- establish responsive content-width/spacing foundation;
- add persistent design-system regression coverage;
- keep Firestore Rules unchanged and perform no Firebase deployment.

### 27C — Core player loop — COMPLETE
- prioritize Dashboard actions/goals before lower-frequency insight;
- add direct Dashboard → Journal navigation and URL-backed Log/Journal tab state;
- improve category/form touch and readability behavior;
- focus save-validation errors for keyboard/screen-reader recovery;
- replace editable Activity Log browser confirmation with a reusable accessible alert dialog;
- improve Journal empty state, date/history scanning and player-facing pagination copy;
- preserve scoring, evidence, entry-service and Firestore Rules semantics;
- add persistent 27C regression coverage and perform no Firebase deployment.

### 27D — Personal progress and communication — COMPLETE
- persist Progress, Analytics, Profile and Legacy Coach workspace state in the URL;
- persist non-default Analytics range;
- add Analytics/Profile loading and Progress/Analytics recovery states;
- expose Analytics weekly/consistency data with semantic labelled lists rather than a flattened image-role wrapper;
- focus Profile save errors and expose profile/coach busy states;
- replace bespoke Inbox tabs with shared keyboard-accessible WorkspaceTabs/WorkspacePanel;
- expose a clear enabled-but-no-recommendations Legacy Coach state;
- improve responsive readability/touch treatment across all five surfaces;
- preserve all statistics/profile/messaging/coaching/Rules semantics and perform no Firebase deployment.

### 27E — Competition workspaces — COMPLETE
- URL-back House selection, House task workspace, Seasons Browse/Join/Create workspace and season-detail workspace;
- remove duplicate local season-detail tab state;
- extract House card/roster and season standings presentation from oversized route modules;
- add shared player/leader/administrator competition-context summaries with direct task shortcuts;
- replace remaining Houses/Seasons browser confirm/prompt flows with accessible in-app confirmation while preserving typed DELETE for permanent unused draft-season deletion;
- improve competition metadata readability, touch targets and mobile action stacking;
- preserve C.H.A.O.S., leadership, movement/rest, assignment history, balance, Power Plays, evidence, bonuses, lifecycle, standings, honours and all service/Rules semantics;
- add persistent 27E regression coverage and perform no Firebase deployment.

### 27F — Administration, reference and support — COMPLETE
- URL-back Platform Admin, Points Guide, Help and Pocket workspaces;
- URL-back Rulebook search/status state and add clear-filter recovery/current House terminology;
- require shared accessible confirmation before audited trusted-role changes;
- focus Help failures and expose account-tool busy state;
- improve dense Admin controls, reference reading measure, scoring reference responsiveness and Pocket control touch/readability;
- explicitly label future-feature routes as previews and provide a Dashboard return path;
- preserve admin authority, scoring models, Pocket/account semantics and Firestore Rules;
- add persistent 27F regression coverage and perform no Firebase deployment.

### 27G — Performance + full acceptance — COMPLETE / ACCEPTED
- partition the existing Firebase manual group using Rolldown's size-based splitting rather than a Firebase architecture rewrite;
- preserve Firebase modular imports and route-level lazy loading;
- persist build-budget, 320px, focus, reduced-motion, contrast, tab/dialog semantics and no-native-confirm checks in `npm run check`;
- generate the automated production-build acceptance report;
- manually complete the 320px/tablet/desktop authenticated visual acceptance;
- manually complete keyboard/screen-reader/focus, light/dark, reduced-motion and loading/empty/error/destructive-state spot-checks;
- fix any manual acceptance defects before 27R;
- keep Firestore Rules unchanged and perform no Firebase deployment.

- manual review and direct source audit found and remediated five bounded defects before 27R: muted red/black presentation, the Dashboard Welcome Card's legacy blue styling, query-string workspace/tab changes incorrectly resetting page scroll, the authentication hero's retired blue branding, and Daily Progress's red-to-blue fill;
### 27R — Release freeze — COMPLETE
- froze accepted 27G runtime/application source at `ad92777cfa86481002639297ce8c7dce69b0e269`;
- exact 27R/deployed release source: `701b58df40eedab39c8f7fe5d4b2ea95efd11ba5`;
- 188/188 application tests, production build, 27G acceptance and 27R release-readiness passed;
- unchanged Firestore Rules SHA verified;
- development production/finalisation scripts remained blocked during the freeze.

### v0.27.0 production release — COMPLETE
- Hosting-only production activation completed successfully;
- preview and live verification passed 10/10 SPA routes, 25/25 referenced assets and 4/4 security headers;
- live/local `index.html` SHA-256 matched `37d1dcf890f8836b17cfe128219fe8313ff0e15520d43547379cfe61007fac38`;
- Firestore Rules were not redeployed;
- authenticated production smoke accepted on 12 August 2026;
- tag `v0.27.0` points to the exact deployed source commit;
- v0.27.0 is closed.

Responsive behaviour remains a requirement throughout later development.

## v0.28.0 — Full page-by-page inspection and change pass

### 28A — initial rehearsal contract — COMPLETE / DEFERRED
- original rehearsal-planning work completed as documentation only;
- full rehearsal scope deferred out of v0.28;
- no runtime/application/Rules changes were made by that planning checkpoint.

### 28B — scope reset to page inspection — COMPLETE
- confirms v0.28.0 is the owner-led page inspection/change version;
- creates `V028_PAGE_INSPECTION_PLAN.md`;
- moves complete season rehearsal planning to `V030_REHEARSAL_PLAN.md`;
- keeps production/Firebase/Rules behavior unchanged.

### 28C — first page inspection findings capture — COMPLETE
- Global/Home/Navigation/Log Activity/Progress review captured;
- inspection intentionally paused before the remaining pages to control backlog size;
- detailed requirements recorded in `V028_INSPECTION_FINDINGS.md`;
- theme-reactive assets and future MBTI-aware identity/motivation direction preserved.

### 28D1 — shared interaction + Home + Navigation + Log Activity — IMPLEMENTED / ACCEPTED
- package version advanced to 0.28.0;
- reusable currentColor SVG icons and theme-aware interaction glow added;
- accepted Home/Dashboard changes implemented, including MBTI-aware avatar and gentle MBTI-aware transmission preference;
- desktop/mobile Navigation changes implemented, including direct Seasons/Houses mobile access and concise stat labels;
- Today/Yesterday logging and accepted Log Activity presentation/copy changes implemented;
- final logo/favicon artwork remains deferred;
- owner visual/responsive acceptance completed before the Progress implementation pass.

### 28D2 — Progress and progression expansion — IMPLEMENTED / ACCEPTED
- desktop Progress tabs and hierarchy cleaned up with explicit responsive transitions;
- 86 deterministic achievements with visible/hidden support and configured XP difficulty tiers;
- category-specific milestone families cover every activity category plus completed books;
- achievement XP is included in personal progression while remaining separate from competitive points;
- Level 100 is capped behind 354,420 lifetime XP with progressively increasing per-level requirements;
- 21 escalating title bands run from Initiate to Living Legend;
- next visible milestone per family is prioritised, while completed achievements are collapsed;
- detailed balance/configuration is recorded in `V028_PROGRESSION_EXPANSION.md`;
- owner visual/responsive review completed through the accepted 28D2A/28D2B refinements.

### 28D3 — reviewed surfaces + Seasons polish — IMPLEMENTED / OWNER REVIEW PENDING
- simplify Dashboard progression preview and compact the ordinary-phone Welcome Card layout;
- complete the generic currentColor navigation icon set and simplify More-menu information architecture;
- remove duplicate Log Activity instructions and duplicate Progress percentage labels;
- reframe Seasons as the competition arena with concise tabs, richer roster cards, role-aware context and player-facing rule cleanup;
- preserve all scoring, lifecycle, House movement, evidence authority and Rules semantics;
- record broad CSS consolidation for v0.31 instead of mixing it into this checkpoint;
- perform no Firebase deployment.

### 28D3A — Seasons workspace cleanup — IMPLEMENTED / OWNER REVIEW PENDING
- separate Browse from focused season detail;
- reduce repeated season summary layers;
- make Command Centre attention-first with secondary operational disclosures;
- make Power Play setup one-editor-at-a-time;
- switch Standings between Individual and Houses;
- separate Honours families and prioritise Evidence working state;
- organise Create Season into four visual stages;
- preserve gameplay, authority, Firestore Rules and deployment boundaries.

### 28R — release freeze
- full application regression;
- production build verification;
- confirm page-inspection acceptance closure.

## v0.29.0 — Friend / external feedback pass
- let an external user/friend review the app;
- sort feedback into accept / modify / reject;
- implement accepted changes;
- freeze only after the feedback pass is integrated.

## v0.30.0 — Complete league-season rehearsal
- safe local/emulator rehearsal environment;
- canonical synthetic season;
- deterministic happy path;
- adversarial weekly operations;
- trusted closeout, recovery and rehearsal acceptance;
- release freeze only after the complete-season rehearsal passes.

## v0.31.0 — Cleanup, polish and hardening
- remove awkward or stale code paths;
- fix small inconsistencies exposed by earlier versions;
- improve polish, accessibility, performance and documentation;
- consolidate layered version-specific CSS overrides in oversized surfaces such as Progress and AppShell, removing obsolete selectors only after the page-inspection/rehearsal work is stable;
- rerun relevant rehearsal coverage if any late change touches season-critical logic.

Only after v0.30.0 rehearsal and v0.31.0 cleanup should the project even be considered for a v1.0 candidate, and only with explicit approval.

## Confirmed inactive/rejected mechanics
- Diamonds, player prices and the old transfer-market model remain rejected.
- Original one-player-per-House immunity remains replaced by the one-week post-move stability rule.
- Five Fires is removed from the planned product.
- Buddy Bonuses are removed from the planned product.
