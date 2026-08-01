# Champions Legacy Challenge — Next Session

Version target: 0.9.0  
Objective: Verify and release trusted administration and live announcements

## Required sequence

1. Confirm `.env` remains present and ignored.
2. Run `npm install`.
3. Run `npm run check`; expect **33 passing tests**.
4. Run `npm audit`; do not use `--force`.
5. Deploy `firestore.rules` to `fitnesschallengeapp-9e87f`.
6. Bootstrap the first Platform Administrator using `ADMIN_BOOTSTRAP.md`.
7. Sign out and sign in again, then run `npm run dev`.

## Player checks

- Existing entries, goals, score and progression remain unchanged.
- Measurements display complete words rather than short forms.
- Profile avatar and display-name editing still work.
- Published announcements appear for ordinary players.
- Read status persists after refresh and on a second browser after signing in.
- Draft and archived announcements remain hidden from ordinary players.

## Administration checks

- A normal player cannot access administrative data or actions.
- A Platform Administrator can create a draft announcement.
- Publishing makes the announcement visible to ordinary players.
- Archiving removes it from the ordinary player view without deleting history.
- Exercise and library suggestions appear in the review queue.
- Approval and rejection create audit events.
- Rejection requires respectful feedback.
- Changing another player’s role or team creates an audit event.
- An administrator cannot change their own trusted role in the application.
- Audit events cannot be edited or deleted.

## Responsive and presentation checks

- Verify 320-pixel mobile, tablet and desktop layouts.
- Confirm headings, body text, quotations and emphasis remain readable in light and dark themes.
- Confirm underlines are used only for deliberate emphasis and links.
- Confirm keyboard navigation and visible focus states.

## Release

```powershell
git add -A
git commit -m "feat: add trusted administration and live announcements"
git tag v0.9.0
```
