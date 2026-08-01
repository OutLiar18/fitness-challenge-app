# Champions Legacy

# Changelog

Version: Living Document

---

# Purpose

The Changelog records all notable changes made to Champions Legacy.

It provides a chronological history of features, improvements, fixes and refactoring completed during development.

Unlike Release Notes, which summarise public-facing releases, the Changelog records the day-to-day evolution of the project.

---

# Format

Each entry should include:

- Date
- Version
- Added
- Changed
- Fixed
- Removed (if applicable)

---

# Example

## YYYY-MM-DD — v0.1.0

### Added

- User authentication
- User profiles
- Dashboard

### Changed

- Improved navigation layout

### Fixed

- Login validation bug

---

## YYYY-MM-DD — v0.2.0

### Added

- Dynamic challenge categories
- Dynamic entry forms

### Changed

- Refactored statistics service

### Fixed

- Journal sorting issue

---

## YYYY-MM-DD — v0.3.0

### Added

- Leaderboard
- User statistics

### Changed

- Improved dashboard performance

### Fixed

- Firestore read duplication

---

# Guidelines

Record changes that are meaningful to future development.

Examples include:

- New features
- Significant improvements
- Bug fixes
- Refactoring
- Performance improvements
- Documentation milestones

Avoid recording trivial changes such as formatting or spelling corrections unless they affect functionality.

---

# Related Documentation

- RELEASE_NOTES.md
- VERSION_HISTORY.md

---

# End of Document
---


# v0.7.0 — Navigation & Experience Foundation

Date: 1 August 2026

## Added

- Responsive shared application shell.
- Collapsible desktop sidebar, mobile drawer and bottom navigation.
- Dedicated Log & Journal route.
- Announcements and Profile routes.
- Safe Admin foundation and future Teams, Leagues and Coach previews.
- Chronological progress timeline.
- Daily motivation, side quests and harmless easter eggs.
- Central navigation, announcement and future-feature configuration.
- Shared PlayerDataProvider for protected routes.
- Navigation and experience regression tests.

## Changed

- Dashboard is now a focused overview.
- Goal cards deep-link to the selected logging category.
- Protected pages share one profile load and one real-time entry subscription.
- Route pages load lazily to support code splitting.
- Progress and Profile consume the shared player-data context.

## Removed

- Duplicate unused TimeDurationPicker.
- Obsolete units helper.
- Empty easter-egg source files.
- Unused statistics re-export.
- Temporary root hotfix, delivery and verification documents.

## Verification

- Twenty-six automated tests pass.
- JavaScript/JSX syntax validation passes.
- Relative imports and source reachability pass.
- Local ESLint and production build remain required before tagging.

---

# v0.6.0 — Personal Progression Foundation

Date: 31 July 2026

## Added

- Central daily and weekly goal configuration.
- Independent Upper Body, Lower Body and Core goals.
- Moderate goal and mission bonus points.
- Daily consistency streaks.
- Earned streak shield and protected missed days.
- One-time streak milestone points and XP.
- Personal XP, levels and titles.
- Starter achievements and personal progression records.
- Progression dashboard card.
- Progression domain service layer.
- Goal and progression regression suite.

## Changed

- Total Points now includes goal and streak bonuses.
- Top Categories remains activity-only.
- Reading goal changed to 60 daily and 450 weekly.
- Cardio and Skill goals changed to 15 daily and 150 weekly.
- Running moved to a 5 km weekly-only goal.
- Steps weekly goal set to 90,000.
- Weekly periods use local Monday–Sunday dates.
- Category configuration no longer duplicates goal values.

## Fixed

- Running points now require at least 3 km at 11:00/km or faster.
- Ineligible runs still retain Cardio credit.
- Workout goal progress now uses Effective Repetitions.
- Entry-update and profile-role security rules remain locked.

## Removed

- Obsolete monolithic statistics service.
- Obsolete migration service.
- Obsolete Cardio points configuration.
- Duplicate exercise option service.

## Verification

- Eighteen automated domain tests pass.
- Local lint and production build must be rerun after a fresh dependency install.

---

# v0.5.0 — Platform Stabilisation

Date: 30 July 2026

## Added

- Structured point breakdowns with category identities.
- Running Cardio bonus and cross-category Cardio statistics.
- Effective Repetitions and five-tier workout difficulty support.
- Custom Exercise, Cardio and Skill suggestion persistence.
- Accessible selector architecture and reusable form sections.
- Date-safe journal navigation and locked historical views.
- Responsive design system, polished auth/dashboard/journal UI and toast notifications.
- Error boundary, Firebase rules, Firebase config, `.env.example`, favicon and SPA redirect.
- Repository/auth/user hooks and domain-oriented service boundaries.

## Fixed

- Potential Running point double counting in the journal explanation.
- Legacy Upper Body exercises not scoring because `exerciseType` was absent.
- Custom workout exercises scoring zero.
- Running not contributing to Cardio goals/statistics.
- UTC date-input shifts.
- Delete controls appearing in read-only history.
- Custom Cardio validation omissions.
- incomplete-account cleanup after profile-write failure.
- stale selector import paths and invalid nested interactive controls.

## Removed

- Legacy duration picker.
- obsolete Easter egg placeholders.
- broken duplicate Cardio point configuration.
- duplicate exercise option service.
- obsolete monolithic statistics and migration services.
- unused units helper.

## Verification

- ESLint passes.
- Production build requires a fresh platform-correct dependency installation outside the sandbox.
