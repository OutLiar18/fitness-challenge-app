# Champions Legacy Challenge — v0.27.0 Release Candidate

Date: 11 August 2026
Release stage: 27R — VERIFIED / ACTIVATION PENDING
Production baseline: v0.26.0

## Frozen accepted source

The v0.27.0 runtime/application release candidate is frozen from the manually accepted
27G source:

`ad92777cfa86481002639297ce8c7dce69b0e269`

Only release documentation, the 27R verifier, the development deployment blocker,
the 27G acceptance-status regression and release-only npm script wiring may differ
from that accepted runtime baseline before production activation.

## 27G acceptance

- Automated application acceptance: PASS.
- Full application regression: **188/188 application tests**.
- Production build: PASS.
- 27G automated acceptance: PASS.
- 27G manual authenticated visual acceptance: PASS.
- Manual acceptance was explicitly accepted on 11 August 2026 after the final
  crimson/black visual closeout and same-page tab-scroll verification.

## Firestore Rules

Canonical candidate SHA-256:

`35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e`

This is byte-for-byte identical to the verified v0.26.0 production Rules source.

The existing Rules suite still contains 98 tests. Because Rules did not change during
v0.27, 27R verifies the exact Rules hash rather than rerunning the emulator suite.
Any unexpected Rules hash change is a hard stop and requires a separate isolated
Rules regression before release work continues.

## 27R release gate

The release gate requires:

1. lint;
2. all 188 application tests;
3. production build;
4. 27G automated performance/accessibility acceptance;
5. exact accepted-source boundary verification;
6. exact unchanged Firestore Rules hash;
7. verified Firebase project/Hosting mapping;
8. explicit recorded manual 27G acceptance;
9. blocked development production/finalisation scripts.

## Production boundary

Development deployment and release-finalisation npm scripts remain blocked.

27R performs **NO FIREBASE DEPLOYMENT**.

After 27R is committed and pushed, production activation must use a
**separate reviewed production activation runner** pinned to the exact 27R commit.

Because v0.27 does not change Firestore Rules, the production activation stage should
treat Hosting as the intended changed deployment surface and independently verify that
the active Rules source still matches the canonical unchanged SHA before and after
activation.
