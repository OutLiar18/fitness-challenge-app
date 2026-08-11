import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const FIRESTORE_RECOVERY_PLAN_VERSION = "trusted-firestore-recovery-plan-v1";
export const CHAMPIONS_LEGACY_PROJECT_ID = "fitnesschallengeapp-9e87f";
export const CHAMPIONS_LEGACY_DATABASE_ID = "(default)";
export const CHAMPIONS_LEGACY_DATABASE_RESOURCE =
  `projects/${CHAMPIONS_LEGACY_PROJECT_ID}/databases/${CHAMPIONS_LEGACY_DATABASE_ID}`;
export const RESTORE_ACKNOWLEDGEMENT = "RESTORE_TO_NEW_DATABASE_ONLY";

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([first], [second]) => first.localeCompare(second))
        .map(([key, nested]) => [key, stableValue(nested)]),
    );
  }
  return value;
}

function requireNonEmpty(value, label) {
  const normalized = String(value ?? "").trim();
  if (!normalized) throw new Error(`${label} is required.`);
  return normalized;
}

function parseTimestamp(value, label) {
  const normalized = requireNonEmpty(value, label);
  const timestamp = Date.parse(normalized);
  if (!Number.isFinite(timestamp)) throw new Error(`${label} must be a valid timestamp.`);
  return { normalized, timestamp };
}

export function validateRecoveryDatabaseId(value) {
  const databaseId = requireNonEmpty(value, "Destination database ID");
  if (databaseId === CHAMPIONS_LEGACY_DATABASE_ID) {
    throw new Error("Restoring to the production (default) database is forbidden by the normal recovery planner.");
  }
  if (!databaseId.startsWith("recovery-")) {
    throw new Error("Destination database ID must begin with recovery-.");
  }
  if (databaseId.length < 4 || databaseId.length > 63) {
    throw new Error("Destination database ID must be between 4 and 63 characters.");
  }
  if (!/^[a-z][a-z0-9-]*[a-z0-9]$/.test(databaseId)) {
    throw new Error("Destination database ID contains unsupported characters or boundary characters.");
  }
  const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidLike.test(databaseId)) {
    throw new Error("Destination database ID must not be UUID-like.");
  }
  return databaseId;
}

export function normalizeBackupMetadata(metadata = {}) {
  const name = requireNonEmpty(metadata.name, "Backup resource name");
  const database = requireNonEmpty(metadata.database, "Backup database resource");
  const databaseUid = requireNonEmpty(
    metadata.databaseUid ?? metadata.database_uid,
    "Backup database UID",
  );
  const state = requireNonEmpty(metadata.state, "Backup state").toUpperCase();
  const snapshot = parseTimestamp(metadata.snapshotTime ?? metadata.snapshot_time, "Backup snapshot time");
  const expiry = parseTimestamp(metadata.expireTime ?? metadata.expire_time, "Backup expiry time");

  const backupPattern = /^projects\/([^/]+)\/locations\/([^/]+)\/backups\/([^/]+)$/;
  const match = name.match(backupPattern);
  if (!match) {
    throw new Error("Backup resource name must match projects/{project}/locations/{location}/backups/{backup}.");
  }

  return {
    name,
    projectId: match[1],
    location: match[2],
    backupId: match[3],
    database,
    databaseUid,
    state,
    snapshotTime: snapshot.normalized,
    snapshotTimestamp: snapshot.timestamp,
    expireTime: expiry.normalized,
    expireTimestamp: expiry.timestamp,
  };
}

