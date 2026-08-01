# Champions Legacy Challenge — QA Matrix

Last updated: 1 August 2026

## Viewports and input

Test 320 × 568 minimum mobile, common Android portrait, mobile landscape, tablet portrait/landscape, 1366 × 768 and 1920 × 1080. Cover keyboard, mouse, real or simulated touch, light/dark mode and reduced motion.

## Existing core workflows

- Authentication and protected routes.
- Profile name/avatar.
- Activity create/delete and Journal dates.
- Goals, progression and announcements.
- Administration, moderation, shared-library publication and error resolution.

## Team workflows

- Create a team and verify local emblem, motto and code.
- Join from another account and reject a second team.
- Record activity and verify weekly roster update.
- Reject member self-promotion.
- Transfer captaincy and verify both roles/pointers.
- Allow a member to leave; block current captain leave.
- Check empty/loading/error states on mobile and desktop.

## League workflows

- Create as League Administrator and reject ordinary-player creation.
- Open Registration, join and withdraw.
- Activate and verify membership status.
- Record one activity and verify personal plus league updates without duplicate entry.
- Confirm daily cap and participation bonus in standings.
- Confirm team snapshots remain the registration team.
- Complete/archive in order and reject skipped/backward transitions.
- Delete the source entry and confirm contribution removal.

## Legacy Coach workflows

- Verify current/previous seven-day metrics.
- Expand recommendation reasons and evidence.
- Switch focus and tone.
- Disable and re-enable guidance.
- Refresh and verify preferences persist.
- Confirm private preferences cannot be read from another account.
- Review all language for non-diagnostic, non-judgmental wording.

## Evidence

Record browser, viewport, date, workflow, screenshots, console output, Firestore path and any regression test added.
