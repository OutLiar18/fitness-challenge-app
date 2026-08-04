# Champions Legacy Challenge — Security Model

Last updated: 4 August 2026  
Current release target: v0.17.0  
Current production: v0.16.0

## Principles

Firebase Authentication establishes identity. Firestore Rules enforce ownership, trusted authority, document shape, atomic relationships and historical immutability. React visibility is never treated as security.

## Player profiles and onboarding

- New profile creation is owner-only and begins with role `user` and onboarding version `0`.
- Players may change only constrained presentation and onboarding fields.
- Completing or replaying onboarding cannot alter role, membership, score or competition history.
- Legacy profiles without onboarding fields remain valid.
- Trusted role changes require a Platform Administrator and a matching audit event.

## Account deletion requests

- One request document is keyed by the requesting user ID.
- Players may create, cancel or reopen only their own request and only through the constrained lifecycle.
- Platform Administrators may list requests and acknowledge a newly requested item.
- Acknowledgement must set the acting administrator, timestamp and audit identifier in one batch.
- Rules deny client deletion of the request document and do not grant the client authority to delete Authentication or shared history.

## Personal export access

Players may query records that are already account-owned, including their own entries, memberships, contributions, Pocket records, notifications, suggestions, leadership votes and sanitised error reports. Queries must still satisfy owner predicates; unrelated records remain inaccessible. Administrator-only audit history is not part of the personal export.

## Seasons, Houses and C.H.A.O.S.

- Only authorised operators create season Drafts and advance audited lifecycle stages.
- Houses are created only in an administrator-managed Draft.
- C.H.A.O.S. requires Registration, a complete House set and at least two registered players per House.
- Assignment, state, audit and private notifications commit atomically.
- Permanent global Team collections are denied.

## Leadership, swaps and Pocket Week

- Current House members cast one private vote per election.
- Leadership finalisation must match the election and audit history.
- Weekly swaps update two memberships, two House locks, one swap record and an audit event atomically; current leaders cannot be moved.
- Pocket deposits are private zero-point reserves in the official pre-season window.
- Redemption creates the source update, receipt, challenge entry, House contribution and notification atomically from stored facts.

## Trust boundary

Rules do not reproduce the complete Points Engine. Friendly competition is supported; prizes or money require trusted server-side recalculation. Complete account deletion likewise requires a trusted server/Admin SDK process with an explicit shared-history policy.

## Rule implementation guardrails

- Optional authentication claims use safe defaults.
- Mutually exclusive operations dispatch through only the applicable validation branch.
- Category-shaped entry validation dispatches by category to stay below the Rules expression ceiling.
- Direct get of a missing own account request is allowed so the UI can distinguish “no request” from “permission denied.”

## Test requirement

`npm run test:rules` must pass all 30 v0.17.0 Rules tests using Java 21 before deploying `firestore.rules`.
