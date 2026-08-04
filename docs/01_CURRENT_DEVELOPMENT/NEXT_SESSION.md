# Next Session

Current production: v0.17.0  
Status: Automated verification and production deployment complete; documentation sync and release commit pending

## Immediate required sequence

Apply the v0.17.0 deployment documentation synchronisation package, then commit:

```powershell
cd C:\Users\Kylep\fitness-tracker
git status
git add -A
git commit -m "release: deploy v0.17.0 player readiness and account control"
git status
```

The final `git status` should report a clean working tree. Do not create a v1.0 tag.

## Release evidence

- 71 domain tests passed.
- 30 Firestore Rules tests passed.
- ESLint passed without warnings.
- Vite production build passed.
- Release-readiness confirmed v0.17.0 on Hosting target `app`.
- Firestore Rules compiled and deployed successfully.
- Firebase Hosting deployed 62 frontend files successfully.
- Two React Router React Server Components advisories remain reviewed and non-blocking for this client-rendered Vite app. Do not run `npm audit fix --force`.

## Delivered scope

- New-player onboarding with legacy-profile compatibility.
- Help & Privacy route and navigation integration.
- On-demand personal JSON export.
- Account deletion request/cancel/reopen workflow.
- Audited administrator acknowledgement queue.
- Own-vote and own-error-report read access for export.
- No scoring or competition-history change.

## Guardrails

Account-request acknowledgement must never be described as completed deletion. Do not implement Power Plays, Diamonds, player prices, House Immunity, the full Transfer Market, Buddy Bonuses, Five Fires or late-season twists without explicit decisions.
