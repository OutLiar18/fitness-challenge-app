# Champions Legacy Challenge — v0.26 Firestore Backup/Restore Safeguards

Date: 11 August 2026
Checkpoint: 26G
Production baseline: v0.25.0
Development branch: `development/v0.26.0`

## Purpose

26G defines and tests the project-level Firestore recovery safety contract without
creating a backup schedule, restoring a database, deleting a database, modifying
production data or deploying Firebase.

The checkpoint adds a **planning-only** operator tool. It validates trusted backup
metadata and produces a private SHA-bound recovery plan plus a restore-command
preview. It contains no command-execution capability.

## Firebase recovery facts used by the design

Cloud Firestore scheduled backups are consistent point-in-time copies. A backup
contains Firestore data and index configurations from that point in time, but does
not contain TTL policies. Backups remain in the source database location and may
be configured on daily or weekly schedules with configurable retention, up to the
documented maximum retention window.

Scheduled backup restore creates a **new Firestore database**. The restored
database uses the backup's location and the destination database ID must not
already be in use.

Firestore also documents an in-place recovery procedure, but that flow requires
deleting the existing source database before restoring to the old ID. That is an
irreversible, high-risk disaster procedure and is intentionally outside the
normal Champions Legacy recovery planner.

## 26G normal recovery contract

The safe normal recovery path is:

1. identify a completed/READY backup;
2. capture its trusted metadata;
3. validate that it belongs to project `fitnesschallengeapp-9e87f`;
4. validate that its source database is exactly
   `projects/fitnesschallengeapp-9e87f/databases/(default)`;
5. validate that the backup has not expired;
6. select a **new** database ID beginning with `recovery-`;
7. create a private local recovery plan;
8. bind the plan to the current application commit and Firestore Rules hash;
9. independently review the plan/backup before any later execution stage;
10. only a separately reviewed recovery activation may execute a restore.

## Hard prohibitions in the planner

The planner rejects:

- `(default)` as the destination database;
- any destination not beginning with `recovery-`;
- a backup belonging to another project;
- a backup whose recorded source database is not the Champions Legacy default database;
- a backup whose state is not `READY`;
- an expired backup;
- an incorrect explicit acknowledgement;
- an invalid Git commit or Rules SHA evidence field.

The planner carries explicit safety flags stating:

- restore to new database only;
- production default database forbidden;
- source database deletion forbidden;
- command execution unsupported by the planner.

## Private recovery plan

The generated private JSON plan records:

- plan version and creation time;
- backup resource, project, location and backup ID;
- source database resource and database UID;
- backup state, snapshot time and expiry;
- destination project/database resource;
- operator ID;
- recovery reason;
- explicit new-database-only acknowledgement;
- application Git commit;
- Firestore Rules SHA-256;
- the four hard safety constraints;
- SHA-256 of the canonical plan.

The default output location is under the operator's home directory:
`.champions-legacy/firestore-recovery`.

The plan must remain outside Git and outside Hosting.

## Restore command preview

A valid plan may render the documented new-database restore command in preview
form:

`gcloud firestore databases restore --project=fitnesschallengeapp-9e87f --source-backup=<backup> --destination-database=recovery-...`

The 26G planner never executes that command.

The planner contains no `child_process` import, no database-delete command and no
backup-schedule creation command.

## Backup schedule boundary

26G does not assume that scheduled backups are already enabled. Scheduled backups
require the appropriate Firebase/Google Cloud billing and IAM configuration.

A later read-only checkpoint should inspect:

- current database location/edition;
- whether PITR is enabled;
- current backup schedules;
- available backup metadata;
- the operator's effective permissions;
- billing/Blaze readiness where appropriate.

Only after that discovery should a dedicated production-change checkpoint consider
creating or changing a backup schedule.

## Restore activation boundary

A later restore activation must separately verify:

- local/remote approved recovery-plan SHA;
- backup still exists and is READY;
- backup database UID/resource still match;
- destination database does not exist;
- source production database remains present and untouched;
- operator identity/permissions;
- exact command line;
- recovery operation ID after submission;
- completion status;
- restored database accessibility and smoke validation;
- evidence/receipt retained privately.

The normal activation must not delete or overwrite `(default)`.

## In-place restore boundary

No normal Champions Legacy script should automate in-place restore.

If an exceptional disaster ever requires the documented in-place procedure, it
must be treated as a separate emergency runbook with explicit acknowledgement
that the source database must be deleted and that the operation cannot be undone.
That procedure must not be inferred from, or automatically escalated from, a
normal 26G recovery plan.

## Exit criteria

26G is complete when:

- the planning model/tests pass;
- the full application regression gate passes;
- the Firestore Rules emulator gate passes;
- Firestore Rules remain byte-for-byte unchanged;
- the planner contains no execution/deletion capability;
- no backup schedule is changed;
- no restore is executed;
- no Firebase deployment occurs.
