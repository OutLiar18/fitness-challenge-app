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
