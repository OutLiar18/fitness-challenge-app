# Champions Legacy Challenge — Changelog

## 0.10.0 — Pre-1.0 Release Hardening

Date: 1 August 2026

### Added

- Versioned global library releases for approved Exercise, Cardio and Skill suggestions.
- Published-library provider and live player-form integration.
- Embedded published definitions for historical scoring stability.
- Library-item archiving and immutable release records.
- Paginated administrative users, audit events and client error reports.
- Environment-controlled first-party client error reporting.
- Firestore Emulator Security Rules tests.
- Firebase Hosting preview and production configuration.
- Release-readiness script, QA matrix and candidate checklist.

### Changed

- Administrative queries no longer download unlimited user and audit collections.
- Approved suggestions require a separate deliberate publication step.
- Release verification now includes Security Rules tests.
- Global-library releases use deterministic identifiers so a semantic version cannot be published twice.
- Error-report context is serialised defensively and restricted to a sanitised summary.

### Fixed

- Restored Tier 5 custom-workout scoring when a normalised empty tier previously masked the proposed difficulty tier.
- Failed client-error writes can be retried during the same browser session.

### Security

- Added audited library publication and archive rules.
- Added authenticated, sanitised client error creation rules.
- Added audited error-resolution rules.

# Champions Legacy Challenge

# Changelog

Version: Living Document

---

# Purpose

The Changelog records all notable changes made to Champions Legacy Challenge.

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


# v0.7.1 — Adaptive Navigation Polish

Date: 1 August 2026

## Added

- Duolingo-inspired structural navigation patterns without copying Duolingo branding or assets.
- Persistent labelled desktop rail and icon-only tablet rail.
- Mobile status header and edge-to-edge bottom tab navigation.
- Responsive More popover and mobile bottom sheet.
- Shared shell status for streak, level and points.
- ADR-010 documenting adaptive navigation.

## Changed

- Official product branding now uses Champions Legacy Challenge.
- Player progression is calculated once in `PlayerDataProvider` and reused across routes and the shell.
- Mobile category selection is a horizontal swipeable row.
- Compact mobile statistics and form spacing improve 320 px usability.
- Desktop navigation no longer requires a collapse preference.

## Verification

- Twenty-six automated tests pass.
- JavaScript syntax checks pass.
- Local ESLint, production build and visual breakpoint QA remain required.

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


# v0.8.0 — Profiles and Announcement Status

Date: 1 August 2026

## Added

- Twelve locally rendered Legacy Avatars.
- Secure display-name and avatar editing.
- Real-time profile subscriptions.
- Announcement filters, read/unread controls and local read persistence.
- Dynamic announcement badges in desktop and mobile navigation.
- Profile and announcement regression tests.
- ADR-011 for local avatars and constrained profile writes.

## Changed

- Dashboard, shell and Profile now share the selected avatar.
- New accounts receive a default avatar and profile update timestamp.
- Firestore rules allow only tightly constrained player profile fields to change.

## Verification

- Twenty-nine automated tests pass.
- Local lint, production build and Firestore rules deployment remain required.

# v0.9.0 — Trusted Administration and Live Announcements

Date: 1 August 2026

## Added

- Firestore-backed published announcements with bundled fallback history.
- Cross-device per-player announcement read records.
- Platform Administration workspace with operational tabs.
- Announcement draft, publish, edit, archive and history-import workflows.
- Exercise, Cardio and Skill suggestion review queues.
- Trusted role and team management for other players.
- Immutable audit events committed atomically with privileged changes.
- Firebase custom-claim support for Platform Administrator authorization.
- First-administrator bootstrap guide.
- Central complete-word display formatters.
- Administration and wording regression tests.
- ADR-012 for audited client administration.

## Changed

- Announcement navigation badges now use Firestore read state.
- Player profile and token claims jointly expose trusted administration status.
- Administration is no longer a non-operational preview.
- Visible measurements use complete words such as minutes, kilometres, millilitres and effective repetitions.
- “XP” is presented to players as “experience points”.
- Typography now separates professional body text, display headings and restrained decorative emphasis.
- Documentation is aligned to v0.9.0.

## Security

- Ordinary players cannot read draft or archived announcements.
- Privileged writes require Platform Administrator authorization and a matching audit event in the same Firestore batch.
- Administrators cannot change their own trusted role through the application.
- Audit events cannot be edited or deleted by the client.
- Suggestion review is restricted to one transition from pending to approved or rejected.

## Verification

- Thirty-three automated tests pass in the handover environment.
- Local ESLint, production build and Firestore rules compilation remain required before tagging.
