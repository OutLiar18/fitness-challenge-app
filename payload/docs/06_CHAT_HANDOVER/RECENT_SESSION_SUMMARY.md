# Champions Legacy Challenge — Recent Session Summary

Date: 1 August 2026  
Release target: v0.9.0

## Completed

- Replaced release-only announcement data with a live Firestore-backed service plus bundled fallback history.
- Added cross-device per-player announcement read status.
- Added draft, publish, edit, archive and bundled-history import workflows.
- Added secure suggestion review queues for Exercise, Cardio and Skill proposals.
- Added trusted player-role and team management for other users.
- Added immutable audit events committed atomically with privileged changes.
- Added support for trusted custom claims and trusted profile roles.
- Added first-administrator bootstrap documentation.
- Added central complete-word measurement, point, experience-point and pace formatting.
- Proofread visible interface wording and strengthened typography hierarchy.
- Added administration and wording regression tests.
- Updated current, game-design, architecture, testing and release documentation.

## Verification

- Thirty-three automated tests pass in the handover environment.
- Local dependency installation was blocked by the sandbox package mirror, so ESLint and Vite production build remain required on the Windows development computer.
- Firestore rules must be compiled and deployed before privileged workflows are used.

## Next action

Follow `docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md` exactly.
