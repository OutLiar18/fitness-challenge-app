# Champions Legacy Challenge — Next Session

<!-- RELEASE_STATUS: VERIFIED_PRODUCTION -->
Current source: v0.27.0 release finalised
Current production: v0.27.0

## First action

Begin v0.28.0 complete league-season rehearsal from the finalised v0.27.0 production baseline. Do not modify or retag the frozen `v0.27.0` deployed source.

## v0.25.0 order

1. 25A existing-app correctness foundations — complete.
2. 25B MBTI-based player profiles — complete.
3. 25C safe deletion/recovery behaviour — complete.
4. 25D League Season bonus points — complete.
5. 25R consolidated release-readiness freeze — complete.
6. Production Firestore Rules activation and independent remote hash verification — complete.
7. Production Hosting activation — complete.
8. Automated and logged-in manual production smoke — complete.
9. Documentation/tag/main finalisation — complete after this checkpoint.

## 25B completed product direction

- exactly 16 personality profiles corresponding to MBTI type codes;
- direct selection when the player knows their type;
- `unsure / don't know` offers a 12-question quick estimate with three original questions per MBTI dimension;
- the estimate shows response leans and requires the player to review/select the suggested type rather than silently assigning it;
- an external link opens the current 16Personalities free personality test, after which the player returns and manually selects the result;
- only the selected `mbtiType` is persisted; profile definitions, guidance and emblem artwork remain local to the frontend;
- strengths, possible challenges, helpful Challenge approaches and interpersonal tendencies are explicitly framed as reflective guidance rather than deterministic psychological claims;
- legacy avatar data remains readable only for backward compatibility and is no longer the primary profile-selection experience.

## 25C completed safety boundary

Platform Administrators may hard-delete only empty Houses and zero-participant seasons that are still drafts. Draft season deletion removes its draft Houses and closed invitation record atomically and preserves a deterministic audit event. League Administrators cannot hard-delete. Once registration opens, the season and Houses are historical structures and remain protected. User Authentication deletion stays in the trusted Admin SDK workflow.

## 25D completed competition boundary

League Administrators may submit reasoned bonus requests only for active players in seasons they administer. Platform Administrators receive pending-review attention, approve/reject requests, may award directly, and may create separate corrective adjustments. Awards flow through a dedicated immutable season-bonus contribution ledger, bypass daily activity caps/participation/Power Plays, credit the player and award-time House equally, and preserve that historical House through later movement or correction.

## Responsive boundary

27G responsive/accessibility acceptance, 27R release freeze, production Hosting activation and authenticated production smoke are complete. v0.27.0 is closed.

## Verified v0.25.0 production baseline

- deployed application source: `1e11f5ff8ca5af7e9d758f62b9d377e1c6ddd94d`;
- Firestore Rules SHA-256: `17217b471feb4f7e2db3df72b9456cc64e1451eb2c529228490b6ef8e47f376e`;
- active Ruleset: `projects/fitnesschallengeapp-9e87f/rulesets/9e476b71-9b9b-4b05-bedd-5bc3b1932d2d`;
- Hosting: `https://champions-legacy-challenge.web.app`;
- final gate: 148 application tests and 94 Firestore Rules tests;
- automated Hosting smoke: live index and 16 referenced assets matched; 10/10 critical SPA routes passed;
- logged-in manual smoke: passed on 10 August 2026;
- known non-blocking build warning: Firebase vendor chunk about 575.67 kB, deferred to v0.27.0.

## v0.26.0 security workflow

26A is discovery-only: no Rules policy changes, no App Check enforcement, no dependency auto-fix and no Firebase deployment. Later remediation checkpoints must keep Firestore Rules/security-sensitive changes isolated and emulator-tested.

## Checkpoint 26B authority contract

Platform Administrator authority is canonical in the trusted Firestore profile role. A Firebase Auth custom claim named `admin` is no longer accepted by Firestore Rules or client navigation as an alternative authority source. This removes stale-claim privilege persistence after an audited role demotion.

## Checkpoint 26C League Administrator scope

The global `leagueAdmin` profile role is intentionally a bootstrap/operator role for creating a new league and invite. It does not imply cross-league authority. Existing-league permissions continue to resolve from the target league's `administratorIds`, and the Rules suite now proves that a global League Administrator cannot read a foreign private draft or self-assign into it.

## Checkpoint 26D dependency outcome

Production dependencies remain at zero known npm vulnerabilities. The development/tooling tree was remediated only through npm-compatible lockfile changes with no `--force` and no direct dependency specification changes. See `V026_DEPENDENCY_AUDIT.md` for exact before/after packages and residual advisory status.

## Deferred infrastructure

App Check enforcement and an explicit CSP are deferred until the app's scale/risk justifies them. The detailed 26E research remains in Git history, but the active readiness artifact/guard is removed from the normal development branch by 26I.

## Checkpoint 26F trusted account-deletion recovery

Trusted deletion now freezes a private local recovery plan before processing begins and binds its SHA-256 into the execution record. Phase/batch progress is persisted, and retries replay the original document path set instead of silently rebuilding a smaller plan from already-anonymised data. A missing or mismatched recovery plan blocks further mutation. See `V026_ACCOUNT_DELETION_RECOVERY.md`.

