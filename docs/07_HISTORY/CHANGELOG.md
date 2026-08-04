# v0.16.0 — Progressive Disclosure and Page Breathing Room

## v0.17.0 — Player Readiness and Account Control

Date: 4 August 2026

### Added

- Versioned four-step onboarding for newly created profiles with legacy-profile compatibility and replay.
- Help & Privacy route covering getting started, stored-versus-derived data, privacy boundaries and account tools.
- On-demand JSON export of account-owned readable data with portable timestamps and explicit unavailable-section reporting.
- Player account-deletion request, cancellation and reopen lifecycle.
- Platform Administrator request queue and audited acknowledgement.
- Security Rule access for players to export their own private leadership votes and sanitised error reports.
- ADR-024 and the Account, Onboarding and Privacy product source of truth.

### Verification state

- 71 domain tests passed in the packaging environment.
- Source syntax and relative import resolution passed.
- Windows verification passed clean ESLint, 71 domain tests, the Vite production build, 30 Firestore Rules tests and release-readiness.
- Firestore Rules compiled and deployed successfully.
- Firebase Hosting released 62 frontend files to the branded production site.
- Full manual integrated review remains deferred until the final pre-v1.0 stage.

### Boundaries

- Production remains v0.16.0.
- Acknowledgement is not final account deletion.
- No scoring, XP, Pocket, roster or historical House contribution logic changed.


Date: 3 August 2026  
Status: Verified and deployed to production; pre-v1.0

## Shared interaction pattern

- Added reusable `WorkspaceTabs` and `WorkspacePanel` components for dense route-level content.
- Added desktop Arrow-key, Home/End and focus movement support.
- Added a labelled native section selector for small screens.
- Added reduced-motion handling and pure active-section fallback helpers.

## Page refinement

- Progress now defaults to Overview and separates Achievements, Records, Timeline and Level Journey.
- Activity Log separates logging and Journal.
- Analytics separates Trends, Consistency, Category Balance and Insights.
- Profile, Legacy Coach and Points Guide use focused section workspaces.
- Seasons separates Browse, Join and Create; selected seasons separate Overview, Standings and Honours.
- Houses separates player-facing overview, roster, leadership, roster turn and authorised management while retaining visible C.H.A.O.S. readiness.
- Pocket Week uses phase-aware Store, Wallet and Guide sections.
- Administration uses the shared full-width workspace instead of an internal vertical navigation column.
- Dashboard, Inbox and Rulebook retain their more appropriate existing patterns.

## Architecture, testing and cleanup

- Added `services/ui/workspaceModel.js` and two regression tests.
- Added ADR-023.
- Static audit found no unresolved imports, unreferenced source modules or unreferenced stylesheets.
- ESLint and 68 domain tests passed in the packaging environment.
- Authoritative Windows verification passed the Vite production build, all 25 Firestore Rules tests and release-readiness for Hosting target `app`.
- Firebase Hosting deployed 60 frontend files successfully to the branded production site.
- Firestore Rules were unchanged and were not redeployed.
- The full manual integrated review remains deferred until the final pre-v1.0 stage.
- No Firestore, Security Rule, scoring or season-history changes were introduced.

---

# v0.15.0 — Navigation, Inbox, Analytics and C.H.A.O.S. Readiness

Date: 3 August 2026

## Navigation and communications

- Grouped desktop navigation into Journey, Competition and Communications.
- Removed the duplicate desktop Profile destination while retaining player-identity access and mobile Profile in More.
- Simplified mobile navigation to Home, Log, Progress, Inbox and More.
- Consolidated public announcements and private season notifications into one tabbed Inbox while preserving separate providers, repositories and Firestore security boundaries.
- Added redirects from legacy Teams, Leagues, Announcements and Notifications URLs.

## Personal analytics

- Added weekly activity trends across configurable ranges.
- Added a latest-28-day consistency view, category balance, recent momentum and transparent observations.
- Reused the factual entry model and central point breakdown, including Running/Cardio cross-contribution.
- Added no Firestore collection and no new stored score.

## Season operations and cleanup

- Added a visible C.H.A.O.S. prerequisite checklist during Draft and Registration.
- Added a pure C.H.A.O.S. readiness helper and regression tests.
- Renamed route-level source files to Seasons, Houses, Inbox and Analytics.
- Removed separate Announcements/Notifications pages and stale Netlify `_redirects` residue.
- Preserved accepted/superseded ADR history and added ADR-022.

## Verification and deployment

- Passed 66 domain tests and 25 Firestore Security Rules tests.
- Passed clean ESLint, the Vite production build and release-readiness for Hosting target `app`.
- Reviewed the two React Router RSC advisories without applying a forced breaking downgrade.
- Deployed 58 frontend files to the branded production Hosting site.
- Firestore Rules and collection shapes were unchanged by this release.
- Full manual integrated review remains deferred until the final pre-v1.0 stage by product-owner decision.

This release remains pre-v1.0.

# v0.14.0 — Season Houses, C.H.A.O.S. and Pocket Week

Date: 3 August 2026

## Added

- Season-scoped themed Houses and retired permanent global Teams.
- Balanced one-time C.H.A.O.S. opening assignment with private notifications.
- Weekly 24-hour House leadership voting, administrator resolution and Captain-appointed additional Vice-Captain.
- One balanced player swap per House/week with transactional locks.
- Historical House contribution allocation that survives roster movement.
- Seven-day Pocket deposits, canonical partial/whole redemption and immutable receipts.
- Individual/House leaderboards and season honours.
- Private ballot, assignment, roster and Pocket notifications.
- 61 domain tests and 25 Firestore Rules tests.

