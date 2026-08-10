# Champions Legacy Challenge — User Roles

Last updated: 4 August 2026

## Principle

Roles grant the minimum authority needed. Navigation is convenience; Firestore Security Rules are authority.

## Player

A Player can manage their constrained profile, log activity, view personal evidence status, copy verification IDs, join seasons, participate in eligible ballots, use allowed Pocket actions, download account-owned data and manage their deletion request.

A Player cannot self-verify proof, see another player's private claim, read live standings, publish snapshots, grant trusted roles or rewrite shared history.

## House Captain and Vice-Captain

These are season-scoped responsibilities. They may perform the current House actions allowed by season rules. Leadership does not automatically grant evidence-review authority.

## Season Administrator

A Season Administrator manages assigned seasons, lifecycle actions, Houses and authorised snapshot publication. Season administration does not grant proof-decision authority.

## Platform Administrator

A Platform Administrator may manage trusted roles, publish announcements and libraries, operate all seasons, review every evidence category, accept or reject proof, reverse evidence decisions, accept late proof with a reason, publish/correct snapshots, acknowledge deletion requests and read immutable audit history.

## Trusted server operator

Deferred trusted operations include Firebase Authentication deletion, reliable scheduled publication, prize-bearing recalculation and reconciliation. These are not ordinary client roles.

## Audit rule

Privileged changes affecting authority, evidence, published standings, competition lifecycle or account-request state must produce matching immutable audit records where required.

## Entry correction authority

- **Player:** may read correction history for their own entries; cannot create, update or delete corrections.
- **Season Administrator:** does not gain factual correction authority merely by managing a season.
- **Platform Administrator:** may create audited factual replacements and targeted integrity reports across the platform.
