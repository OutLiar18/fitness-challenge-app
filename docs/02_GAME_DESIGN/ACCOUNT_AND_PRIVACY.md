# Champions Legacy Challenge — Account, Onboarding and Privacy

Last updated: 4 August 2026

## Purpose

This document is the product source of truth for first-use onboarding, player-facing privacy explanations, personal-data export and account-closure requests.

## First-use onboarding

- New profiles start at onboarding version `0`.
- The guide contains four concise stages: product philosophy, factual logging, progression separation and season competition.
- Completion stores only the onboarding version and timestamps.
- Skipping the tour counts as completion; it does not change points, entries or membership.
- Legacy profiles without onboarding fields are treated as already onboarded so existing players are not interrupted.
- Players may replay the guide from Help & Privacy.

## Help & Privacy

The route is the single player-facing destination for:

- getting started;
- how factual data and derived results differ;
- privacy and trusted-role boundaries;
- personal export;
- account-deletion requests.

The wording must remain plain, honest and non-legalistic. Before public launch, a confirmed support contact and formal legal/privacy review are still required.

## Personal-data export

The export is a JSON file generated only when the signed-in player asks for it. It includes account-owned records that the client can read, including profile, entries, memberships, contributions, Pocket records, notifications, private preferences, suggestions, private votes, sanitised own error reports and an account request.

Shared public documents, administrator-only audit history and unrelated players' records are not duplicated. Derived points, streaks and analytics can be recalculated from factual entries.

## Account-deletion request

- Document ID equals the player's Firebase user ID.
- Statuses are `requested`, `acknowledged` and `cancelled`.
- Players may request, cancel and reopen their own request.
- Platform Administrators may read all requests and acknowledge a newly requested item with an audit record.
- Acknowledgement means the request has been seen. It does not mean Authentication or data has already been deleted.
- Completed shared season records must not be silently altered.

## Deferred trusted deletion

A server-side or trusted Firebase Admin SDK process is still required to:

- re-verify the account and request;
- delete Firebase Authentication;
- remove eligible private account records;
- anonymise or preserve legitimate shared competition history appropriately;
- record operational completion outside the client.

The client must never pretend that a request has completed this process.
