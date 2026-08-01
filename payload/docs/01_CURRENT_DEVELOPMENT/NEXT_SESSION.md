# Champions Legacy — Next Session

Version target: 0.7.0
Objective: Verify and release Navigation & Experience Foundation

## Required sequence

1. Back up `.env` and confirm it remains ignored.
2. Delete `node_modules` if platform binaries are stale.
3. Run `npm install`.
4. Run `npm run check`.
5. Run `npm audit`; do not use `--force`.
6. Run `npm run dev`.

## Focused route checks

### Navigation

- Desktop sidebar expands and collapses.
- Mobile drawer opens and closes.
- Mobile bottom navigation shows Dashboard, Log, Progress, News and Profile.
- Active route styling is correct.
- Sign out works.
- Refreshing a protected route remains on that route after authentication.

### Dashboard

- No category form or journal appears on the Dashboard.
- Goal cards open `/log` with the correct category selected.
- Daily/Weekly tabs remain correct.
- Motivation shuffle changes content without affecting data.

### Log & Journal

- Every category can be selected.
- Entries save once and appear in the journal in real time.
- Yesterday remains editable; older dates remain read-only.
- Delete behaviour remains correct.
- Local date selection does not shift.

### Progress

- XP, points, streaks, achievements and records match v0.6 behaviour.
- Timeline events appear in descending date order.
- No duplicate Firestore subscription symptoms appear while changing routes.

### Structured future pages

- Announcements and Profile load.
- `/admin` exposes no privileged data or actions for a normal user.
- Teams, Leagues and Coach previews clearly state that they are not operational.

## Release

After all checks pass:

```powershell
git add -A
git commit -m "feat: add navigation and experience foundation"
git tag v0.7.0
```
