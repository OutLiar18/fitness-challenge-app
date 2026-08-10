# Champions Legacy Challenge — Roadmap

<!-- RELEASE_STATUS: DEVELOPMENT -->
Last updated: 10 August 2026

## Current production — v0.24.0

v0.24.0 remains the verified production baseline. Its Firestore Rules and Hosting release were activated and independently verified on 9 August 2026. Production must not be changed by ordinary development checkpoints.

## Current development — v0.25.0

### 25A — Existing-app correctness foundations

- snap route/navigation changes to the top of the page;
- make `Log activity` use its green navigation treatment only while that route is active;
- label the shell lifetime score as `total points`;
- move Champion Transmission into the welcome area and make message cycling more discoverable;
- expand the built-in motivational message library;
- remove the redundant Dashboard four-stat summary;
- remove the redundant Profile PageHeader icon block while retaining the actual profile identity/avatar section;
- keep all touched layouts responsive even though dedicated mobile/tablet visual acceptance remains scheduled for v0.27.0.

### 25B — MBTI-based player profiles

- replace the generic Legacy Avatar catalogue with 16 MBTI-based profiles;
- let players directly select a known MBTI type;
- when unsure, offer a 12-question in-app quick estimate using three questions per E/I, S/N, T/F and J/P dimension;
- show the estimated dimensions and require the player to review/select the suggested type rather than silently assigning it;
- offer an external link to 16Personalities for a longer personality test, after which the player manually selects the result;
- store only the selected type/source in the player profile while keeping profile definitions, guidance and artwork in the frontend;
- provide strengths, possible challenges, category/thriving suggestions and interpersonal tendencies as guidance rather than deterministic psychological claims.

### 25C — Safe Platform Administrator deletion/recovery behaviour

- define hard-delete versus archive/anonymise boundaries before implementation;
- permit true deletion only where historical/relational integrity remains safe;
- handle Authentication-user deletion through trusted administrator tooling rather than exposing destructive credentials to the browser;
- preserve immutable competition history where erasing it would corrupt season facts;
- test destructive paths separately and aggressively.

### 25D — League Season bonus points

- Platform Administrators may directly award a player bonus points with a mandatory reason;
- the same approved amount is credited to the player's House for that league season;
- the House attribution is frozen at award/approval time and later movement cannot rewrite it;
- League Administrators may submit a scoped bonus request with a mandatory reason but cannot alter competitive totals directly;
- Platform Administrators are notified and must approve or reject League Administrator requests;
- approval atomically creates the player award, matching House contribution and immutable audit history;
- mistakes are corrected by a separate positive/negative adjustment rather than rewriting an existing award.

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
