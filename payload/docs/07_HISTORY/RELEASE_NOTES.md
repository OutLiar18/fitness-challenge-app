# Champions Legacy

# Release Notes

Version: Living Document

---

# Purpose

Release Notes summarise each public version of Champions Legacy.

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

Initial development release introducing the core foundations of Champions Legacy.

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

# Version 0.7.0

Release Date: 1 August 2026

## Summary

Transforms Champions Legacy from a single crowded dashboard into a polished multi-route application with shared navigation, focused workspaces and a clear foundation for future modules.

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

Introduces Champions Legacy's first complete personal-progression experience while preserving the factual entry and central scoring architecture.

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
