# Next Session

Version target: Post-v0.14.0 pre-v1.0 development  
Status: v0.14.0 deployed; integrated review deferred

## Begin here

1. Confirm the v0.14.0 deployment commit is clean with `git status`.
2. Improve C.H.A.O.S. discoverability on the Houses page:
   - keep activation restricted to Registration;
   - show administrators a prerequisite checklist during Draft instead of hiding the system completely;
   - explain that all configured Houses must exist;
   - explain that the minimum is two registered players per House in total;
   - do not require Houses to contain players before activation because C.H.A.O.S. performs the assignment.
3. Add regression coverage for the prerequisite presentation and preserve existing service/Rules safeguards.

## Completed release gates

- Clean ESLint.
- 61 domain tests.
- 25 Firestore Rules tests.
- Successful Vite production build.
- Release-readiness for Hosting target `app`.
- Required Firestore legacy-data inspection and cleanup.
- Firestore Rules deployment without compiler warnings.
- Seven-day Hosting preview deployment.
- Production Hosting deployment.
- Production smoke test for season and House creation.

## Deferred final review

The full functional, responsive, keyboard, visual, dark-mode and accessibility review will be completed near the final pre-v1.0 stage, as directed by the product owner.

## Confirmed product rule

Pocket Week is one seven-day window immediately before a season. It does not recur every challenge week.

## Product questions still open

- Exact late-season twists.
- Whether future roster movement remains a balanced swap or becomes a full Transfer Market.
- Power Play voting, multipliers and the 40-percent contribution rule.
- Diamonds, player prices, House Immunity and transfer windows.
- Buddy Bonus evidence and group validation.
- Five Fires participation and reward rules.

Do not activate or invent these systems before the user confirms them. Do not create v1.0 without explicit approval.
