# Champions Legacy Challenge — Current State

<!-- RELEASE_STATUS: DEVELOPMENT -->
Source version: 0.26.0 development
Production version: 0.25.0
Last updated: 10 August 2026
Status: Active pre-v1.0 security and operational hardening

## Production baseline

v0.25.0 is live and verified on Firebase Hosting with independently verified v0.25.0 Firestore Rules active in production. Production release evidence is recorded in `docs/07_HISTORY/V0250_PRODUCTION_RELEASE.md`.

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

### Next action
Review the 26A findings and select the first isolated remediation checkpoint.

## Responsive development boundary

Current manual observations are desktop-first. Dedicated mobile/tablet visual acceptance is deferred to v0.27.0, but responsiveness remains a non-negotiable requirement for every earlier change.

## Production boundary

v0.25.0 production activation is complete and verified. Development-repository production deployment scripts remain blocked; every later production change still requires its own dedicated reviewed release stage.
