# Champions Legacy Challenge — Security Model

Last updated: 3 August 2026  
Current release: v0.14.0

## Principles

Firebase Authentication establishes identity. Firestore Rules enforce ownership, trusted authority, document shape, atomic relationships and historical immutability. React visibility is never treated as security.

## Season creation and lifecycle

- Only a Platform Administrator or trusted League Administrator creates a season Draft.
- The season, closed invite and audit event are created together.
- Lifecycle moves forward only and remains audited.
- An Active House season requires C.H.A.O.S. to have completed.
- Participant count is transactionally paired with registration membership.

## Houses and C.H.A.O.S.

- Houses are created only in an administrator-managed Draft.
- C.H.A.O.S. requires Registration, a complete House set and at least two registered players per House.
- Membership assignment, league state, audit event and private assignment notifications commit atomically.
- Permanent global Team collections are denied.

## Leadership and swaps

- A current House member casts one private vote per election.
- Ballots are readable only according to player/admin scope.
- House leadership finalisation must match a finalised election and audit event.
- A Captain may add one additional current-House Vice-Captain without changing the elected primary role.
- Weekly swaps require two membership updates, two House locks, one swap record and an audit event in one transaction.
- Current leaders cannot be moved.

## Pocket Week

- Deposits require owner registration, official Pocket dates and category-shaped data.
- Pocket documents are private.
- Deposits remain zero-point reserves.
- Redemption requires Active membership and creates the source update, receipt, challenge entry, House contribution and notification atomically.
- The scored entry must match the quantity redeemed from the stored Pocket document; complete-session data must match exactly and Cardio difficulty metadata cannot be substituted.
- Whole-number categories reject fractional quantities, and the service rebuilds redemptions from live Firestore data rather than caller-supplied activity details.
- Pocket entries cannot be deleted to restore balance.

## Notifications

Notification creation is event-specific. Administrators may send season/assignment/result notices; a House leader may announce only their own House ballot; roster notices must match the recipient’s post-transaction House; Pocket notices are self-created by the redemption transaction. Players read only their own notifications.

## Trust boundary

Rules do not reproduce the complete Points Engine. Friendly competition is supported; prizes or money require trusted server-side recalculation.

## Rule implementation guardrails

- Optional authentication claims are read with defaults so an ordinary player without an `admin` claim is evaluated as non-administrative rather than producing a Rules evaluation error.
- Mutually exclusive operations such as election finalisation and Captain appointment dispatch through only the applicable validation branch.
- Category-shaped challenge-entry validation dispatches by category instead of evaluating every category branch, keeping atomic Pocket redemption below the Rules expression ceiling.

## Test requirement

`npm run test:rules` must pass all 25 v0.14.0 tests before deploying `firestore.rules`.
