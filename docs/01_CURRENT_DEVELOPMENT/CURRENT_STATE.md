# Champions Legacy Challenge — Current State

<!-- RELEASE_STATUS: DEVELOPMENT -->
Source version: 0.25.0 development
Production version: 0.24.0
Last updated: 10 August 2026
Status: Active pre-v1.0 development

## Production baseline

v0.24.0 remains live and verified on Firebase Hosting with the byte-verified v0.24.0 Firestore Rules active in production. Production release evidence remains in `docs/07_HISTORY/V0240_PRODUCTION_RELEASE.md`.

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

### Next v0.25 action
Run consolidated v0.25 application/Rules/release-readiness verification before any production activation.

## Responsive development boundary

Current manual observations are desktop-first. Dedicated mobile/tablet visual acceptance is deferred to v0.27.0, but responsiveness remains a non-negotiable requirement for every earlier change.

## Production boundary

No v0.25 checkpoint may change production unless it reaches a dedicated reviewed release-activation stage. Development-repository production deployment scripts remain blocked.
