# Champions Legacy Challenge — Current State

Version: 0.17.0  
Production version: 0.17.0  
Last updated: 4 August 2026  
Status: Verified and deployed; documentation synchronisation and commit pending; pre-v1.0

## Product state

Champions Legacy Challenge combines factual personal tracking, progression and season-scoped competition. v0.17.0 adds player-readiness and account-control foundations without changing scoring, Experience Points, season contribution history or Pocket Week.

## Delivered in v0.17.0

### Guided first-use experience

- New profiles receive explicit onboarding state.
- An accessible four-step guide explains honest logging, derived scoring, personal progression and season competition.
- Legacy profiles without onboarding state are not interrupted.
- Players can replay the guide from Help & Privacy.

### Help & Privacy

- Added one responsive route for getting started, data explanations, privacy boundaries and account tools.
- Added a clear More-menu destination without crowding primary navigation.
- Profile protections link directly to the new route.

### Personal data control

- Added on-demand JSON export of account-owned records readable by the signed-in player.
- Firestore timestamps are converted to portable ISO strings.
- Unavailable export sections are recorded inside the file instead of being silently omitted.
- Own private leadership votes and sanitised own client error reports are now readable for export.

### Account deletion requests

- Added `accountDeletionRequests/{userId}` with requested, acknowledged and cancelled states.
- Players can submit, cancel and reopen their own request.
- Platform Administrators receive a filtered request queue and operational metric.
- Administrator acknowledgement requires an immutable audit event.
- The UI states clearly that acknowledgement is not final Firebase deletion.

## Security and data changes

- New profile creates require onboarding fields.
- Existing profiles remain compatible and may add onboarding fields only through constrained updates.
- Added narrowly scoped Security Rules for account request ownership and audited acknowledgement.
- No bulk data migration is required.

## Verified release state

- `npm install` completed successfully.
- ESLint passed without warnings.
- 71 of 71 domain tests passed.
- The Vite production build passed with 275 modules transformed.
- 30 of 30 Firestore Security Rules tests passed.
- Expected `PERMISSION_DENIED` logs came from negative Rules tests and did not indicate failures.
- Release-readiness verified v0.17.0 on branded Hosting target `app`.
- Firestore Rules compiled and deployed successfully.
- Firebase Hosting deployed 62 frontend files successfully to `https://champions-legacy-challenge.web.app`.
- Static syntax, import and reachability audits passed with no unresolved or unreferenced source files.

## Existing complete systems

Authentication, profiles, Legacy Avatars, ten activity categories, Points Engine v2, local-date Journal, goals, bonuses, streaks, shields, Experience Points, levels, achievements, records, timeline, Personal Analytics, trusted administration, moderation, versioned shared libraries, Inbox, Rulebook, Points Guide, error monitoring, Firebase Hosting, transparent Legacy Coach, season Houses, C.H.A.O.S., leadership voting, balanced roster swaps, Pocket Week, private notifications, dual standings and season honours.

## Known limitations

- Final integrated desktop/mobile/tablet, keyboard, visual, dark-mode and accessibility review remains deferred until the final pre-v1.0 stage.
- Account deletion is a trusted request workflow, not automatic erasure.
- Formal legal/privacy review and a confirmed public support contact remain required.
- Personal history still uses a complete user subscription; pagination remains future work.
- Prize-bearing competition still requires trusted server-side contribution recalculation.
- Inactive competition mechanics remain undefined and unimplemented.

## Immediate next step

Synchronise these deployment records and commit v0.17.0. After that, continue with one scoped pre-v1.0 phase at a time. No v1.0 tag or declaration is permitted without explicit approval.
