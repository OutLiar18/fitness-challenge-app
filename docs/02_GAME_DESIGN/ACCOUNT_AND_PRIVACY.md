# Champions Legacy Challenge — Account, Onboarding and Privacy

Last updated: 5 August 2026

## Purpose

This is the product source of truth for onboarding, privacy explanations, personal export, account-deletion requests and trusted account deletion.

## First-use onboarding

- New profiles start at onboarding version `0`.
- The guide covers product philosophy, factual logging, progression separation and season competition.
- Skipping or completing stores only onboarding state and timestamps.
- Legacy profiles without onboarding fields are treated as already onboarded.
- Players may replay the guide from Help & Privacy.

## Help & Privacy

The route provides getting-started guidance, data boundaries, personal export and account closure. Wording must remain plain and non-legalistic. A formal legal/privacy review and confirmed support contact remain required before public launch.

## Personal-data export

Schema version 3 includes owner-readable account data, account-request state and correction history. Timestamps are portable ISO strings. Shared public documents, administrator-only audits, trusted execution/receipt records and external WhatsApp media are not copied.

## Account-deletion policy

- Request document ID equals the current Firebase user ID.
- New and reopened requests use acknowledgement version `2` and policy `trusted-deletion-v1`.
- Statuses are `requested`, `acknowledged`, `processing`, `completed`, `failed` and `cancelled`.
- Players may request, cancel and reopen their own request before processing.
- Platform Administrators acknowledge requests with an audit record.
- Acknowledgement starts a seven-day cancellation window.
- Trusted processing is irreversible once it begins.
- Private data and Firebase Authentication are removed.
- Shared competition history is preserved under a deterministic Former Player identity.
- Fresh registration is allowed but never restores or reconnects the former history.

## External evidence boundary

The app does not upload or store WhatsApp proof media. Deletion can remove/anonymise structured app records but cannot erase external WhatsApp retention history.

## Shared-history principle

Deleting an account must not silently rewrite completed House results, standings, honours or other participants' legitimate records. Identity is anonymised while factual points and historical House allocation remain intact.


## Season composition responses

For `season-houses-v4` seasons, a player may optionally provide one self-declared composition response for that season. The response is not copied into the permanent user profile, can be changed or removed by the player, and does not affect points or Experience Points. Individual answers are readable only by the player, Platform Administrators and authorised season administrators when required for House-balancing operations. House leaders and ordinary players cannot inspect another player’s answer. Trusted account deletion removes the private response rather than retaining or anonymising it.
