# Champions Legacy Challenge — Release Notes

## v0.16.0 — Progressive Disclosure and Page Breathing Room

Date: 3 August 2026  
Status: Verified and deployed to production; pre-v1.0

Champions Legacy Challenge now uses one consistent visual workspace pattern on pages that had grown into long stacks of competing sections. Desktop players receive labelled tabs with icons, concise descriptions and useful counts. Smaller screens receive a native section selector rather than squeezed horizontal controls. Keyboard users can move between desktop tabs with Arrow keys, Home and End, and reduced-motion preferences are respected.

Progress opens on a calm Overview. Achievements, Records, Timeline and Level Journey remain available without dominating the first view. The same principle now separates logging from Journal, analytics views, profile editing, Legacy Coach evidence/preferences, Points Guide references, season tasks, House operations, Pocket Week phases and administrative areas.

Critical functionality is not hidden without context. Houses shows C.H.A.O.S. readiness on Overview and links directly to Management. Summary cards and route-wide selectors remain visible when they help every section. Dashboard, Inbox and Rulebook keep their existing interaction patterns because generic tabs would not improve them.

This release changes presentation and component architecture only. It does not alter Firestore data, Security Rules, scoring, Experience Points, Pocket balances or historical House allocation. Packaging checks passed clean ESLint, 68 domain tests, syntax parsing and static source-reference audits. Authoritative Windows verification then passed the Vite production build, all 25 Firestore Rules tests and release-readiness for Hosting target `app`. Firebase Hosting deployed 60 frontend files successfully to the branded production site. Firestore Rules were unchanged. The full manual integrated review remains deferred until the final pre-v1.0 stage.

## v0.15.0 — Navigation, Inbox, Analytics and C.H.A.O.S. Readiness

Date: 3 August 2026

Champions Legacy Challenge now presents a calmer route hierarchy: personal journey, season competition and one communications Inbox. Profile is no longer duplicated on desktop. Public announcements and private notifications share one page without sharing their underlying permissions.

Personal Analytics provides weekly activity trends, a 28-day consistency view, category balance and supportive observations. It reads factual entries and the existing point breakdown, so Running/Cardio scoring remains consistent and no alternate score is stored.

Administrators can see C.H.A.O.S. prerequisites before activation. The checklist explains Registration status, House completion, the two-players-per-House minimum and one-time use. Legacy route bookmarks redirect to current Seasons, Houses and Inbox routes.

The release passed 66 domain tests, 25 Firestore Rules tests, clean ESLint, the Vite production build and release-readiness for Hosting target `app`. The frontend is deployed at `https://champions-legacy-challenge.web.app`. Firestore Rules and collection shapes were unchanged by v0.15.0.

This remains pre-v1.0. Full manual integrated review is intentionally deferred until the final pre-v1.0 stage.

## v0.14.0 — Season Houses, C.H.A.O.S. and Pocket Week

Date: 3 August 2026

The challenge’s real seasonal structure is now part of the app. Administrators create themed Houses, registered players are assigned through balanced C.H.A.O.S., each House elects weekly leadership, and one balanced roster swap per House/week changes only future House points. The seven days before a season form Pocket Week: deposits remain private and worth zero points until the player activates an available amount during the Active season. Both individual and House standings preserve historical truth.

### Season competition

- Season-specific House themes, identities and bundled emblems.
- Individual and House standings from the same factual activity entry.
- Historical House snapshots that are not rewritten after roster movement.
- Deterministic, balanced C.H.A.O.S. opening assignment with private notifications.
- Weekly 24-hour leadership ballots, administrator resolution and one Captain-appointed additional Vice-Captain.
- One balanced roster swap per participating House/week with atomic locks.
- Derived season honours for individual, category and House achievements.

### Pocket Week

- One private seven-day reserve window immediately before the season begins.
- Zero points until the player deliberately redeems an available balance.
- Partial redemption for measurable categories and whole-session redemption for Running and workouts.
- Authoritative transaction-time reload of the stored Pocket activity, membership and season.
- Canonical quantities and tamper-resistant reconstruction of the scored entry from stored facts.
- Immutable redemption receipts and traceable league contributions.

### Player experience and verification

- Dedicated Seasons, Houses, Pocket Week and Notifications areas.
- Responsive House forge, ballot, C.H.A.O.S. console, roster movement and dual leaderboards.
- Verification hotfix for the Pocket memo warning, live Coach preference path, safe optional claims, Captain appointment branch selection and Pocket Rules expression usage.
- Final Rules-fixture correction aligns seeded House membership snapshots with the production denormalised House identity used by contribution validation.
- Windows verification passed clean ESLint, all 61 domain tests, all 25 Firestore Security Rules tests, the production build and release-readiness.
- Required legacy competition test data was inspected and removed. Final Firestore Rules deployed without warnings, followed by the Hosting preview and branded production deployment.
- A production smoke test confirmed themed season and House creation.
- Pocket Week was confirmed as one seven-day pre-season window and not a recurring weekly reserve.
- Removed four unused Rules helper parameters so the final Rules redeploy compiles without warnings and without changing enforcement behaviour.

