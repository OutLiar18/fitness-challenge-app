# Champions Legacy Challenge — QA Matrix

Last updated: 1 August 2026

## Viewports and input

Test 320 × 568 minimum mobile, common Android portrait, mobile landscape, tablet portrait/landscape, 1366 × 768 and 1920 × 1080. Cover keyboard, mouse, real or simulated touch, light/dark mode and reduced motion.

## Core workflows

- Authentication, protected routes, profile name/avatar and sign-out failure recovery.
- Every activity form, valid/invalid data, Journal date navigation and deletion.
- Goals, progression, announcements, administration, publication and error resolution.
- Complete measurement wording and professional empty/error/success states.

## Team workflows

- Create and join; reject a second team and a twenty-sixth member.
- Direct invitation lookup works; collection enumeration is denied in Emulator tests.
- Record activity and verify current-week roster data.
- Advance into a new Monday and ensure stale prior-week values display as zero.
- Reject self-promotion; transfer captaincy; allow non-captain leaving.
- Verify damaged membership pointer recovery message.

## League workflows

- Create as League/Platform Administrator; reject ordinary-player creation.
- Confirm Platform Administrator controls appear for every league.
- Join/withdraw transactionally and verify count/limit.
- Activate and record eligible activity without duplicate personal logging.
- Confirm capped daily activity and participation bonus.
- Complete/archive in order and reject skipped/backward transitions.
- Delete a recent source entry: active contribution disappears, final contribution remains.

## Legacy Coach workflows

- Verify current/previous seven-day metrics and evidence.
- Switch focus/tone, disable/re-enable and refresh.
- Confirm preferences stay private and guidance never changes score.

## Accessibility and deployment

- Skip link, focus order, visible focus and screen-reader labels.
- More dialog focus trap, Escape close and focus restoration.
- Branded Firebase Hosting nested-route refresh.
- Old-tab stale-chunk recovery after a new deployment.
- Browser console and Network panel contain no unexplained failures.

## Evidence

Record browser, viewport, date, workflow, screenshots, console output, Firestore path and every regression test added.
## Rulebook and Points Guide

- Current rules load by default; season and inactive mechanics are visually distinct.
- Search supports phrases and legacy rule numbers.
- Accordion, filter and jump controls are keyboard accessible.
- Dynamic goal values match the current configuration.
- Every points category contains zero and earning ranges from the live engine.
- Hidden progression rewards remain absent.
- `/rules` and `/points-guide` survive direct Firebase Hosting refreshes.
