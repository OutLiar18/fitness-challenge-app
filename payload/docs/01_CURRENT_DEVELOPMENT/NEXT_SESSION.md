# Champions Legacy Challenge — Next Session

Version target: 0.8.0
Objective: Verify profiles, Legacy Avatars and announcement status

## Required sequence

1. Confirm `.env` remains present and ignored.
2. Run `npm install`.
3. Run `npm run check`; expect 29 tests.
4. Run `npm audit`; do not use `--force`.
5. Deploy `firestore.rules` to `fitnesschallengeapp-9e87f`.
6. Run `npm run dev`.

## Profile checks

- Existing users display the default Legacy Trophy avatar.
- Select a different avatar and change the display name.
- Save and confirm the shell, Dashboard and Profile update immediately.
- Refresh and confirm the selection persists.
- Confirm email, role, team and joined date cannot be edited.
- Test the avatar grid at 320 px, tablet and desktop widths.

## Announcement checks

- Unread count appears in desktop and mobile navigation.
- Mark one announcement read and confirm the badge decreases.
- Mark it unread and confirm the badge returns.
- Test type filters, unread-only and mark-all-read.
- Refresh and confirm read status persists on the same browser.

## Release

```powershell
git add -A
git commit -m "feat: add Legacy Avatars and announcement status"
git tag v0.8.0
```
