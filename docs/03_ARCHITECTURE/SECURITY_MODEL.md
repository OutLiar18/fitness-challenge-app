# Champions Legacy Challenge — Security Model

Last updated: 4 August 2026  
Current release target: v0.23.0  
Current production: v0.20.0

## Principles

- Authentication identifies the caller.
- Firestore Rules enforce authority and atomic relationships.
- Client visibility never substitutes for Rules.
- Trusted changes require immutable audit records where specified.
- External WhatsApp media is not protected by Firestore and is never represented as stored app data.

## Evidence claims

- Players create claims only for their own new entries and active v2 memberships.
- The claim ID must be present in the source entry's `evidenceClaimIds`.
- Required-proof claim IDs are deterministic per season/entry; daily bonus IDs are deterministic per season/user/date/category.
- Claim category, House identity, dates and pending values must match the source entry and frozen season policy.
- Players may read their own claims but cannot change review state.

## Reviewer scope

- Platform Administrators may review all categories.
- Assigned reviewers are resolved through `leagueEvidenceReviewers/{leagueId_userId}`.
- Assigned reviewers may query/read only their assigned categories.
- Season Administrators may manage assignments and publication but do not automatically pass evidence-decision checks.
- Only Platform Administrators may accept late proof.

## Atomic decisions

Rules validate the decision, claim update, audit event, optional contribution and notification together. Contributions use signed deltas for reversals. Existing decisions and snapshots cannot be updated or deleted.

## Published standings

- Administrators/evidence operators may read live contributions as needed for operations.
- v2 players read published snapshots instead of another player's live contributions.
- Snapshot creation is restricted to authorised season operators with matching audit metadata.
- Snapshot revision identifiers and league latest-snapshot pointers must remain consistent.

## Existing protections

Profile roles, account requests, season lifecycle, C.H.A.O.S., leadership, swaps, Pocket Week, libraries, announcements and error reports retain their existing least-privilege Rules.

## Test requirement

`npm run test:rules` must pass all **39 v0.18.0 Rules tests** using Java 21 before deploying `firestore.rules`. Expected `PERMISSION_DENIED` logs from negative assertions are not failures when the suite passes.

## v0.19 role-scoped operations reporting

The command centre does not expand Firestore authority. Platform and season administrators read records already permitted by v0.18.0 Rules. Category reviewers receive only assigned evidence claim/decision queries. Reports are generated from successfully read records, so unavailable data is not bypassed or inferred. Operations exports contain no proof media.

## Audited factual correction authority

Only Platform Administrators may create correction replacements, correction heads, correction records, correction contributions or correction-specific claim transitions. Rules keep user, category and challenge date fixed, block Pocket sources, require a matching audit event, enforce forward-only correction sequences and prevent corrected source entries from being deleted. Players may read only correction records that belong to them.

## Local Admin SDK trust boundary — v0.21.0

<!-- RELEASE_STATUS: DEPLOYED -->

The trusted reconciliation CLI runs outside the browser with a private service-account credential. Admin SDK access bypasses client Security Rules, so the command narrows its own authority through dry-run defaults, integrity gates, explicit publication confirmation, immutable writes and idempotent fingerprints.

Credential files and local reports are ignored by Git. No client can write `seasonTrustedRuns`, and only authorised operators can read those summaries.

## v0.22.0 trusted deletion boundary

- Browser clients cannot delete Firebase Authentication accounts or write execution/receipt records.
- Players may cancel only while a request is `requested` or `acknowledged`.
- Only Platform Administrators may read trusted execution and receipt records.
- The local Admin SDK credential is outside the repository and must never be embedded in the client.
- The processor blocks deletion of the final Platform Administrator.
- A dry audit and final live refresh precede any irreversible write.

## v0.23 Power Play security boundary

- Draft pool changes require a managed Draft season and a paired audit event.
- Registration/Active selection requires an authorised season operator, a valid official week, an unused enabled confirmed definition and a paired audit event.
- Players cannot write assignments or used-state fields.
- Players cannot read future-week assignments before the official start.
- A started assignment is locked from ordinary redraw.
- Locked correction requires Platform Administrator authority, a reason, an unused replacement and immutable history fields.
- Weekly assignment facts must match the frozen definition map.
- Trusted reconciliation remains the final publication integrity check.
