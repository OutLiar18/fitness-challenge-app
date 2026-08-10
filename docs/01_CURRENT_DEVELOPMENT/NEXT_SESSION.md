# Champions Legacy Challenge — Next Session

<!-- RELEASE_STATUS: DEVELOPMENT -->
Current source: v0.25.0 development
Current production: v0.24.0

## First action

Continue from the latest clean v0.25.0 checkpoint. Do not modify production.

## v0.25.0 order

1. Complete/review 25A existing-app correctness foundations.
2. Build 25B MBTI-based player profiles.
3. Define and implement 25C safe deletion/recovery behaviour.
4. Implement 25D League Season bonus points and its isolated Firestore Rules/tests.

## 25B locked product direction

- exactly 16 personality profiles corresponding to MBTI type codes;
- direct selection when the player knows their type;
- `unsure / don't know` offers a 12-question quick estimate (three questions per MBTI dimension);
- the estimate is guidance only and the player confirms/selects the final profile;
- offer a link to 16Personalities for a more detailed external test;
- profile guidance should describe tendencies, strengths, possible challenges, helpful approaches and interpersonal compatibility carefully rather than presenting personality predictions as certainty;
- keep profile definitions and artwork local to the frontend to avoid Firebase Storage/quota complexity.

## Responsive boundary

The developer is currently reviewing desktop. Dedicated mobile/tablet visual review is deferred to v0.27.0, but all new components must remain responsive and must not introduce desktop-only assumptions.
