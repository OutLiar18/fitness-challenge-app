# Next Session

Current production: v0.16.0  
Status: Automated verification and Firebase Hosting deployment complete; documentation sync and release commit pending

## Immediate required sequence

Apply the v0.16.0 deployment documentation synchronisation package, then commit:

```powershell
cd C:\Users\Kylep\fitness-tracker
git status
git add -A
git commit -m "release: deploy v0.16.0 progressive disclosure workspaces"
git status
```

The final `git status` should report a clean working tree. Do not create a v1.0 tag.

## Release evidence

- 68 domain tests passed.
- 25 Firestore Rules tests passed.
- ESLint passed without warnings.
- Vite production build passed.
- Release-readiness confirmed v0.16.0 on Hosting target `app`.
- Firebase Hosting deployed 60 frontend files successfully.
- Firestore Rules were unchanged.
- Two React Router React Server Components advisories remain reviewed and non-blocking for this client-rendered Vite app. Do not run `npm audit fix --force`.

## Delivered release scope

- Shared accessible page-section tabs on desktop.
- Native section selector on smaller screens.
- Focused default views across Progress, logging, analytics, profile, coaching, references, seasons, Houses, Pocket Week and Administration.
- C.H.A.O.S. remains visible and understandable through the Houses overview and management workspace.
- No scoring, Firestore or security change.

## Next scoped phase candidates

Choose one coherent pre-v1.0 phase before implementation:

1. First-use onboarding, privacy/support content, personal-data export and account deletion.
2. Trusted server-side contribution recalculation and real-season operational hardening.
3. Measured performance optimisation and personal-history pagination.
4. Explicit product design for currently inactive competition mechanics.

Do not implement Power Plays, Diamonds, player prices, House Immunity, the full Transfer Market, Buddy Bonuses, Five Fires or late-season twists without explicit decisions. Pocket Week remains one seven-day window immediately before a season.