## Deferred advanced Firestore recovery

Google Cloud CLI/IAM/PITR inventory, backup-schedule work and automated restore planning are deferred until the project genuinely needs enterprise-style disaster recovery. The 26G implementation remains recoverable from Git history but is removed from the active repo by 26I.

## Checkpoint 26I practical closeout

26I keeps the protections that matter now and removes unnecessary active infrastructure. Firestore Rules retain every real gameplay/security contract while dropping redundant retired Team/reviewer blocks and read aliases. The final recursive deny-all remains authoritative for retired paths. The next step is the v0.26 release gate, not more infrastructure work.

## Checkpoint 26R release freeze

26R freezes the completed 26I source and practical security contract. The candidate Rules SHA is `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`; all 98 Rules tests plus the complete application/build gate are release blockers. Only release docs/verifier may differ from the frozen 26I source before activation. No Firebase deployment occurs in 26R.

## v0.26.0 release closure

Production activation completed successfully from `c057fca0598fe4a07ff101ea13808f1da8918aa8`. Rules SHA `35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e` was released, Hosting target `app` was released, 10/10 SPA routes and 16 referenced assets matched the frozen build, and the repository stayed clean. Tag `v0.26.0` points to the exact deployed commit. v0.26 is closed; do not resume deferred App Check/CSP/Google Cloud DR work during v0.27 unless the project's real scale changes.

## Checkpoint 27A UX audit

27A is documentation/audit only. It records the full static route/page/CSS/bundle inventory in `V027_UX_AUDIT.md`. The implementation order is 27B shell/design system → 27C core player loop → 27D progress/communication → 27E Houses/Seasons → 27F Admin/reference → 27G performance/full responsive-accessibility acceptance → 27R release freeze. Enterprise App Check/CSP/Google Cloud DR work remains deferred.

## Checkpoint 27B design-system foundation

27B is shared presentation work only. The application version is now 0.27.0. Blood red is the primary identity across accessible light/dark token sets; black/charcoal anchors the dark theme; gold remains restrained achievement emphasis. Shared cards/buttons/forms/PageHeader/WorkspaceTabs and the desktop/tablet/mobile shell are visually standardised. Primary shell microcopy is made materially more readable while existing navigation/focus/reduced-motion behaviour stays intact. Firestore Rules remain unchanged. See `V027_DESIGN_SYSTEM.md`.

## Checkpoint 27C core player journey

27C completes the Dashboard → Log Activity → Journal UX pass. Goals now appear before lower-frequency progression/insight content, Journal has a direct Dashboard route and URL-backed tab state, validation errors receive focus, editable entry deletion uses the new accessible ConfirmDialog instead of browser confirmation, and Journal empty/history states are more actionable and human-facing. Firestore Rules and all scoring/evidence/data semantics remain unchanged. See `V027_CORE_PLAYER_JOURNEY.md`.

## Checkpoint 27D personal experience

27D completes the Progress, Analytics, Profile, Inbox and Legacy Coach UX pass. Personal workspace state is URL-backed, Analytics data visuals use semantic list structures rather than flattening visible values behind a single image role, Progress/Analytics have useful recovery states, Profile errors receive focus, Inbox reuses shared keyboard-accessible WorkspaceTabs, and Coach saving/empty states are explicit. All underlying statistics, profile, messaging, coaching and Rules behavior remains unchanged. See `V027_PERSONAL_EXPERIENCE.md`.

## Checkpoint 27E competition workspaces

27E completes the Houses and Seasons UX pass. House/season workspaces are deep-linkable through URL presentation state, House roster/card and standings presentation are extracted from the oversized routes, both competition pages expose concise role/context summaries, and remaining browser confirm/prompt flows are replaced with the accessible ConfirmDialog while preserving typed DELETE for unused draft-season deletion. Competition services, calculations, movement/rest, evidence, Power Plays, bonus, history and Rules semantics remain unchanged. See `V027_COMPETITION_WORKSPACES.md`.

## Checkpoint 27F admin/reference/support

27F completes broad page-level UX work before final acceptance. Admin/reference/support/Pocket workspaces are deep-linkable, Rulebook filtering is URL-backed and recoverable, trusted-role changes use the accessible confirmation pattern, Help failures receive focus, long-form references and dense admin/Pocket controls meet the shared readability/touch treatment, and future pages clearly remain previews. All authority, scoring, Pocket, account and Rules semantics remain unchanged. See `V027_ADMIN_REFERENCE_SUPPORT.md`.

## Checkpoint 27G automated performance/acceptance gate

27G keeps Firebase's modular SDK and route-level lazy loading, but stops forcing the entire Firebase SDK into one oversized manual chunk by adding a Rolldown max-size target. The normal application check now enforces bundle and accessibility/responsive foundations and generates an automated report. The authenticated manual matrix in `V027_PERFORMANCE_ACCEPTANCE.md` has now been accepted. v0.27.0 is finalised and tagged at its exact deployed source. Do not reopen broad v0.27 visual work; continue with the planned v0.28.0 complete league-season rehearsal.
