# Champions Legacy Challenge — Next Session

<!-- RELEASE_STATUS: DEVELOPMENT -->
Current source: v0.25.0 development
Current production: v0.24.0

## First action

Begin 25C by defining safe Platform Administrator deletion/recovery boundaries before changing destructive permissions. Do not modify production.

## v0.25.0 order

1. 25A existing-app correctness foundations — complete.
2. 25B MBTI-based player profiles — complete.
3. Define and implement 25C safe deletion/recovery behaviour.
4. Implement 25D League Season bonus points and its isolated Firestore Rules/tests.

## 25B completed product direction

- exactly 16 personality profiles corresponding to MBTI type codes;
- direct selection when the player knows their type;
- `unsure / don't know` offers a 12-question quick estimate with three original questions per MBTI dimension;
- the estimate shows response leans and requires the player to review/select the suggested type rather than silently assigning it;
- an external link opens the current 16Personalities free personality test, after which the player returns and manually selects the result;
- only the selected `mbtiType` is persisted; profile definitions, guidance and emblem artwork remain local to the frontend;
- strengths, possible challenges, helpful Challenge approaches and interpersonal tendencies are explicitly framed as reflective guidance rather than deterministic psychological claims;
- legacy avatar data remains readable only for backward compatibility and is no longer the primary profile-selection experience.

## 25C safety boundary

Before implementation, decide exactly which user, House and season states can be hard-deleted without damaging Authentication, memberships, contribution history, standings, honours or audit records. Historical competition facts must remain trustworthy.

## Responsive boundary

The developer is currently reviewing desktop. Dedicated mobile/tablet visual review is deferred to v0.27.0, but all new components must remain responsive and must not introduce desktop-only assumptions.