## Fixed

- Removed four unused Firestore Rules helper parameters so the deployed ruleset compiles without warning while preserving identical enforcement behaviour.
- Windows verification hotfix removes the `PocketWeek.jsx` React Hook dependency warning.
- Coach preference Rules coverage now targets the live `users/{userId}/coach/preferences` path while confirming the retired path remains denied.
- Optional administrator claims are read safely, and Captain-appointed Vice-Captain updates evaluate only their applicable Rules branch.
- Category-specific entry validation now uses conditional dispatch so atomic Pocket redemption stays below the Firestore Rules expression ceiling.
- Corrected the Rules membership fixture so wrapped House definitions seed the same name, emblem and accent snapshots used by production membership documents.
- Pocket redemption now reloads the authoritative reserve, membership and season inside the transaction.
- Stored scoring facts cannot be replaced while a Pocket balance is redeemed.
- Fractional count/volume redemptions and stale post-redemption amounts are rejected or normalised safely.
- Invalid season query links fall back to an available season instead of leaving a blank page.
- Leadership voting cannot open for a House with fewer than two current members.

## Deployment

- Completed the required Firestore inspection and removed only retired Team and dummy legacy-league test data.
- Preserved `users`, `challengeEntries` and `auditEvents`.
- Deployed the final v0.14.0 Firestore Rules without compiler warnings, deployed the seven-day Hosting preview, and released the matching frontend to the branded production URL.
- Confirmed through a production smoke test that Platform Administrators can create themed seasons and season-scoped Houses.
- Confirmed Pocket Week as one seven-day pre-season window rather than a recurring weekly reserve.

## Changed

- Teams navigation and pages now represent season Houses.
- Leagues are presented as themed Seasons.
- Rulebook, Points Guide, profile, architecture and deployment documentation align with the new season model.

## Deferred

Power Plays, Diamonds, the full Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive.

# v0.13.1 — Rulebook Installation and League Verification Hotfix

Date: 2 August 2026

## Fixed

- Replaced managed source directories during updates instead of nesting them under paths such as `src/src`.
- Restored the complete v0.13 Rulebook, Points Guide and 54-test domain suite to the active application tree.
- Replaced stale v0.11 Firestore Rules fixtures with the 15-test hardened league and entry suite.
- Stabilised empty subscription arrays so React memo dependencies no longer change on every render.
- Added release-readiness checks that reject nested managed source directories.

## Unchanged

- No points, goals, player records, league standings or Firestore data shapes changed in this patch.
- The product remains pre-v1.0.

---

# v0.13.0 — Rulebook and Points Reference

Date: 2 August 2026

## Added

- Searchable in-app Challenge Rulebook with current, season and inactive classifications.
- Legacy 2025 rule-source references, dynamic goals, jump navigation and accessible accordions.
- Public Points Guide generated from live scoring constants.
- Zero-point ranges, difficulty scale, public formulas, visible goal bonuses and league-day score.
- ADR-020 and seven reference-system regression tests.

## Changed

- Added platform-specific integrity, privacy, safety and conduct rules.
- Clarified which 2025 mechanics are unsupported and award no points.
- Aligned release metadata, bundled announcements and administrative version defaults with v0.13.0.

## Fixed

- Prevented the old 2025 points chart from becoming a second calculation source.
- Resolved the 2025 avocado contradiction through the confirmed culinary-fruit definition.

---

# v0.12.0 — Pre-review Hardening and Polish

Date: 1 August 2026

## Added

- Category-shaped and recent-date Firestore Rules for challenge entries.
- Consistent duration-field validation and owner-scoped contribution lookup.
- Direct-get-only invitation privacy for Teams and Leagues.
- Transactional league capacity with `participantCount` and `participantLimit`.
- Permanent final league contribution history.
- Accessible skip link and focus-managed More dialog.
- Stale production chunk recovery and vendor code grouping.
- ADR-019 for the hardening decisions.

## Changed

- Team summaries ignore stale previous-week snapshots.
- Team and League provider state is keyed to active user/scope.
- Platform Administrator league controls now match Rules authority.
- Active source-entry deletion removes active league contributions only.
- Release verification targets the branded Firebase Hosting site.
- Professional wording, deterministic validation guidance and damaged-membership recovery states were refined.
- Team leaving and league withdrawal now block repeated submissions while writes are pending.

## Verification

- Domain target: 47 tests.
- Firestore Rules target: 15 tests.
- Windows ESLint, build, Emulator and release checks remain authoritative.

---

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

# v0.11.0 — Teams, Leagues and Legacy Coach

Date: 1 August 2026

## Added

- Team models, services, context, route and Firestore collections.
- Team invitations, roster snapshots and captain transfer.
- League models, services, context, lifecycle, registrations and standings.
- Entry-linked league contribution snapshots.
- Local Legacy Coach recommendations and private preferences.
- ADR-016, ADR-017 and ADR-018.
- Community and coaching domain and Security Rules tests.

## Changed

- Replaced Teams, Leagues and Coach preview navigation with functional routes.
- Extended protected providers with Team, League and Coach state.
- Entry creation/deletion now atomically includes/removes league contributions when applicable.
- League Administrator now has narrowly scoped, audited league authority.
- Documentation and release verification now target v0.11.0.

## Fixed

- Team provider clears stale team and roster state after membership removal.
- Team member captain-transfer rules use explicit boolean grouping.


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
