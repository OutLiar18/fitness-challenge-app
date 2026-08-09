# Champions Legacy Challenge — Trusted Account Deletion

Last updated: 5 August 2026

## Purpose

This document defines the approved v0.22.0 account-deletion policy. The browser records and displays the request; only a trusted Firebase Admin SDK process may perform irreversible deletion.

## Locked policy

- A Platform Administrator must acknowledge the request.
- A seven-day cancellation window begins at acknowledgement.
- The player may cancel while the request is `requested` or `acknowledged`.
- Once trusted processing begins, cancellation is no longer available.
- Eligible private account records and the Firebase Authentication user are removed.
- Shared season, House, standings, honours and audit history are preserved under a stable anonymous identity.
- A deleted person may register again as a completely new account.
- Previous history is never restored or automatically linked to the new account.

## Lifecycle

1. `requested` — submitted by the signed-in player.
2. `acknowledged` — reviewed by a Platform Administrator; seven-day window active.
3. `processing` — trusted deletion has started and is irreversible.
4. `completed` — Authentication and eligible private records are removed; shared history is anonymised.
5. `failed` — processing stopped safely and may be resumed by a Platform Administrator.
6. `cancelled` — the player cancelled before processing.

## Anonymous history

The trusted tool derives one deterministic identity from the former Firebase user ID:

- identifier: `former-<stable hash>`;
- display name: `Former Player XXXX`;
- neutral built-in avatar.

The alias preserves historical relationships without retaining the player's name or email. Points and House allocation are not recalculated merely because the player deleted their account.

## Private records removed

The processor removes eligible account-owned data such as:

- the Firebase Authentication user;
- the user profile and private profile subcollections;
- challenge entries;
- private notifications;
- owner-readable client error reports;
- retired legacy reviewer assignments, when present.

## Shared records anonymised

Where the record must remain truthful for other participants, identity fields are replaced rather than deleting the record. This includes relevant memberships, contributions, evidence and correction history, Pocket records, votes, season snapshots, House records and audit references.

## Safety requirements

- Dry audit is the default and performs no mutation.
- Processing requires an explicit `DELETE <CODE>` confirmation.
- The request and data plan are refreshed immediately before processing.
- A changed plan requires a new review unless resuming a recorded failed execution.
- The last Platform Administrator cannot be deleted.
- Completion creates an administrator-only receipt and audit event.
- Credentials and reports remain outside the repository.

## Out of scope

- automatic scheduled processing;
- legal conclusions or retention promises;
- restoring deleted history;
- deleting another player's shared competition result;
- client-side deletion using ordinary browser permissions.
