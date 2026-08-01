# Champions Legacy Challenge — Next Session

Version target: 0.11.0  
Objective: Verify and stabilise Teams, Leagues and Legacy Coach before review

## Required sequence

1. Confirm `.env` remains present and ignored by Git.
2. Run `npm install`.
3. Run `npm run check`; expect **44 passing domain tests**.
4. Run `npm run test:rules`; expect **12 passing Firestore Rules tests**.
5. Run `npm run check:release`.
6. Run `npm audit`; do not use `--force`.
7. Deploy the updated Firestore Rules.
8. Start the development server and complete the community/coaching checks below.

## Commands

```powershell
npm install
npm run check
npm run test:rules
npm run check:release
npm audit
npm run deploy:rules
npm run dev
```

## Team checks

- Create a team and confirm the invitation code and local emblem appear.
- Join from a second account.
- Confirm one player cannot join or create a second team.
- Record activity and confirm the member’s weekly roster summary updates.
- Confirm a member cannot make themselves captain.
- Transfer captaincy and confirm both accounts update.
- Confirm the former captain may now leave while the current captain may not.

## League checks

- Assign a test account the `leagueAdmin` role through trusted administration.
- Create a Draft league and inspect the frozen rules explanation.
- Open Registration and join from player accounts.
- Confirm registration may be withdrawn only before activation.
- Activate the league, record activity once, and confirm personal and league progress update together.
- Confirm the daily cap and participation bonus produce understandable standings.
- Complete and archive the league in order; confirm stages cannot be skipped.

## Legacy Coach checks

- Confirm recommendations use only current and previous seven-day entry periods.
- Expand every “Why this was suggested” explanation.
- Change tone and focus, refresh, and confirm preferences persist.
- Disable guidance and confirm recommendations hide without deleting activity.
- Confirm another account cannot read the player’s Coach preferences.

## Release boundary

A suitable commit is:

```powershell
git add -A
git commit -m "feat: add teams leagues and transparent Legacy Coach"
git tag v0.11.0
```

Do not create a `v1.0.0` tag.
