# Champions Legacy Challenge — Current State

<!-- RELEASE_STATUS: RELEASED -->
Source version: 0.27.0 development
Production version: 0.26.0
Last updated: 11 August 2026
Status: v0.27 UX/accessibility/performance phase active after 27A audit

## Production baseline

v0.26.0 is live and verified on Firebase Hosting. The exact deployed/tagged source is `c057fca0598fe4a07ff101ea13808f1da8918aa8`; Firestore Rules SHA-256 is `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`. The later documentation-finalisation commit is `fc3a93d1b2702ab8672ce89ec9966024564c9282`.

## v0.25.0 development scope

The competition roadmap has been simplified. Five Fires and Buddy Bonuses are removed. v0.25.0 is focused on existing-app correctness, MBTI-based player profiles, safe administrator deletion/recovery semantics and League Season bonus-point administration.

### Checkpoint 25A — existing-app correctness foundations — complete
- route/navigation changes return the page to the top;
- `Log activity` no longer receives a permanent green accent when inactive;
- the shell lifetime score is explicitly labelled `total points`;
- Champion Transmission is integrated into the welcome area with a prominent message-cycle action;
- the motivational library is expanded;
- the redundant four-stat Dashboard summary is removed;
- the Profile PageHeader no longer renders a redundant identity icon block;
- all touched layouts retain responsive breakpoints.

### Checkpoint 25B — MBTI Legacy Profiles — complete
- 16 local MBTI-based Legacy Profiles replace generic avatar selection as the primary player identity experience;
- players may select a known type directly;
- unsure players may take a 12-question quick estimate using three questions per E/I, S/N, T/F and J/P dimension;
- the estimate shows answer leans and suggests a type, but the player must choose the final profile;
- players may open the current 16Personalities free test externally and return to select their result;
- profile guidance includes strengths, watch-outs, Challenge approaches and potentially complementary profiles with explicit non-deterministic wording;
- only optional `mbtiType` is added to the player document; questions, scoring, guidance and emblem artwork remain local frontend code;
- legacy avatar data remains available for backwards compatibility until a player chooses an MBTI profile;
- responsive layouts are included for profile selection and the quick-test flow.

25B changes Firestore Rules only to permit and validate the optional player-owned `mbtiType` field. It does not change scoring, league permissions, evidence authority, House history or production Firebase state.

### Checkpoint 25C — safe deletion/recovery — complete
- only Platform Administrators receive browser hard-delete controls;
- an empty House may be deleted only inside an unused zero-participant draft season;
- an unused draft season deletion atomically removes its draft Houses and invitation record and creates an immutable audit event;
- League Administrators cannot hard-delete Houses or seasons;
- registration, active, completed and archived seasons remain protected historical structures;
- player Authentication deletion stays in the trusted Admin SDK workflow and preserves/anonymises competition facts where required.

### Checkpoint 25D — League Season bonus points — complete
- Platform Administrators can award directly with a mandatory reason;
- League Administrators can submit scoped requests only, with Platform review required before standings change;
- pending League Administrator requests surface as Platform Admin Inbox attention and in the season review workspace;
- every awarded point is written through the immutable contribution ledger and credited equally to the player and the House captured at award/approval time;
- League Season bonus points bypass ordinary activity caps, participation bonuses and Power Play multipliers and do not create category champion titles;
- corrections are separate positive/negative adjustments that preserve the original award's House attribution.

### Checkpoint 25R — release-readiness freeze — complete
- the completed 25A–25D application source is frozen at commit `0f5b715e4888d12ddc53ede334a9cfe13c5e2048`;
- the v0.25 release verifier now requires 148 application tests and 94 Firestore Rules tests;
- all application/Rules source outside release documentation and the verifier must remain identical to the frozen 25D baseline;
- production deploy scripts remain blocked and 25R performs no Firebase activation.

### Production activation — complete
- exact deployed application source: `1e11f5ff8ca5af7e9d758f62b9d377e1c6ddd94d`;
- active Cloud Firestore Ruleset: `projects/fitnesschallengeapp-9e87f/rulesets/9e476b71-9b9b-4b05-bedd-5bc3b1932d2d`;
- canonical local and active Rules SHA-256: `17217b471feb4f7e2db3df72b9456cc64e1451eb2c529228490b6ef8e47f376e`;
- Firebase Hosting target `app` released 66 files to `champions-legacy-challenge`;
- live `index.html` SHA-256 `e40e19fbf102ab066a4394604d8c108f437d85032e8aafbb8be5d0f75c06571a` matched the frozen build;
- 16 referenced live assets matched the frozen build and 10/10 critical SPA routes passed;
- logged-in manual production smoke passed on 10 August 2026 with no unnecessary competition test data created.

### v0.26.0 — security and operational hardening

#### Checkpoint 26A — security baseline
- create `development/v0.26.0` from finalised v0.25 `main`;
- preserve v0.25.0 as the production baseline;
- inventory administrator authority and role sources without changing them;
- inventory public/private Firestore reads and retain the deny-all fallback;
- record Rules size/complexity signals before simplification;
- check whether App Check/client attestation is integrated, but do not enable enforcement yet;
- capture dependency advisories and outdated-package information without automatic fixes;
- review trusted account-deletion/recovery safeguards and partial-failure exposure;
- inventory Hosting security headers and deployment protections;
- run the existing application + Firestore Rules gates;
- perform no Firebase deployment.

#### Checkpoint 26B — canonical Platform Administrator authority
- Firestore `users/{uid}.role == "admin"` is the single Platform Administrator authority source;
- stale or legacy Firebase Auth `admin:true` custom claims do not grant Platform Administrator access;
- client UI gating uses the same trusted profile-role contract as Firestore Rules;
- the full Rules suite exercises profile-role administration without relying on an admin custom claim;
- audited Platform Administrator role changes remain supported for other users;
- self-role changes remain denied;
- existing v0.25 production remains unchanged until a later dedicated v0.26 release activation.

