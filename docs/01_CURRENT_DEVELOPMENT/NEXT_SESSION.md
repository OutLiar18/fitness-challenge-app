# Champions Legacy Challenge — Next Session

<!-- RELEASE_STATUS: DEVELOPMENT -->
Current source: v0.26.0 development
Current production: v0.25.0

## First action

Continue from completed Checkpoint 26F. Next design project-level Firestore backup/restore operator safeguards as a separate non-production checkpoint: backup provenance, target-project verification, restore dry-run/confirmation and recovery evidence. The trusted account-deletion processor now fails closed unless an interrupted execution has its original validated recovery plan. Keep v0.25.0 production frozen and do not deploy v0.26 Rules or Hosting changes without a dedicated reviewed activation stage.

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

The developer is currently reviewing desktop. Dedicated mobile/tablet visual review is deferred to v0.27.0, but all new components must remain responsive and must not introduce desktop-only assumptions.

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

## Checkpoint 26E App Check/CSP readiness

reCAPTCHA Enterprise is the preferred future App Check web provider. The rollout is intentionally staged: console registration, client integration with no enforcement, secure localhost/CI debug handling, monitoring, then separate enforcement. CSP must be derived after the App Check-enabled build exposes its real resource/origin needs and must be deployed separately from enforcement. See `V026_APP_CHECK_CSP_READINESS.md`.

## Checkpoint 26F trusted account-deletion recovery

Trusted deletion now freezes a private local recovery plan before processing begins and binds its SHA-256 into the execution record. Phase/batch progress is persisted, and retries replay the original document path set instead of silently rebuilding a smaller plan from already-anonymised data. A missing or mismatched recovery plan blocks further mutation. See `V026_ACCOUNT_DELETION_RECOVERY.md`.
