import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const TRUSTED_ACCOUNT_DELETION_RECOVERY_PLAN_VERSION =
  "trusted-account-deletion-recovery-v1";

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

function normalizeOperation(operation = {}) {
  const type = operation.type === "delete" ? "delete" : "anonymise";
  const documentPath = String(operation.path || "").trim();
  const collectionName = String(operation.collectionName || "").trim();
  const id = String(operation.id || documentPath.split("/").at(-1) || "").trim();
  if (!documentPath || !collectionName || !id) {
    throw new Error("Every trusted deletion recovery operation needs a path, collectionName and id.");
  }
  return {
    type,
    path: documentPath,
    collectionName,
    id,
  };
}

export function createTrustedDeletionRecoveryPlan({
  modelVersion,
  executionId,
  requestId,
  subjectUserId,
  fingerprint,
  actorId,
  source,
  identity,
  counts = {},
  leagueParticipantDecrements = {},
  operations = [],
  createdAt = new Date().toISOString(),
} = {}) {
  const normalizedOperations = operations
    .map(normalizeOperation)
    .sort((first, second) =>
      first.path.localeCompare(second.path) || first.type.localeCompare(second.type));

  const duplicatePaths = normalizedOperations
    .filter((operation, index) =>
      index > 0 && operation.path === normalizedOperations[index - 1].path)
    .map((operation) => operation.path);

  if (duplicatePaths.length) {
    throw new Error(
      `Trusted deletion recovery plan contains duplicate document paths: ${[...new Set(duplicatePaths)].join(", ")}`,
    );
  }

  const required = {
    modelVersion,
    executionId,
    requestId,
    subjectUserId,
    fingerprint,
    actorId,
  };
  Object.entries(required).forEach(([key, value]) => {
    if (!String(value || "").trim()) {
      throw new Error(`Trusted deletion recovery plan is missing ${key}.`);
    }
  });

  return {
    recoveryPlanVersion: TRUSTED_ACCOUNT_DELETION_RECOVERY_PLAN_VERSION,
    modelVersion,
    executionId,
    requestId,
    subjectUserId,
    fingerprint,
    actorId,
    source: stableValue(source ?? {}),
    identity: stableValue(identity ?? {}),
    counts: stableValue(counts),
    leagueParticipantDecrements: stableValue(leagueParticipantDecrements),
    operations: normalizedOperations,
    createdAt,
  };
}

export function getTrustedDeletionRecoveryPlanHash(plan) {
  const canonical = JSON.stringify(stableValue(plan));
  return crypto.createHash("sha256").update(canonical, "utf8").digest("hex");
}

export function getTrustedDeletionRecoveryPlanFilename(executionId) {
  const safeExecutionId = String(executionId || "")
    .trim()
    .replace(/[^A-Za-z0-9_-]+/g, "-");
  if (!safeExecutionId) {
    throw new Error("A trusted deletion execution ID is required for the recovery plan.");
  }
  return `execution-${safeExecutionId}-recovery-plan.json`;
}

export function writeTrustedDeletionRecoveryPlan(plan, reportDirectory) {
  const directory = path.resolve(reportDirectory);
  fs.mkdirSync(directory, { recursive: true });
  const sha256 = getTrustedDeletionRecoveryPlanHash(plan);
  const filepath = path.join(
    directory,
    getTrustedDeletionRecoveryPlanFilename(plan.executionId),
  );
  const wrapper = {
    metadata: {
      reportType: "trusted-account-deletion-recovery-plan",
      recoveryPlanVersion: TRUSTED_ACCOUNT_DELETION_RECOVERY_PLAN_VERSION,
      sha256,
      createdAt: plan.createdAt,
    },
    plan,
  };

  if (fs.existsSync(filepath)) {
    const existing = JSON.parse(fs.readFileSync(filepath, "utf8"));
    const existingHash = String(existing?.metadata?.sha256 || "");
    const recalculated = existing?.plan
      ? getTrustedDeletionRecoveryPlanHash(existing.plan)
      : "";
    if (existingHash !== sha256 || recalculated !== sha256) {
      throw new Error(
        `A different trusted deletion recovery plan already exists at ${filepath}.`,
      );
    }
    return { filepath, sha256, plan: existing.plan };
  }

  fs.writeFileSync(
    filepath,
    `${JSON.stringify(wrapper, null, 2)}\n`,
    { encoding: "utf8", mode: 0o600, flag: "wx" },
  );
  return { filepath, sha256, plan };
}

