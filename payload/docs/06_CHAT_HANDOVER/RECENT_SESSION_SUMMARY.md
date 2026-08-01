# Champions Legacy Challenge — Recent Session Summary

Date: 1 August 2026
Release target: v0.8.0

## Completed

- Added twelve built-in Legacy Avatars with no media uploads.
- Added secure display-name and avatar editing.
- Changed profile loading to a real-time owner-scoped subscription.
- Added avatar identity to the application shell, Dashboard and Profile.
- Added announcement filters, read/unread controls and mark-all-read.
- Added per-user browser read persistence and navigation badges.
- Updated Firestore rules to permit only constrained profile identity changes.
- Added profile and announcement regression tests.
- Updated current, architecture, security and release documentation.

## Verification

- Twenty-nine automated tests pass in the handover environment.
- JavaScript/JSX syntax parsing passes.
- Relative source imports resolve.
- Local ESLint and Vite production build still need to run on the Windows development computer.
- Firestore rules must be deployed before profile saves can succeed.

## Next action

Follow `docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md`.
