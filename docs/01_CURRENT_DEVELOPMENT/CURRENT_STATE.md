# Champions Legacy Challenge — Current State

<!-- RELEASE_STATUS: DEPLOYED -->
Version: 0.18.0  
Production version: 0.18.0  
Last updated: 4 August 2026  
Status: Release candidate; Rules hotfix verification and production deployment pending; pre-v1.0

## Product state

Champions Legacy Challenge combines factual personal tracking, progression and season-scoped competition. v0.18.0 adds structured external-proof administration and controlled player-facing leaderboard publication without adding media-storage cost or weakening historical House attribution.

## Delivered in the v0.18.0 candidate

### External proof boundary

- The app never uploads or stores evidence media.
- Players send proof through the season WhatsApp group.
- The app stores only structured claims, reviewer assignments, decisions, contributions, notifications and published snapshots.
- Every proof-related activity receives a short human-readable verification ID for WhatsApp matching and queue search.

### Proof-required activity

- Qualifying Running creates an evidence claim; Running points remain pending while Cardio points and Cardio statistics count immediately.
- Non-qualifying Running keeps its Cardio result and does not create an unnecessary proof claim.
- Steps points remain pending until proof is accepted.
- Pending, accepted, rejected, reversed and expired states remain visible in the player's own Journal.
- Evidence-linked entries are locked from ordinary client deletion so a verification ID cannot be detached from its factual record.

### Water and Fruit evidence bonuses

- Water may receive one three-point daily evidence bonus after at least 750 millilitres of photographed water are confirmed.
- Fruit may receive one three-point daily evidence bonus after at least three photographed fruit servings are confirmed.
- Fruit activity points are capped at five servings per season day.
- Evidence bonuses count toward the individual and historical House total, are competitive Points rather than Experience Points, and remain outside the normal activity cap.

### Review authority and corrections

- Platform Administrators may review every evidence category.
- Season managers assign one or more category reviewers to Water, Fruit, Running and Steps.
- Assigned reviewers may read and decide only their assigned categories.
- Season Administrators do not automatically receive evidence-decision authority unless assigned or also Platform Administrator.
- Proof is due within 24 hours of activity logging.
- Only a Platform Administrator may accept late proof, with a required audit reason.
- Decisions are immutable; corrections use an audited reversal followed by a replacement decision.

### Published standings

- Administrators and authorised evidence operators see live season standings.
- Players see only an immutable published leaderboard snapshot.
- Administrators may publish manually and may publish an audited corrected replacement.
- At or after 10:00 Africa/Johannesburg, the first authorised administrator session can publish the automatic fallback snapshot if none exists for that day.
- This is intentionally not a background scheduler. If no authorised administrator opens Evidence Operations, players continue seeing the previous snapshot.

### Compatibility and safeguards

- Existing `season-houses-v1` seasons remain readable under their original rules.
- New configured seasons use `season-houses-v2` and freeze their evidence policy.
- Running and Steps Pocket redemption is blocked for v2 because external proof cannot be safely attached to a previously reserved whole session in this iteration.
- House attribution is copied at activity time; later review or roster movement never reallocates old points.

## Candidate verification state

- Clean ESLint passed.
- 80 of 80 domain tests passed.
- The Windows Vite production build passed.
- The first Rules run passed 37 of 39 tests and exposed the 1,000-expression ceiling in two valid atomic workflows.
- The candidate includes a targeted Rules evaluation-budget hotfix and corrected Running proof fixture.
- All 39 Firestore Security Rules tests and `npm run check:release` must now pass before deployment.

## Existing complete systems

Authentication, profiles, Legacy Avatars, ten activity categories, Points Engine v2, local-date Journal, goals, bonuses, streaks, shields, Experience Points, levels, achievements, records, timeline, Personal Analytics, trusted administration, moderation, versioned shared libraries, Inbox, Rulebook, Points Guide, error monitoring, Firebase Hosting, transparent Legacy Coach, season Houses, C.H.A.O.S., leadership voting, balanced roster swaps, Pocket Week, private notifications, dual standings, season honours, onboarding, personal export and account-deletion requests.

## Known limitations

- The 10:00 fallback requires an authorised administrator session; there is no trusted background scheduler in this client-only iteration.
- WhatsApp submission media and timestamps remain external evidence. The reviewing administrator records the WhatsApp submission time.
- Evidence-linked entries cannot be ordinarily deleted; an audited factual correction workflow remains future work.
- Final integrated desktop/mobile/tablet, keyboard, visual, dark-mode and accessibility review remains deferred until the final pre-v1.0 stage.
- Account deletion is a trusted request workflow, not automatic erasure.
- Personal history still uses a complete user subscription; pagination remains future work.
- Prize-bearing competition still benefits from trusted server-side contribution recalculation before public launch.
- Inactive competition mechanics remain undefined and unimplemented.

## Immediate next step

Apply the v0.18.0 Rules hotfix, rerun `npm run test:rules`, then rerun `npm run check:release`. Do not deploy, commit or create a v1.0 tag until both pass. After a successful later production deployment, run the included `FINALISE_RELEASE.ps1`, then commit the release.
