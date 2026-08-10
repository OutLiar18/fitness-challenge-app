# Champions Legacy Challenge — Current State

<!-- RELEASE_STATUS: DEVELOPMENT -->
Source version: 0.25.0 development
Production version: 0.24.0
Last updated: 10 August 2026
Status: Active pre-v1.0 development

## Production baseline

v0.24.0 remains live and verified on Firebase Hosting with the byte-verified v0.24.0 Firestore Rules active in production. Production release evidence remains in `docs/07_HISTORY/V0240_PRODUCTION_RELEASE.md`.

## v0.25.0 development scope

The competition roadmap has been simplified. Five Fires and Buddy Bonuses are removed. v0.25.0 is now focused on existing-app correctness, MBTI-based player profiles, safe administrator deletion/recovery semantics and League Season bonus-point administration.

### Checkpoint 25A — existing-app correctness foundations

- route/navigation changes return the page to the top;
- `Log activity` no longer receives a permanent green accent when inactive;
- the shell lifetime score is explicitly labelled `total points`;
- Champion Transmission is integrated into the welcome area with a prominent message-cycle action;
- the motivational library is expanded;
- the redundant four-stat Dashboard summary is removed;
- the Profile PageHeader no longer renders a redundant identity icon block;
- Summit Falcon uses a broadly supported temporary eagle symbol until the generic avatar system is replaced in 25B;
- all touched layouts retain responsive breakpoints.

25A does not modify Firestore Rules and does not deploy anything.

### Next — 25B MBTI identity system

The generic avatar catalogue will be replaced by 16 MBTI-based profiles. Players who do not know their type may use a 12-question in-app rough estimate or follow a link to 16Personalities for a longer external test, then confirm/select their profile.

### Later v0.25 work

- 25C: safe Platform Administrator deletion/recovery behaviour;
- 25D: League Season bonus points where Platform Administrators can award directly and League Administrators can only request, with Platform review required before points are applied to the player and their House.

## Responsive development boundary

Current manual observations are desktop-first. Dedicated mobile/tablet visual acceptance is deferred to v0.27.0, but responsiveness remains a non-negotiable requirement for every earlier change.

## Production boundary

No v0.25 checkpoint may change production unless it reaches a dedicated reviewed release-activation stage. Development-repository production deployment scripts remain blocked.
