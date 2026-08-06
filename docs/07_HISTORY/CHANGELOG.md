# Champions Legacy Challenge — Changelog

## [0.23.0] — 5 August 2026 — Verified production deployment

<!-- RELEASE_STATUS: DEPLOYED -->

### Added

- New v3 season ruleset with ten editable theme-specific base Power Plays.
- Controlled custom 2×/3× one- or multi-category Power Plays.
- Random official-week selection without replacement and permanent season no-repeat state.
- Player weekly reveal, administrator pool/selection workspace and notifications.
- Power Play-aware individual standings, House standings, honours and Command Centre summaries.
- Frozen definition validation, Firestore Rules, trusted reconciliation, operations guide and ADR-030.

### Preserved

- Existing v1/v2 seasons remain unchanged.
- Evidence bonuses, goals, missions, streaks, Experience Points and administrator adjustments are not multiplied.
- No background scheduler, paid plan or arbitrary formula engine.

## [0.22.0] — 5 August 2026 — Release candidate

### Added

- Seven-day account-deletion cancellation window after administrator acknowledgement.
- Trusted local request listing, dry audit and confirmed processing commands.
- Deterministic Former Player anonymisation for preserved shared competition history.
- Administrator-only deletion execution and completion receipt records.
- Resumable failed processing, final-administrator protection and final live-plan refresh.
- Personal export schema version 3 and complete trusted deletion documentation.

### Changed

- Account request lifecycle now includes processing, failed and completed states.
- Trusted season reconciliation tolerates deliberately removed private correction entries after anonymisation.

### Security

- Client writes to trusted execution and receipt records are denied.
- Credentials and local reports remain outside the repository and release archives.

<!-- RELEASE_STATUS: DEPLOYED -->

## 0.21.0 — Trusted Standings and Season Reconciliation

Date: 5 August 2026  
Status: Verified production deployment

### Added

- Free local Firebase Admin SDK dry-run and guarded publication commands.
- Deterministic trusted season fingerprint, integrity findings and snapshot comparison.
- Immutable trusted publication run and audit records.
- Season Command Centre trusted status and operating commands.
- Eight domain tests and two Firestore Rules tests.

### Security and operations

- Browser clients cannot write trusted-run records.
- Private service-account files and local reports are excluded from Git.
- No paid Cloud Functions or automatic schedule are introduced.

## 0.20.0 — Audited Factual Corrections and History Resilience

Status: Verified and deployed; release commit pending

### Added

- Platform Administrator Entry Integrity workspace.
- Immutable replacement entries, correction heads and correction records.
- Contribution reversal/replacement reconciliation with preserved House attribution.
- Required-proof claim supersession and replacement verification IDs.
- Active personal-history resolution and correction visibility in the Journal.
- Seven-recorded-day Journal pagination and date index.
- Targeted integrity diagnostics and portable JSON report.
- Personal export schema version 2 with correction history.
- 11 domain tests and 5 Firestore Rules tests for correction behaviour.

### Changed

- Corrected source and evidence-linked entries cannot be deleted.
- Goals, records, analytics and progression use only active entry versions.
- Evidence operations recognise `superseded` claims.
- Production deployment now includes changed Firestore Rules.

### Preserved boundaries

- No arbitrary point editing.
- No change to Running, Steps, Water, Fruit, House or leaderboard rules.
- Pocket redemption correction remains deferred.
- Release remains pre-v1.0.

## v0.19.0 — Season Command Centre

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 4 August 2026  
Status: Verified, deployed and committed

### Added

- Role-aware Season Command Centre for configured v2 seasons.
- Ordered next-action guidance across Houses, C.H.A.O.S., leadership, evidence and publication.
- Evidence workload and reviewer coverage by category.
- Immutable evidence-decision and leaderboard-snapshot history.
- Downloadable role-scoped season operations reports.
- ADR-026, source audit and release documentation.

### Preserved

- No scoring, evidence, deadline, House attribution or Security Rule change.
- No WhatsApp media storage or export.
- Player-facing standings remain immutable published snapshots.

### Verification

- Clean ESLint passed in the packaging environment.
- 85 domain tests passed in the packaging environment.
- Windows Vite build, 39 Rules tests and release-readiness passed.
- Branded Firebase Hosting deployed successfully.

## v0.18.0 — External Evidence and Published Standings

<!-- RELEASE_STATUS: DEPLOYED -->
Date: 4 August 2026  
Status: Verified, deployed and committed

### Added

- External WhatsApp proof workflow with human-readable verification IDs.
- Per-entry Running/Steps claims and daily Water/Fruit bonus claims.
- Assigned category reviewers with least-privilege queue access.
- Immutable evidence decisions, notifications, reversals and signed contribution corrections.
- Live administrator standings and immutable player-facing leaderboard snapshots.
- Manual, corrected and 10:00 Johannesburg administrator-session publication modes.
- Canonical evidence documentation, ADR-025 and an in-package release finaliser.

### Changed

- New seasons use `season-houses-v2` and freeze `whatsapp-proof-v1` settings.
- Qualifying Running holds Running points but releases Cardio immediately.
- Steps points remain pending until proof acceptance.
- Fruit activity scoring caps at five servings per v2 season day.
- Running and Steps Pocket redemption is blocked in v2.
- Evidence-linked entries are locked from ordinary client deletion.

### Verification

- Clean ESLint passed in the packaging environment.
- 80 domain tests passed in the packaging environment.
- Windows verification passed the Vite build, 80 domain tests, 39 Firestore Rules tests and release-readiness. Firestore Rules and branded Hosting deployed successfully.

## v0.17.0 — Player Readiness and Account Control

Date: 4 August 2026  
Status: Verified and deployed to production; pre-v1.0

- Added guided onboarding with legacy-profile compatibility and replay.
- Added Help & Privacy, portable personal JSON export and account-deletion requests.
- Added Platform Administrator acknowledgement with immutable audit history.
- Added Security Rule access for owner export of private votes and sanitised error reports.
- Passed 71 domain tests, 30 Rules tests, clean lint/build and release-readiness.
- Deployed Firestore Rules and 62 Hosting files successfully.

## v0.16.0 — Progressive Disclosure and Page Breathing Room

Date: 3 August 2026  
Status: Verified and deployed to production; pre-v1.0

- Added reusable accessible route workspaces with desktop tabs and mobile native selectors.
- Refined Progress, Activity, Analytics, Profile, Coach, Points Guide, Seasons, Houses, Pocket Week and Administration.
- Preserved Dashboard, Inbox and Rulebook patterns where tabs would reduce clarity.
- Passed 68 domain tests, 25 Rules tests, clean lint/build and release-readiness.
- Deployed 60 Hosting files; Firestore Rules were unchanged.

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
