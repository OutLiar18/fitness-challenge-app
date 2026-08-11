# Champions Legacy Challenge — v0.26 Trusted Account-Deletion Recovery

Date: 11 August 2026
Checkpoint: 26F
Production baseline: v0.25.0
Development branch: `development/v0.26.0`

## Purpose

26F hardens the trusted Admin SDK account-deletion processor against interruption
between irreversible steps. It does not run a deletion and it does not deploy
Firebase changes.

## Previous recovery exposure

The existing processor already had important safety controls:

- dry audit by default;
- seven-day post-acknowledgement cancellation window;
- a different current Platform Administrator as operator;
- final-Platform-Administrator protection;
- Firebase Authentication disable + refresh-token revocation before Firestore mutation;
- batched Firestore mutation;
- Firebase Authentication deletion after Firestore cleanup;
- processing / failed / completed execution states;
- immutable completion receipt and audit record.

However, a processing/failed retry rebuilt its live deletion sources by querying
the original user ID. If an earlier Firestore batch had already anonymised some
records, those documents could stop matching the original ID. The retry could
therefore see a different path/count set from the execution that originally
started.

## 26F recovery contract

### 1. Freeze before processing

Before a new request is marked `processing`, the trusted tool creates an
execution ID and writes a private local recovery plan.

The recovery plan contains:

- recovery-plan version;
- trusted deletion model version;
- execution ID;
- request ID;
- original subject user ID;
- original audit fingerprint;
- initial Platform Administrator operator ID;
- source identity used for replacement;
- deterministic anonymised identity;
- original planned counts;
- per-league participant-count decrements;
- exact document paths, collection names, IDs and delete/anonymise modes.

The plan is stored in the existing private report directory, not the Git
repository. The file is created with restrictive file permissions where the
operating system supports them.

### 2. Bind the plan to Firestore execution state

The execution record stores:

- recovery-plan version;
- recovery-plan SHA-256;
- recovery-plan operation count;
- total Firestore batches;
- completed Firestore batches;
- current execution phase.

The request is changed to `processing` only after the private recovery-plan file
has been successfully written.

### 3. Explicit phases

The trusted execution records progress through:

- `prepared`;
- `auth-locking`;
- `auth-locked`;
- `firestore-mutating`;
- `firestore-complete`;
- `auth-deleted`;
- `completed`.

A failure records the phase at which processing stopped.

### 4. Resume from the frozen path set

A `processing` or `failed` request may not silently create a new execution.

The tool loads the original recovery plan from:

- the normal private report directory; or
- an explicit `--recovery-plan <path>` supplied by the operator.

The plan must match the request/execution ID, subject, trusted deletion model,
original fingerprint, recovery-plan SHA-256 and operation count.

If the plan is missing or mismatched, the resume stops before further mutation.

### 5. Idempotent replay

Each frozen Firestore batch is reconstructed by direct document path rather
than by re-querying the original UID.

For a planned delete:

- an existing document is deleted;
- an already-missing document is treated as already deleted.

For a planned anonymisation:

- a document already stamped with the same
  `accountDeletionExecutionId` is treated as already completed;
- an unprocessed document is anonymised using the frozen identity/league-count
  context;
- a missing anonymisation target is an error;
- a document already stamped by a different deletion execution is an error.

Batch progress is written after each committed plan slice. If the process stops
after a batch commit but before the progress marker, replaying that slice remains
safe because already-anonymised same-execution records are skipped and deletes
are idempotent.

## Authentication ordering

26F preserves the existing ordering:

1. disable the Firebase Authentication user;
2. revoke refresh tokens;
3. perform Firestore deletion/anonymisation;
4. delete the Firebase Authentication user;
5. atomically write completion receipt, audit and completed request/execution state.

On retry, an already-missing Authentication user is tolerated because the
Firestore recovery plan remains the authoritative cleanup path.

## Operator handling

The recovery plan records the initial operator. A resume may be performed by a
different current Platform Administrator; the execution records the latest
operator and resume count while the final receipt preserves both the initial and
completing operator context.

## Security boundary

The recovery-plan file contains identifiers and operational metadata and must be
treated as private administrator material.

It must:

- stay outside Git;
- stay outside Firebase Hosting;
- never be attached to a user-facing support response;
- be transferred securely if recovery must move to another trusted operator
  machine;
- be retained only as long as operational/audit requirements justify.

The recovery plan is **not** a rollback promise. Once trusted deletion processing
begins, the user-facing cancellation window is over. The plan exists to finish
an interrupted deletion consistently, not to reconstruct a deleted account.

## 26F validation

The checkpoint must pass:

- structural recovery-model tests;
- duplicate-path rejection;
- execution/plan drift rejection;
- replay-safe same-execution detection;
- conflicting-execution detection;
- full application regression gate;
- full Firestore Rules gate;
- frozen Firestore Rules SHA verification.

The checkpoint runner never invokes `account:deletion:process`.

## Next boundary

Project-level Firestore backup/restore tooling is a separate concern. The next
operational checkpoint should design safeguards for backup provenance,
target-project verification, restore dry runs, destructive confirmation and
restore evidence without conflating those controls with per-account deletion.
