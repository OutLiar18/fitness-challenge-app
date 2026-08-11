import assert from "node:assert/strict";
import test from "node:test";

import {
  CHAMPIONS_LEGACY_DATABASE_RESOURCE,
  CHAMPIONS_LEGACY_PROJECT_ID,
  RESTORE_ACKNOWLEDGEMENT,
  createFirestoreRecoveryPlan,
  getFirestoreRecoveryPlanSha256,
  getRestoreCommandPreview,
  validateRecoveryDatabaseId,
} from "../scripts/trusted-firestore-recovery-plan.mjs";

const backupMetadata = {
  name: "projects/fitnesschallengeapp-9e87f/locations/africa-south1/backups/backup-001",
  database: CHAMPIONS_LEGACY_DATABASE_RESOURCE,
  databaseUid: "11111111-2222-4333-8444-555555555555",
  snapshotTime: "2026-08-11T08:00:00.000Z",
  expireTime: "2026-09-01T08:00:00.000Z",
  state: "READY",
};

function validPlan(overrides = {}) {
  return createFirestoreRecoveryPlan({
    backupMetadata,
    destinationProjectId: CHAMPIONS_LEGACY_PROJECT_ID,
    destinationDatabaseId: "recovery-20260811",
    operatorId: "admin-one",
    reason: "Recover from verified accidental data loss.",
    acknowledgement: RESTORE_ACKNOWLEDGEMENT,
    applicationCommit: "fa5342581fb0a8b595d77fc488bd05eb6219c3c9",
    rulesSha256: "4740edd168e495a70ac8a6252bb57c3986d30995b5372198c357adaa859f6b84",
    now: new Date("2026-08-11T09:00:00.000Z"),
    ...overrides,
  });
}

test("trusted recovery planner binds exact Champions Legacy backup provenance", () => {
  const plan = validPlan();
  assert.equal(plan.source.projectId, CHAMPIONS_LEGACY_PROJECT_ID);
  assert.equal(plan.source.databaseResource, CHAMPIONS_LEGACY_DATABASE_RESOURCE);
  assert.equal(plan.source.backupState, "READY");
  assert.equal(plan.destination.databaseId, "recovery-20260811");
  assert.equal(plan.constraints.restoreToNewDatabaseOnly, true);
  assert.equal(plan.constraints.productionDefaultDatabaseForbidden, true);
  assert.equal(plan.constraints.sourceDatabaseDeletionForbidden, true);
  assert.equal(plan.constraints.commandExecutionSupportedByPlanner, false);
  assert.match(getFirestoreRecoveryPlanSha256(plan), /^[0-9a-f]{64}$/);
});

test("trusted recovery planner forbids the production default database as a destination", () => {
  assert.throws(
    () => validPlan({ destinationDatabaseId: "(default)" }),
    /production \(default\) database is forbidden/,
  );
});

test("trusted recovery planner requires a clearly named new recovery database", () => {
  assert.throws(() => validateRecoveryDatabaseId("prod-copy"), /must begin with recovery-/);
  assert.equal(validateRecoveryDatabaseId("recovery-safe-01"), "recovery-safe-01");
});

test("trusted recovery planner rejects backup provenance from another project or database", () => {
  assert.throws(
    () => validPlan({
      backupMetadata: {
        ...backupMetadata,
        name: "projects/other-project/locations/africa-south1/backups/backup-001",
      },
    }),
    /Backup provenance project mismatch/,
  );

  assert.throws(
    () => validPlan({
      backupMetadata: {
        ...backupMetadata,
        database: "projects/fitnesschallengeapp-9e87f/databases/other",
      },
    }),
    /Backup provenance database mismatch/,
  );
});

test("trusted recovery planner rejects unusable backup state and expiry", () => {
  assert.throws(
    () => validPlan({
      backupMetadata: { ...backupMetadata, state: "CREATING" },
    }),
    /Backup must be READY/,
  );

  assert.throws(
    () => validPlan({
      backupMetadata: {
        ...backupMetadata,
        expireTime: "2026-08-11T08:30:00.000Z",
      },
    }),
    /Backup has expired/,
  );
});

test("trusted recovery planner requires explicit new-database acknowledgement", () => {
  assert.throws(
    () => validPlan({ acknowledgement: "RESTORE_ANYWHERE" }),
    new RegExp(RESTORE_ACKNOWLEDGEMENT),
  );
});

test("restore preview contains no source-database deletion and targets only the recovery database", () => {
  const preview = getRestoreCommandPreview(validPlan());
  assert.match(preview, /^gcloud firestore databases restore /);
  assert.match(preview, /--destination-database=recovery-20260811/);
  assert.doesNotMatch(preview, /databases delete/);
  assert.doesNotMatch(preview, /--destination-database=\(default\)/);
});
