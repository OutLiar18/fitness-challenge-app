# Champions Legacy Challenge

# Release Notes

Version: Living Document

---

# Purpose

Release Notes summarise each public version of Champions Legacy Challenge.

Unlike the Changelog, Release Notes focus on what users and testers need to know about a release rather than every internal development change.

Each release should briefly explain what is new, what has improved and any important known limitations.

---

# Release Format

Each release should include:

- Version
- Release Date
- Summary
- New Features
- Improvements
- Bug Fixes
- Known Issues (if any)

---

# Example

# Version 0.1.0

Release Date:

YYYY-MM-DD

## Summary

Initial development release introducing the core foundations of Champions Legacy Challenge.

## New Features

- Authentication
- User Profiles
- Dashboard

## Improvements

- Initial responsive layout

## Bug Fixes

- Initial release

## Known Issues

- Statistics not yet implemented

---

# Version 0.2.0

Release Date:

YYYY-MM-DD

## Summary

Introduced configurable challenge categories and dynamic entry forms.

## New Features

- Dynamic Categories
- Dynamic Forms

## Improvements

- Cleaner dashboard layout
- Improved Firestore structure

## Bug Fixes

- Entry validation improvements

## Known Issues

- Image uploads not yet implemented

---

# Guidelines

Release Notes should focus on information useful to users, testers and stakeholders.

Avoid documenting every internal code change.

Instead, communicate the overall progress made in each release.

---

# Related Documentation

- CHANGELOG.md
- VERSION_HISTORY.md

---

# End of Document

# Version 0.7.1

Release Date: 1 August 2026

## Summary

Polishes Champions Legacy Challenge with intentionally different desktop, tablet and mobile navigation structures inspired by proven learning-app patterns.

## Improvements

- Persistent labelled desktop rail.
- Icon-only tablet navigation.
- Mobile player-status header and bottom tab bar.
- More popover and mobile bottom sheet for secondary modules.
- Swipeable mobile category selection.
- Shared progression summary across protected routes.
- Official product branding corrected to Champions Legacy Challenge.

## Known Issues

- Local ESLint, production build and breakpoint QA are required before tagging.
- React Router’s RSC-only advisory remains unresolved upstream; RSC mode is not used.

---

# Version 0.7.0

Release Date: 1 August 2026

## Summary

Transforms Champions Legacy Challenge from a single crowded dashboard into a polished multi-route application with shared navigation, focused workspaces and a clear foundation for future modules.

## New Features

- Collapsible desktop navigation and mobile bottom navigation.
- Dedicated Log & Journal page.
- Announcements and Profile pages.
- Chronological Progress timeline.
- Admin foundation and previews for Teams, Leagues and Legacy Coach.
- Daily motivational messages, side quests and optional easter eggs.

## Improvements

- Dashboard now focuses on overview and next actions.
- Goal cards open the correct logging category.
- Protected routes share one player-data subscription.
- Routes are lazy-loaded for improved bundle structure.
- Progression and records remain fully derived from factual entries.

## Known Issues

- Admin publishing and moderation are not active.
- Announcements are bundled with the release rather than stored in Firestore.
- Historical pagination and aggregation remain future work.
- The React Router RSC-only advisory remains pending upstream.
- Local production build verification is required before tagging.

---

# Version 0.6.0

Release Date: 31 July 2026

## Summary

Introduces Champions Legacy Challenge's first complete personal-progression experience while preserving the factual entry and central scoring architecture.

## New Features

- Daily and weekly goal dashboards.
- Small goal-completion and perfect-period bonuses.
- Forgiving consistency streak with an earned shield.
- Streak milestone rewards.
- Personal XP, levels and titles.
- Starter achievements and progression records.

## Improvements

- Running eligibility is transparent and still preserves Cardio credit.
- Workout categories progress independently through Effective Repetitions.
- Total score clearly separates activity and bonus contributions internally.
- Goal and progression rules are centralised for future expansion.

## Known Issues

- Full achievement and profile pages are still planned.
- Historical aggregation is required before entry pagination.
- React Router's RSC-only audit advisory remains unresolved upstream.
- The production bundle still benefits from future route splitting.

---


# Version 0.8.0

Release Date: 1 August 2026

## Summary

Adds expressive player identities and a more useful announcement experience without introducing media-storage costs.

## New Features

- Twelve built-in Legacy Avatars.
- Editable display name and avatar.
- Announcement filters and unread tracking.
- Desktop and mobile unread badges.

## Security

Profile writes are limited to approved identity fields. Account ownership, email, role, team and join date remain protected.

## Known Issues

- Announcement read state is local to the current browser.
- Custom photo uploads are intentionally unavailable.
- Updated Firestore rules must be deployed.

# Version 0.9.0

Release Date: 1 August 2026

## Summary

Introduces the first operational and auditable administration layer for Champions Legacy Challenge while improving announcement delivery, interface wording and typographic polish.

## New features

- Live platform announcements managed through Firestore.
- Cross-device announcement read status.
- Secure announcement studio for drafts, publishing, editing and archiving.
- Community suggestion review queues.
- Trusted player-role and team management foundation.
- Searchable immutable audit history.

## Presentation improvements

- Complete player-facing measurement names replace unclear short forms.
- Experience points are written in full.
- Stronger distinction between display headings, professional body text and reflective accent text.
- Proofread actions, validation, empty states and administrative instructions.

## Security

Privileged changes require trusted administrator authorization and an immutable audit record in the same atomic Firestore operation. Ordinary players cannot promote themselves or read unpublished announcements.

## Known limitations

- The first Platform Administrator requires trusted Firebase bootstrap.
- Approved suggestions are not yet automatically published to global libraries.
- Administrative lists need pagination before large production scale.
- Firestore Emulator Suite rule tests remain planned.
