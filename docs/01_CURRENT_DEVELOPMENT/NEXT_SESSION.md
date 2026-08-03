# Next Session

Current release: v0.15.0  
Status: Production deployed; documentation sync and Git commit pending

## Immediate required sequence

1. Apply the v0.15.0 deployment documentation sync.
2. Review `git status`.
3. Commit all v0.15.0 source and documentation changes.
4. Confirm the working tree is clean.
5. Do not create a v1.0 tag.

Recommended commit message:

```powershell
git add -A
git commit -m "release: deploy v0.15.0 navigation analytics refinement"
git status
```

## Verified release state

- 66 domain tests passed.
- 25 Firestore Rules tests passed.
- ESLint and production build passed.
- Release-readiness confirmed Hosting target `app`.
- Frontend deployed to `https://champions-legacy-challenge.web.app`.
- Firestore Rules were unchanged by v0.15.0.
- Full manual visual and end-to-end review remains deferred by product-owner decision.

## Recommended next development phase

A future v0.16.0 should prioritise pre-v1.0 platform foundations that do not depend on unconfirmed competition rules:

- first-use onboarding;
- privacy and support content;
- personal-data export and account deletion;
- personal-history pagination;
- measured bundle/performance optimisation.

Trusted server-side contribution recalculation is required before prize-bearing competition and may need separate infrastructure/cost decisions.

## Confirmed product rule

Pocket Week is one seven-day window immediately before a season. It does not recur every challenge week.

## Product questions still open

Power Plays, Diamonds, player prices, House Immunity, full Transfer Market, Buddy Bonuses, Five Fires and late-season twists. Do not implement them without explicit decisions. Do not create v1.0 without explicit approval.