export function createFirestoreRecoveryPlan({
  backupMetadata,
  destinationProjectId = CHAMPIONS_LEGACY_PROJECT_ID,
  destinationDatabaseId,
  operatorId,
  reason,
  acknowledgement,
  applicationCommit,
  rulesSha256,
  now = new Date(),
} = {}) {
  const backup = normalizeBackupMetadata(backupMetadata);
  const destinationProject = requireNonEmpty(destinationProjectId, "Destination project ID");
  const destinationDatabase = validateRecoveryDatabaseId(destinationDatabaseId);
  const operator = requireNonEmpty(operatorId, "Operator ID");
  const recoveryReason = requireNonEmpty(reason, "Recovery reason");
  const commit = requireNonEmpty(applicationCommit, "Application commit");
  const rulesSha = requireNonEmpty(rulesSha256, "Firestore Rules SHA-256");
  const acknowledged = requireNonEmpty(acknowledgement, "Restore acknowledgement");

  if (acknowledged !== RESTORE_ACKNOWLEDGEMENT) {
    throw new Error(`Restore acknowledgement must equal ${RESTORE_ACKNOWLEDGEMENT}.`);
  }
  if (backup.projectId !== CHAMPIONS_LEGACY_PROJECT_ID) {
    throw new Error(
      `Backup provenance project mismatch. Expected ${CHAMPIONS_LEGACY_PROJECT_ID}, found ${backup.projectId}.`,
    );
  }
  if (backup.database !== CHAMPIONS_LEGACY_DATABASE_RESOURCE) {
    throw new Error(
      `Backup provenance database mismatch. Expected ${CHAMPIONS_LEGACY_DATABASE_RESOURCE}, found ${backup.database}.`,
    );
  }
  if (backup.state !== "READY") {
    throw new Error(`Backup must be READY before planning a restore; found ${backup.state}.`);
  }
  if (destinationProject !== CHAMPIONS_LEGACY_PROJECT_ID) {
    throw new Error("Normal Champions Legacy recovery must restore into the same Firebase/Google Cloud project.");
  }

  const nowTimestamp = now instanceof Date ? now.getTime() : Date.parse(now);
  if (!Number.isFinite(nowTimestamp)) throw new Error("Recovery planning time is invalid.");
  if (backup.snapshotTimestamp > nowTimestamp) {
    throw new Error("Backup snapshot time cannot be in the future.");
  }
  if (backup.expireTimestamp <= nowTimestamp) {
    throw new Error("Backup has expired or expires at the current planning time.");
  }
  if (!/^[0-9a-f]{64}$/i.test(rulesSha)) {
    throw new Error("Firestore Rules SHA-256 must be a 64-character hexadecimal digest.");
  }
  if (!/^[0-9a-f]{7,40}$/i.test(commit)) {
    throw new Error("Application commit must be a hexadecimal Git commit identifier.");
  }

  const createdAt = new Date(nowTimestamp).toISOString();
  const plan = {
    planVersion: FIRESTORE_RECOVERY_PLAN_VERSION,
    createdAt,
    source: {
      projectId: CHAMPIONS_LEGACY_PROJECT_ID,
      databaseId: CHAMPIONS_LEGACY_DATABASE_ID,
      databaseResource: CHAMPIONS_LEGACY_DATABASE_RESOURCE,
      databaseUid: backup.databaseUid,
      backupResource: backup.name,
      backupLocation: backup.location,
      backupId: backup.backupId,
      backupState: backup.state,
      snapshotTime: backup.snapshotTime,
      expireTime: backup.expireTime,
    },
    destination: {
      projectId: destinationProject,
      databaseId: destinationDatabase,
      databaseResource: `projects/${destinationProject}/databases/${destinationDatabase}`,
    },
    evidence: {
      operatorId: operator,
      reason: recoveryReason,
      acknowledgement: acknowledged,
      applicationCommit: commit,
      rulesSha256: rulesSha.toLowerCase(),
    },
    constraints: {
      restoreToNewDatabaseOnly: true,
      productionDefaultDatabaseForbidden: true,
      sourceDatabaseDeletionForbidden: true,
      commandExecutionSupportedByPlanner: false,
    },
  };

  return plan;
}

export function getFirestoreRecoveryPlanSha256(plan) {
  const canonical = JSON.stringify(stableValue(plan));
  return crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
}

export function getRestoreCommandPreview(plan) {
  if (!plan?.constraints?.restoreToNewDatabaseOnly) {
    throw new Error("Recovery plan does not carry the new-database-only safety contract.");
  }
  return [
    "gcloud firestore databases restore",
    `--project=${plan.destination.projectId}`,
    `--source-backup=${plan.source.backupResource}`,
    `--destination-database=${plan.destination.databaseId}`,
  ].join(" ");
}

