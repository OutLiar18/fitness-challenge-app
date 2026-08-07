# Champions Legacy Challenge — Active Migrations

<!-- RELEASE_STATUS: DEPLOYED -->
Last updated: 5 August 2026

## v0.22.0 trusted deletion

Status: Implementation, Windows verification and production deployment complete; release commit pending.

No bulk migration is required. Existing v1 account requests remain readable but should be cancelled/reopened or resubmitted under request version 2 before trusted processing.

New trusted records appear only when real processing begins:

- `accountDeletionExecutions/{executionId}` — administrator-only resumable execution state;
- `accountDeletionReceipts/{receiptId}` — administrator-only immutable completion receipt;
- one completion `auditEvents` record;
- anonymisation metadata on preserved shared records.

New and reopened account requests use policy `trusted-deletion-v1`, a seven-day window and explicit processing fields.

## Local operations

The Admin SDK credential and deletion reports remain outside the repository. No production credential is included in the updater or source archive.

## Compatibility

- Existing season and standings documents remain readable.
- Shared points and House history are not recalculated solely because an account is deleted.
- Trusted season reconciliation treats intentionally removed private correction entries as an anonymisation warning rather than corruption.
- Fresh registrations receive a new Firebase user ID and do not reconnect to former history.
