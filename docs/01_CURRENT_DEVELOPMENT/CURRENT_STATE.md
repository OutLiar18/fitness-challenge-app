# Champions Legacy Challenge — Current State

<!-- RELEASE_STATUS: DEPLOYED -->
Version: 0.20.0  
Production version: 0.20.0  
Last updated: 4 August 2026  
Status: Verified and deployed; release commit pending; pre-v1.0

## Product state

Champions Legacy Challenge combines factual tracking, personal progression, season Houses, external WhatsApp proof, controlled standings and a practical Season Command Centre. v0.20.0 adds the first trusted client-side workflow for correcting factual entry mistakes without deleting or rewriting historical records.

## Delivered in v0.20.0

### Audited replacement entries

- Only Platform Administrators may create factual corrections.
- The correction keeps the original user, category, challenge date and historical House attribution.
- A new `challengeEntries` document becomes the active factual record.
- Earlier entries remain immutable and visible as preserved history.
- `entryCorrectionHeads` identifies the current entry for each correction root.
- `entryCorrections` records sequence, reason, point delta, affected leagues, linked claims and derived contribution IDs.
- Pocket redemption entries remain final activation records and are not replaced by this workflow.

### Competition reconciliation

- Existing activity contributions are netted by league, category, score category and historical House snapshot.
- Immutable negative `correction-reversal` contributions neutralise the earlier active points.
- Immutable positive `correction-replacement` contributions apply the replacement's immediate points.
- Qualifying Running keeps immediate Cardio points and receives a new pending Running proof claim.
- A corrected non-qualifying run keeps only Cardio and supersedes the old required proof claim without creating a new one.
- Steps continue to wait for proof.
- Water and Fruit daily proof claims remain one claim per category/day and are linked to the replacement entry.
- Existing evidence bonus contributions are not silently recalculated by the correction workflow.

### Active personal history

- Goals, records, progression, analytics and category totals use only the current entry in each correction chain.
- Earlier versions remain available to the Journal and integrity workspace.
- If a correction head is temporarily delayed or missing, the history resolver selects the newest readable replacement and emits a reconciliation warning rather than double-counting both versions.
- Personal JSON export now includes correction heads and immutable correction records; schema version is 2.

### Journal resilience and pagination

- Recorded-day navigation renders seven days at a time.
- Date summaries are derived from the active-history index rather than repeated full-array scans.
- The complete active entry set remains available for goals, records and analytics.

### Entry Integrity workspace

- Platform Administrators search by entry document ID or evidence verification ID.
- The workspace shows the resolved current entry, immutable chain, linked contributions, proof claims and targeted diagnostics.
- Blocking integrity errors prevent a new replacement so incomplete derived records cannot be silently carried into another correction.
- A mandatory reason is required before creating a replacement.
- A portable JSON integrity report serialises Firestore timestamps to ISO strings.

## Verification state

- 96 of 96 domain tests passed.
- JavaScript syntax and local-import audits passed.
- ESLint and the Vite production build passed on Windows.
- All 44 Firestore Rules tests passed using Java 21.
- Release-readiness confirmed v0.20.0 and Hosting target `app`.
- Firestore Rules and branded Firebase Hosting deployed successfully.

## Existing complete systems

Authentication, profiles, Legacy Avatars, ten activity categories, Points Engine v2, local-date Journal, goals, bonuses, streaks, shields, Experience Points, levels, achievements, records, timeline, Personal Analytics, trusted administration, moderation, shared libraries, Inbox, Rulebook, Points Guide, error monitoring, Firebase Hosting, Legacy Coach, season Houses, C.H.A.O.S., leadership voting, roster swaps, Pocket Week, notifications, dual standings, honours, onboarding, personal export, account requests, external evidence, published standings and the Season Command Centre.

## Boundaries

- Corrections are factual replacements, not arbitrary point edits.
- No correction changes the original challenge date or historical House attribution.
- No ordinary player can create, edit or delete correction records.
- Evidence-linked and corrected entries remain immutable.
- The current client-only transaction is suitable for the existing no-cost iteration; prize-bearing competition should still move to trusted server/Admin SDK recalculation.
- Full final cross-device, keyboard, screen-reader, dark-mode and accessibility review remains deferred.
- Do not call or tag v1.0 without explicit approval.
