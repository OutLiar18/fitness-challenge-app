# Champions Legacy Challenge — Current State

<!-- RELEASE_STATUS: DEPLOYED -->
Version: 0.19.0  
Production version: 0.19.0  
Last updated: 4 August 2026  
Status: Verified and deployed; release commit pending; pre-v1.0

## Product state

Champions Legacy Challenge now combines factual tracking, personal progression, season Houses, external proof and controlled player-facing standings. v0.19.0 adds the operational layer needed to run those systems without forcing administrators to inspect several pages and raw records separately.

## Delivered in the v0.19.0 candidate

### Season command centre

- Available inside configured `season-houses-v2` seasons to Platform Administrators, season managers and assigned evidence reviewers.
- Summarises player assignment, House completion, C.H.A.O.S. readiness, current-week leadership, evidence workload and leaderboard publication state.
- Produces one ordered list of next actions rather than a dense wall of unrelated controls.
- Links directly to Houses, Evidence Operations and Honours when action is required.

### Evidence operations visibility

- Open, expired, accepted, rejected and reversed claims are counted consistently from existing claim state.
- Category workload shows open claims, expired claims and active reviewer count.
- Recent immutable evidence decisions show decision type, point delta, late-exception status and timestamp.
- Category reviewers receive only their assigned evidence categories; administrators retain full season visibility.

### Publication history

- Existing immutable leaderboard snapshots are shown as a revision history.
- Current, manual, corrected and 10:00 fallback snapshots remain distinguishable.
- No snapshot is overwritten and no player-facing live-score access is introduced.

### Downloadable operations report

- Generates a portable JSON report from the records visible to the current role.
- Includes season metadata, operational summary, Houses, memberships, evidence claims, decisions, reviewer assignments and snapshot history.
- Includes no WhatsApp pictures, screenshots or message contents.
- Does not create a new Firestore document or alter the competition state.

## Verification state

- ESLint passes in the packaging environment.
- 85 of 85 domain tests pass in the packaging environment.
- JavaScript and JSX syntax/import audits are included in packaging.
- Firestore Rules are unchanged from verified v0.18.0; all 39 Rules tests must still pass on Windows before release.
- The Vite build must be confirmed on Windows because the uploaded dependency tree contains Windows-native Rolldown bindings.

## Existing complete systems

Authentication, profiles, Legacy Avatars, ten activity categories, Points Engine v2, local-date Journal, goals, bonuses, streaks, shields, Experience Points, levels, achievements, records, timeline, Personal Analytics, trusted administration, moderation, shared libraries, Inbox, Rulebook, Points Guide, error monitoring, Firebase Hosting, Legacy Coach, season Houses, C.H.A.O.S., leadership voting, roster swaps, Pocket Week, notifications, dual standings, honours, onboarding, personal export, account requests, external evidence and published standings.

## Boundaries

- No scoring, evidence, deadline, reviewer-authority or House-attribution rule changed.
- No Firestore Rules or collection shape changed.
- Reports are operational exports, not alternate score calculations.
- The 10:00 fallback still requires an authorised administrator session.
- Full final cross-device, keyboard, screen-reader, dark-mode and accessibility review remains deferred.
- Do not call or tag v1.0 without explicit approval.
