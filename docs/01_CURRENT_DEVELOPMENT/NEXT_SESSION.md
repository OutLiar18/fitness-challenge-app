# Champions Legacy Challenge — Next Session

<!-- RELEASE_STATUS: VERIFIED_PRODUCTION -->
Current source: v0.25.0 release finalised
Current production: v0.25.0

## First action

Start v0.26.0 security and operational hardening from the verified v0.25.0 production baseline. Create the next development branch from updated `main`; do not modify or retag the frozen v0.25.0 release source.

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