This remains pre-v1.0. Power Plays, Diamonds, the complete Transfer Market, Buddy Bonuses, Five Fires and late-season twists remain inactive until their modern rules are confirmed.

## v0.13.1 — Rulebook Installation and League Verification Hotfix

Date: 2 August 2026

- Corrects the updater path-nesting defect that prevented the new reference pages from entering the active build.
- Restores all 54 domain tests and all 15 current Firestore Rules tests.
- Removes seven React Hook dependency warnings without changing behaviour.
- Adds structural checks that prevent nested `src`, `tests`, `docs`, `public` or `scripts` folders from passing release readiness.

This remains a pre-v1.0 build.

## v0.13.0 — Rulebook and Points Reference

Date: 2 August 2026

### Challenge Rulebook

- Searchable, collapsible sections replace the original wall-of-text format.
- Players can separate current rules, optional season rules and inactive 2025 mechanics.
- Current targets come directly from the goal configuration.
- Original wording and rule numbers remain visible where appropriate.

### Points Guide

- Visual score ladders come directly from the live scoring constants.
- Every category shows its zero-point and point-earning ranges.
- Running eligibility, Cardio cross-contribution, difficulty, visible goal bonuses and league scoring are included.
- Hidden progression surprises remain undisclosed.

### Release status

This remains a pre-v1.0 build for verification and user review.

## v0.12.0 — Pre-review Hardening and Polish

Date: 1 August 2026

### Integrity and security

- Added category-shaped recent challenge-entry validation in Firestore Rules.
- Required duration totals to match their hour, minute and second fields.
- Restricted entry-linked contribution lookups to the authenticated player’s own snapshots.
- Blocked invitation collection enumeration while retaining known-code lookup.
- Added transactionally paired league membership and participant counts with a 200-player limit.
- Preserved completed and archived league contribution history after personal-entry deletion.
- Normalized stale team snapshots to the current week.

### Reliability and accessibility

- Keyed Team and League subscription state to the active user and scope.
- Aligned Platform Administrator league controls with Firestore authority.
- Added skip navigation and focus-managed More dialog behavior.
- Added clipboard fallback and one-time stale deployment chunk recovery.
- Added Vite vendor code grouping for production build verification.
- Prevented repeated team-leave and league-withdraw submissions while writes are in progress.
- Replaced unpredictable validation jokes with clear category-specific guidance.

### Deployment and verification

- Added branded Hosting target validation to release-readiness checks.
- Expanded the domain target to 47 tests and Rules target to 15 tests.
- Documented the existing-league participant capacity field check.

### Release status

This is the hardened pre-review build. It remains deliberately pre-1.0.

## v0.11.0 — Community and Coaching Foundation

Date: 1 August 2026

### Teams

- Added persistent one-team-per-player membership.
- Added local emblems, team identity, invitation joining and roster summaries.
- Added captain editing, atomic captain transfer and safe member leaving.
- Reused factual entries and the central Points Engine rather than creating team-only logging.

### Leagues

- Added Draft, Registration, Active, Completed and Archived seasonal stages.
- Added League Administrator scoped operations and audit history.
- Added frozen `consistency-v1` rules using `points-v2`.
- Added a 20-point daily activity cap and five-point participation bonus.
- Added atomic entry-linked contribution snapshots and player/team standings.

### Legacy Coach

- Added optional local guidance based on current and previous seven-day entry periods.
- Added player-controlled tone and focus.
- Added explicit recommendation reasons and evidence.
- Added private owner-scoped preferences without an external artificial-intelligence service.

### Security and testing

- Added team, league, membership, contribution and Coach preference rules.
- Added atomic captain transfer validation and forward-only audited league transitions.
- Expanded the domain target to 44 tests and Rules target to 12 tests.

### Release status

This release completes the requested community/coaching foundation before review. It remains pre-1.0.

## v0.10.0 — Pre-1.0 Release Hardening

Date: 1 August 2026

### Shared global libraries

- Platform Administrators can publish approved suggestions in explicit library releases.
- Releases include semantic versions and release notes.
- Published Exercise, Cardio and Skill options appear live in player forms.
- Entries embed published definitions for historical scoring stability.
- Published items can be archived without changing historical entries.
- Semantic release versions are unique and immutable after publication.

### Operational scaling

- Player administration, audit history and client error reports use cursor pagination.
- Load-more controls append records without replacing previous pages.

### Error monitoring

- Added off, console and Firestore reporting modes.
- Added React, global browser and unhandled-promise capture.
- Added sanitization, truncation and session deduplication.
- Added administrator resolution and immutable audit history.
- Added safe handling for circular diagnostic context and retry after failed report delivery.

### Security and verification

- Added Firestore Emulator Security Rules tests.
- Expanded rules for published libraries, releases and error reports.
- Added release-candidate and deployment scripts.

### Hosting preparation

- Added Firebase Hosting single-page-app rewrites.
- Added immutable static-asset caching.
- Added security response headers.
- Added expiring preview-channel deployment.

### Release status

v0.10.0 is intentionally not v1.0. It is ready for local verification, preview deployment and user-requested changes.