#### Checkpoint 26C — League Administrator scope contract
- global `leagueAdmin` profile status remains a bounded bootstrap capability for creating a new league and its matching invite;
- the creator must become the new league's sole initial administrator;
- existing-league operational authority remains scoped through that league's `administratorIds`;
- a global League Administrator cannot read another administrator's private draft solely because of the global role;
- a global League Administrator cannot self-assign into another league;
- Firestore Rules are unchanged from 26B and the canonical 26B Rules hash remains frozen locally;
- no Firebase deployment.

#### Checkpoint 26D — development dependency advisory remediation
- production dependency vulnerabilities remain at zero;
- compatible remediation was generated outside the real repository with `npm audit fix --package-lock-only` and no `--force`;
- direct dependency specifications remain unchanged;
- the candidate lockfile was installed/tested from scratch in a detached worktree before acceptance;
- 1 of 7 development/tooling advisories were cleared; 6 lower-severity advisories remain documented;
- Firestore Rules remain unchanged from 26B/26C;
- no Firebase deployment.

#### Deferred infrastructure — App Check/CSP
- App Check enforcement and an explicit CSP are not required for the current friends-scale challenge;
- the 26E research remains available in Git history if the app later becomes public at materially larger scale;
- active App Check/CSP readiness tooling is removed in 26I;
- existing low-cost Hosting security headers remain in place;
- no Firebase deployment.

#### Checkpoint 26F — trusted account-deletion interruption recovery
- every new trusted deletion writes a private local recovery plan before Firebase mutation begins;
- the recovery plan freezes the exact planned document path/mode set, original fingerprint, identities, counts and league participant decrements;
- the execution record stores the recovery-plan version, SHA-256, operation count, phase and batch progress;
- a processing/failed execution can resume only when the original recovery plan validates against the request and execution record;
- already-deleted records and same-execution anonymised records are replay-safe;
- missing anonymisation targets or records stamped by another execution fail closed;
- Auth disable/token revocation remain before Firestore mutation and Auth deletion remains after Firestore completion;
- no trusted deletion is executed by the checkpoint runner;
- Firestore Rules remain unchanged;
- no Firebase deployment.

#### Deferred infrastructure — advanced Firestore disaster recovery
- Google Cloud CLI/IAM/PITR/backup-schedule inventory and automated restore planning are deferred until scale or real operational need justifies them;
- the 26G research remains recoverable from Git history;
- active Firestore recovery planner/test tooling is removed in 26I;
- account-deletion recovery remains because account deletion is a real app workflow;
- no restore, backup configuration change or Firebase deployment.

#### Checkpoint 26I — practical security + Rules simplification
- remove redundant explicit deny blocks for retired permanent Teams; the recursive deny-all fallback continues to reject those paths;
- fully retire the old evidence-reviewer collection from client Rules, also relying on recursive deny-all;
- replace two one-line league-read aliases with the existing league-scoped administrator helper;
- remove active App Check/CSP readiness and advanced Firestore recovery-planner artifacts from the working repo;
- preserve Platform Admin authority, League Admin scoping, evidence decisions, Houses, movement/rest, Power Plays, bonus points and trusted account-deletion safety;
- run the complete application and Firestore Rules regression gates;
- perform no Firebase deployment.

#### Checkpoint 26R — v0.26 release-readiness freeze
- freeze application/security source at completed 26I commit `909fe8938237c70b69aab1d72a2fef9ee2780e37`;
- pin Firestore Rules SHA-256 `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`;
- require the complete application/build gate and all 98 Firestore Rules tests;
- allow only release documentation and the release verifier to differ from 26I before activation;
- keep development deployment scripts blocked;
- perform no Firebase deployment.

#### v0.26.0 production activation — COMPLETE
- exact deployed/tagged commit: `c057fca0598fe4a07ff101ea13808f1da8918aa8`;
- Firestore Rules SHA-256: `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`;
- Firestore Rules deployment: successful;
- Hosting target `app` → site `champions-legacy-challenge`: successful;
- live verification: 10/10 SPA routes and 16/16 referenced assets matched the exact local build;
- working tree remained clean;
- advanced App Check/CSP and Google Cloud disaster-recovery infrastructure remain deferred until scale requires them.

### v0.27.0 — UX/accessibility/performance
#### Checkpoint 27A — full application audit — COMPLETE
- inventory route/page/component/CSS complexity without changing application behaviour;
- preserve route-level lazy loading and existing accessibility foundations;
- identify readability/design-system consistency as the first shared concern;
- prioritize the Dashboard → Log Activity → Journal loop before lower-frequency screens;
- identify Houses and Seasons as the largest presentation workspaces and plan task-focused decomposition;
- keep the Firebase vendor chunk warning for a focused 27G performance pass;
- record the complete prioritized plan in `V027_UX_AUDIT.md`;
- perform no Firebase deployment.

### Next action
Checkpoint 27B: establish the v0.27 design-system and application-shell foundation, including the approved dark blood-red/black Champions Legacy direction, accessible colour/type tokens, readable microcopy, consistent interaction primitives and responsive shell polish. Do not change gameplay, scoring, Firestore Rules or competition semantics.

## Responsive development boundary

Current manual observations are desktop-first. Dedicated mobile/tablet visual acceptance is deferred to v0.27.0, but responsiveness remains a non-negotiable requirement for every earlier change.

## Production boundary

v0.25.0 production activation is complete and verified. Development-repository production deployment scripts remain blocked; every later production change still requires its own dedicated reviewed release stage.