export function loadTrustedDeletionRecoveryPlan({
  executionId,
  reportDirectory,
  explicitPath = "",
} = {}) {
  const filepath = explicitPath
    ? path.resolve(explicitPath)
    : path.join(
      path.resolve(reportDirectory),
      getTrustedDeletionRecoveryPlanFilename(executionId),
    );

  if (!fs.existsSync(filepath)) {
    throw new Error(
      `Trusted deletion recovery plan not found: ${filepath}. ` +
      "Do not continue an interrupted deletion without the original recovery plan.",
    );
  }

  const wrapper = JSON.parse(fs.readFileSync(filepath, "utf8"));
  const plan = wrapper?.plan;
  if (!plan) throw new Error(`Invalid trusted deletion recovery plan file: ${filepath}`);

  const sha256 = getTrustedDeletionRecoveryPlanHash(plan);
  if (wrapper?.metadata?.sha256 !== sha256) {
    throw new Error(`Trusted deletion recovery plan hash mismatch: ${filepath}`);
  }
  if (plan.executionId !== executionId) {
    throw new Error(
      `Trusted deletion recovery plan execution mismatch. Expected ${executionId}, found ${plan.executionId}.`,
    );
  }
  return { filepath, sha256, plan };
}

export function validateTrustedDeletionRecoveryPlan({
  plan,
  sha256,
  execution,
  request,
} = {}) {
  if (!plan || !execution || !request) {
    throw new Error("Recovery validation requires the plan, execution and request.");
  }

  const checks = [
    ["recoveryPlanVersion", plan.recoveryPlanVersion, TRUSTED_ACCOUNT_DELETION_RECOVERY_PLAN_VERSION],
    ["executionId", plan.executionId, request.executionId],
    ["requestId", plan.requestId, request.id],
    ["subjectUserId", plan.subjectUserId, request.userId || request.id],
    ["modelVersion", plan.modelVersion, execution.modelVersion],
    ["fingerprint", plan.fingerprint, execution.fingerprint],
    ["stored recovery plan hash", sha256, execution.recoveryPlanSha256],
  ];

  const mismatch = checks.find(([, actual, expected]) => actual !== expected);
  if (mismatch) {
    const [label, actual, expected] = mismatch;
    throw new Error(
      `Trusted deletion recovery validation failed for ${label}. Expected ${expected}, found ${actual}.`,
    );
  }

  if (!["processing", "failed"].includes(request.status)) {
    throw new Error(
      `Trusted deletion recovery requires a processing/failed request, found ${request.status}.`,
    );
  }
  if (!["processing", "failed"].includes(execution.status)) {
    throw new Error(
      `Trusted deletion recovery requires a processing/failed execution, found ${execution.status}.`,
    );
  }
  if (Number(execution.recoveryPlanOperationCount) !== plan.operations.length) {
    throw new Error("Trusted deletion recovery operation count does not match the execution record.");
  }

  return true;
}

export function getTrustedDeletionRecoveryDisposition({
  operation,
  exists,
  data,
  executionId,
} = {}) {
  if (operation?.type === "delete") {
    return exists ? "delete" : "already-deleted";
  }
  if (!exists) return "missing-anonymised-record";
  if (
    data?.accountDeletionAnonymised === true
    && data?.accountDeletionExecutionId === executionId
  ) {
    return "already-anonymised";
  }
  if (
    data?.accountDeletionAnonymised === true
    && data?.accountDeletionExecutionId
    && data.accountDeletionExecutionId !== executionId
  ) {
    return "conflicting-execution";
  }
  return "anonymise";
}
