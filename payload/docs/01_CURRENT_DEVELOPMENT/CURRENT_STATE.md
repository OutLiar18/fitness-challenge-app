# Champions Legacy Challenge — Current State

Version: 0.8.0
Last updated: 1 August 2026
Status: Profile and announcement systems implemented; local verification and Firestore rules deployment required

## Product state

Champions Legacy Challenge now provides a complete personal tracking, progression, navigation and identity foundation.

## Implemented in v0.8.0

- Twelve built-in Legacy Avatars rendered locally without image uploads.
- Secure player editing for display name and approved avatar selection.
- Real-time profile subscription shared across protected routes.
- Avatar identity throughout the shell, Dashboard and Profile page.
- Announcement filters, unread-only view, mark-read controls and mark-all-read action.
- Per-user announcement read state stored on the current browser.
- Dynamic unread badges in desktop and mobile navigation.
- Constrained Firestore profile-update rules.

## Architecture

Firestore stores the selected `avatarId`, not media bytes or URLs. Profile writes are restricted to `displayName`, `avatarId` and `profileUpdatedAt`. Role, email, ownership and competitive permissions remain immutable from the client.

Announcements remain bundled release content behind a service boundary. Read state is a non-critical browser preference and does not require Firestore.

## Existing complete systems

- Authentication and factual activity entries.
- Ten activity categories and date-safe Journal.
- Explainable activity scoring and Running/Cardio rules.
- Daily and weekly goals with moderate bonuses.
- Streaks, shield, XP, levels, achievements and personal records.
- Progress timeline.
- Adaptive desktop, tablet and mobile application shell.
- Dedicated Dashboard, Log, Progress, Announcements and Profile routes.

## Verification

- Automated tests: **29 passing** in the handover environment.
- Local ESLint and production build must be run on the developer computer.
- Updated Firestore rules must be deployed before profile editing can succeed.

## Known limitations

- Announcement read state does not synchronise between browsers or devices.
- Players cannot upload custom photos. This is intentional until storage, moderation, privacy and cost rules are designed.
- Admin publishing remains inactive.
- Historical aggregation and pagination remain future work.
- React Router's RSC-only advisory remains pending upstream; RSC mode is not used.

## Immediate next step

Run the full local check, deploy `firestore.rules`, test profile editing and verify announcement read badges across desktop and mobile.