export function writeFirestoreRecoveryPlan(plan, reportDirectory) {
  const directory = path.resolve(
    reportDirectory ||
      path.join(os.homedir(), ".champions-legacy", "firestore-recovery"),
  );
  fs.mkdirSync(directory, { recursive: true });

  const sha256 = getFirestoreRecoveryPlanSha256(plan);
  const stamp = plan.createdAt.replace(/[:.]/g, "-");
  const filename = `firestore-recovery-plan-${stamp}-${plan.destination.databaseId}.json`;
  const filepath = path.join(directory, filename);
  const wrapper = {
    metadata: {
      reportType: "champions-legacy-firestore-recovery-plan",
      planVersion: FIRESTORE_RECOVERY_PLAN_VERSION,
      sha256,
    },
    plan,
    commandPreview: getRestoreCommandPreview(plan),
  };

  fs.writeFileSync(
    filepath,
    `${JSON.stringify(wrapper, null, 2)}\n`,
    { encoding: "utf8", mode: 0o600, flag: "wx" },
  );

  return { filepath, sha256, commandPreview: wrapper.commandPreview };
}

function parseArgs(argv) {
  const options = {
    backupMetadataPath: "",
    destinationDatabaseId: "",
    operatorId: "",
    reason: "",
    acknowledgement: "",
    applicationCommit: "",
    rulesSha256: "",
    reportDirectory: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--backup-metadata") options.backupMetadataPath = argv[++index] || "";
    else if (value === "--destination-database") options.destinationDatabaseId = argv[++index] || "";
    else if (value === "--operator") options.operatorId = argv[++index] || "";
    else if (value === "--reason") options.reason = argv[++index] || "";
    else if (value === "--acknowledge") options.acknowledgement = argv[++index] || "";
    else if (value === "--application-commit") options.applicationCommit = argv[++index] || "";
    else if (value === "--rules-sha") options.rulesSha256 = argv[++index] || "";
    else if (value === "--report-dir") options.reportDirectory = argv[++index] || "";
    else if (value === "--help" || value === "-h") options.help = true;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return options;
}

function printHelp() {
  console.log(`Champions Legacy Challenge — trusted Firestore recovery planner

This command creates a private restore PLAN only. It never invokes gcloud,
Firebase, Firestore restore, backup-schedule creation or database deletion.

Required:
  --backup-metadata <json>     JSON from a trusted backup describe/list workflow.
  --destination-database <id> New database ID beginning with recovery-.
  --operator <id>              Platform Administrator/operator identifier.
  --reason <text>              Recovery reason/evidence.
  --acknowledge ${RESTORE_ACKNOWLEDGEMENT}
  --application-commit <sha>   Application source commit associated with recovery.
  --rules-sha <sha256>         Firestore Rules SHA-256 associated with recovery.

Optional:
  --report-dir <path>          Private local output directory.
`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const metadataPath = path.resolve(requireNonEmpty(options.backupMetadataPath, "Backup metadata path"));
  if (!fs.existsSync(metadataPath)) throw new Error(`Backup metadata file not found: ${metadataPath}`);
  const backupMetadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));

  const plan = createFirestoreRecoveryPlan({
    backupMetadata,
    destinationDatabaseId: options.destinationDatabaseId,
    operatorId: options.operatorId,
    reason: options.reason,
    acknowledgement: options.acknowledgement,
    applicationCommit: options.applicationCommit,
    rulesSha256: options.rulesSha256,
  });
  const output = writeFirestoreRecoveryPlan(plan, options.reportDirectory);

  console.log("Trusted Firestore recovery PLAN created.");
  console.log(`Plan path       : ${output.filepath}`);
  console.log(`Plan SHA-256    : ${output.sha256}`);
  console.log(`Backup          : ${plan.source.backupResource}`);
  console.log(`Snapshot        : ${plan.source.snapshotTime}`);
  console.log(`Destination     : ${plan.destination.databaseResource}`);
  console.log(`Command preview : ${output.commandPreview}`);
  console.log("Command executed: NO");
  console.log("Production DB   : UNCHANGED");
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) {
  main().catch((error) => {
    console.error(error?.stack || error);
    process.exitCode = 1;
  });
}
