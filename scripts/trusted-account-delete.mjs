import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { createInterface } from "node:readline/promises";

import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

import {
  ACCOUNT_DELETION_WAITING_DAYS,
  TRUSTED_ACCOUNT_DELETION_MODEL_VERSION,
  createFormerPlayerIdentity,
} from "../src/services/account/accountModel.js";
import {
  buildTrustedAccountDeletionAudit,
  replaceDeletedPlayerIdentity,
} from "../src/services/account/trustedDeletionModel.js";

const DEFAULT_PROJECT_ID = "fitnesschallengeapp-9e87f";
const DEFAULT_REPORT_DIRECTORY = path.join(
  os.homedir(),
  "firebase-private",
  "champions-legacy-account-deletion-reports",
);
const BATCH_LIMIT = 350;

const DIRECT_RECORD_QUERIES = Object.freeze([
  ["challengeEntries", "userId", "delete"],
  ["playerNotifications", "userId", "delete"],
  ["clientErrorReports", "userId", "delete"],
  ["entryCorrectionHeads", "userId", "anonymise"],
  ["entryCorrections", "userId", "anonymise"],
  ["leagueMemberships", "userId", "anonymise"],
  ["leagueContributions", "userId", "anonymise"],
  ["seasonEvidenceClaims", "userId", "anonymise"],
  ["seasonEvidenceDecisions", "userId", "anonymise"],
  ["pocketActivities", "userId", "anonymise"],
  ["pocketRedemptions", "userId", "anonymise"],
  ["exerciseSuggestions", "submittedBy", "anonymise"],
  ["librarySuggestions", "submittedBy", "anonymise"],
  ["leadershipVotes", "voterId", "anonymise"],
  ["leadershipVotes", "candidateId", "anonymise"],
  ["leagueEvidenceReviewers", "userId", "delete"],
  ["leagueHouseAssignmentHistory", "userId", "anonymise"],
]);

const RELATED_LEAGUE_COLLECTIONS = Object.freeze([
  "leagueLeaderboardSnapshots",
  "seasonTrustedRuns",
  "leagueHouses",
  "leadershipElections",
  "leagueRosterSwaps",
  "leagueRosterLocks",
  "leagueInvites",
  "leaguePowerPlayWeeks",
]);

function parseArguments(argv) {
  const options = {
    projectId: DEFAULT_PROJECT_ID,
    requestId: "",
    actorId: "",
    credentialsPath: "",
    reportDirectory: process.env.CHAMPIONS_LEGACY_ACCOUNT_REPORT_DIR || DEFAULT_REPORT_DIRECTORY,
    process: false,
    list: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--process") options.process = true;
    else if (value === "--list") options.list = true;
    else if (value === "--help" || value === "-h") options.help = true;
    else if (value === "--request" || value === "--user") options.requestId = argv[++index] || "";
    else if (value === "--actor") options.actorId = argv[++index] || "";
    else if (value === "--project") options.projectId = argv[++index] || DEFAULT_PROJECT_ID;
    else if (value === "--credentials") options.credentialsPath = argv[++index] || "";
    else if (value === "--report-dir") options.reportDirectory = argv[++index] || DEFAULT_REPORT_DIRECTORY;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return options;
}

function printHelp() {
  console.log(`Champions Legacy Challenge trusted account deletion\n\nUsage:\n  npm run account:deletion:list\n  npm run account:deletion:audit\n  npm run account:deletion:process\n\nOptions:\n  --request <userId>  Select a request directly.\n  --actor <userId>    Platform Administrator recorded as operator.\n  --credentials <path> Use a private service-account JSON file.\n  --project <id>      Override the Firebase project ID.\n  --report-dir <path> Override the private local report directory.\n  --process           Run the irreversible trusted processor after confirmation.\n  --list              List deletion requests and stop.\n  --help              Show this guide.\n\nDry audit is the default. Processing is blocked until seven days after acknowledgement.`);
}

function initializeTrustedApp(options) {
  const credentialsPath = options.credentialsPath
    ? path.resolve(options.credentialsPath)
    : process.env.GOOGLE_APPLICATION_CREDENTIALS
      ? path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)
      : "";

  if (credentialsPath) {
    if (!fs.existsSync(credentialsPath)) {
      throw new Error(`Service-account file not found: ${credentialsPath}`);
    }
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
  }
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      "Trusted credentials are not configured. Set GOOGLE_APPLICATION_CREDENTIALS or pass --credentials with the private service-account JSON path.",
    );
  }

  return getApps()[0] ?? initializeApp({
    credential: applicationDefault(),
    projectId: options.projectId,
  });
}

function mapSnapshot(snapshot, collectionName, mode = "anonymise") {
  return snapshot.docs.map((item) => ({
    key: `${collectionName}/${item.id}`,
    collectionName,
    id: item.id,
    ref: item.ref,
    data: item.data(),
    mode,
  }));
}

function timestampMillis(value) {
  if (typeof value?.toMillis === "function") return value.toMillis();
  const parsed = new Date(value ?? 0).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function portableValue(value) {
  if (Array.isArray(value)) return value.map(portableValue);
  if (value && typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, portableValue(item)]));
  }
  return value;
}

function safeFilename(value) {
  return String(value || "account")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "account";
}

function writeLocalReport(report, mode, reportDirectory) {
  const directory = path.resolve(reportDirectory);
  fs.mkdirSync(directory, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${safeFilename(report.audit?.identity?.displayName)}-${mode}-${timestamp}.json`;
  const filepath = path.join(directory, filename);
  fs.writeFileSync(filepath, `${JSON.stringify(portableValue(report), null, 2)}\n`, "utf8");
  return filepath;
}

async function listRequests(db) {
  const snapshot = await db.collection("accountDeletionRequests").get();
  return mapSnapshot(snapshot, "accountDeletionRequests")
    .map((item) => ({ id: item.id, ...item.data }))
    .sort((first, second) => timestampMillis(second.requestedAt) - timestampMillis(first.requestedAt));
}

function printRequestList(requests) {
  console.log("\nAccount deletion requests:");
  requests.forEach((request, index) => {
    const acknowledged = timestampMillis(request.acknowledgedAt);
    const eligible = acknowledged
      ? new Date(acknowledged + ACCOUNT_DELETION_WAITING_DAYS * 24 * 60 * 60 * 1000).toISOString()
      : "not acknowledged";
    console.log(`${index + 1}. ${request.displayName || request.userId || request.id} [${request.status || "unknown"}] — ${request.id} — eligible ${eligible}`);
  });
}

async function selectRequest(db, options, prompt) {
  if (options.requestId) {
    const snapshot = await db.collection("accountDeletionRequests").doc(options.requestId).get();
    if (!snapshot.exists) throw new Error(`Account deletion request not found: ${options.requestId}`);
    return { id: snapshot.id, ...snapshot.data() };
  }

  const requests = (await listRequests(db)).filter((request) =>
    ["requested", "acknowledged", "processing", "failed"].includes(request.status));
  if (requests.length === 0) throw new Error("No active account deletion requests exist.");
  printRequestList(requests);
  const answer = await prompt.question("Choose a request number: ");
  const selected = requests[Number(answer) - 1];
  if (!selected) throw new Error("Choose a valid request number.");
  return selected;
}

async function queryRecords(db, collectionName, fieldName, value, mode = "anonymise") {
  const snapshot = await db.collection(collectionName).where(fieldName, "==", value).get();
  return mapSnapshot(snapshot, collectionName, mode);
}

async function queryArrayRecords(db, collectionName, fieldName, value, mode = "anonymise") {
  const snapshot = await db.collection(collectionName).where(fieldName, "array-contains", value).get();
  return mapSnapshot(snapshot, collectionName, mode);
}

async function queryLeagueRecords(db, collectionName, leagueId) {
  const snapshot = await db.collection(collectionName).where("leagueId", "==", leagueId).get();
  return mapSnapshot(snapshot, collectionName, "anonymise");
}

function addRecords(target, items) {
  items.forEach((item) => {
    const existing = target.get(item.key);
    if (!existing || item.mode === "delete") target.set(item.key, item);
  });
}

function containsIdentity(value, source) {
  if (Array.isArray(value)) return value.some((item) => containsIdentity(item, source));
  if (value && typeof value === "object" && !(value instanceof Date) && typeof value.toDate !== "function") {
    return Object.values(value).some((item) => containsIdentity(item, source));
  }
  if (typeof value !== "string") return false;
  return [source.userId, source.email, source.displayName].filter(Boolean)
    .some((needle) => value.includes(needle));
}

async function loadAuthState(auth, userId) {
  try {
    return { exists: true, user: await auth.getUser(userId) };
  } catch (error) {
    if (error?.code === "auth/user-not-found") return { exists: false, user: null };
    throw error;
  }
}

async function loadDeletionSources(db, auth, request) {
  const userId = request.userId || request.id;
  const profileSnapshot = await db.collection("users").doc(userId).get();
  const profile = profileSnapshot.exists ? { id: profileSnapshot.id, ...profileSnapshot.data() } : null;
  const authState = await loadAuthState(auth, userId);
  const adminSnapshot = await db.collection("users").where("role", "==", "admin").get();
  const source = {
    userId,
    email: profile?.email || authState.user?.email || request.email || "",
    displayName: profile?.displayName || authState.user?.displayName || request.displayName || "Champion",
    avatarId: profile?.avatarId || "legacy-trophy",
  };
  const records = new Map();

  for (const [collectionName, fieldName, mode] of DIRECT_RECORD_QUERIES) {
    addRecords(records, await queryRecords(db, collectionName, fieldName, userId, mode));
  }

  const relevantLeagueIds = new Set();
  records.forEach((item) => {
    if (item.data.leagueId) relevantLeagueIds.add(item.data.leagueId);
    (item.data.affectedLeagueIds ?? []).forEach((leagueId) => relevantLeagueIds.add(leagueId));
  });

  for (const leagueId of relevantLeagueIds) {
    for (const collectionName of RELATED_LEAGUE_COLLECTIONS) {
      addRecords(records, await queryLeagueRecords(db, collectionName, leagueId));
    }
    const leagueSnapshot = await db.collection("leagues").doc(leagueId).get();
    if (leagueSnapshot.exists) {
      addRecords(records, [{
        key: `leagues/${leagueSnapshot.id}`,
        collectionName: "leagues",
        id: leagueSnapshot.id,
        ref: leagueSnapshot.ref,
        data: leagueSnapshot.data(),
        mode: "anonymise",
      }]);
    }
  }

  addRecords(records, await queryArrayRecords(db, "leagues", "administratorIds", userId));
  addRecords(records, await queryRecords(db, "leagueHouses", "captainId", userId));
  addRecords(records, await queryArrayRecords(db, "leagueHouses", "viceCaptainIds", userId));

  for (const collectionName of ["announcements", "publishedLibraryItems", "libraryReleases"]) {
    const snapshot = await db.collection(collectionName).get();
    addRecords(
      records,
      mapSnapshot(snapshot, collectionName).filter((item) => containsIdentity(item.data, source)),
    );
  }

  const auditQueries = [
    ["actorId", userId],
    ["entityId", userId],
    ["details.userId", userId],
    ["details.submittedBy", userId],
    ["details.firstPlayerId", userId],
    ["details.secondPlayerId", userId],
    ["details.captainId", userId],
    ["details.viceCaptainId", userId],
  ];
  for (const [field, value] of auditQueries) {
    addRecords(records, await queryRecords(db, "auditEvents", field, value));
  }
  for (const leagueId of relevantLeagueIds) {
    const leagueAudits = await queryRecords(db, "auditEvents", "entityId", leagueId);
    addRecords(records, leagueAudits.filter((item) => containsIdentity(item.data, source)));
  }

  const userSubcollections = {};
  for (const name of ["library", "announcementReads", "coach"]) {
    const snapshot = await db.collection("users").doc(userId).collection(name).get();
    userSubcollections[name] = mapSnapshot(snapshot, `users/${userId}/${name}`, "delete");
  }

  const recordsByCollection = {};
  records.forEach((item) => {
    recordsByCollection[item.collectionName] ??= [];
    recordsByCollection[item.collectionName].push(item);
  });
  recordsByCollection.userProfile = profileSnapshot.exists ? [profile] : [];
  Object.entries(userSubcollections).forEach(([name, items]) => {
    recordsByCollection[`users.${name}`] = items;
  });

  return {
    profile,
    authState,
    administratorCount: adminSnapshot.size,
    source,
    identity: createFormerPlayerIdentity(userId),
    records,
    recordsByCollection,
    relevantLeagueIds: [...relevantLeagueIds],
    userSubcollections,
  };
}

function operationCounts(sources) {
  const counts = {};
  sources.records.forEach((item) => {
    const key = `${item.mode}:${item.collectionName}`;
    counts[key] = (counts[key] ?? 0) + 1;
  });
  Object.entries(sources.userSubcollections).forEach(([name, items]) => {
    counts[`delete:users.${name}`] = items.length;
  });
  counts["delete:users"] = sources.profile ? 1 : 0;
  counts["delete:authentication"] = sources.authState.exists ? 1 : 0;
  return counts;
}

function printAuditSummary(audit, sources) {
  console.log(`\nTrusted account deletion — ${sources.source.displayName}`);
  console.log(`Anonymous identity: ${audit.identity.displayName} (${audit.identity.userId})`);
  console.log(`Fingerprint: ${audit.fingerprint}`);
  console.log(`Processable now: ${audit.processable ? "yes" : "no"}`);
  console.log(`Blocking issues: ${audit.issueCounts.blocking}`);
  console.log(`Warnings: ${audit.issueCounts.warning}`);
  console.log(`Documents planned: ${Object.values(audit.counts).reduce((sum, value) => sum + value, 0)}`);
  if (audit.issues.length > 0) {
    console.log("\nFindings:");
    audit.issues.forEach((issue) => console.log(`- [${issue.severity}] ${issue.code}: ${issue.message}`));
  }
}

async function resolveActorId(db, options, prompt, targetUserId) {
  if (options.actorId) {
    if (options.actorId === targetUserId) throw new Error("A different Platform Administrator must operate the deletion.");
    const actorSnapshot = await db.collection("users").doc(options.actorId).get();
    if (!actorSnapshot.exists || actorSnapshot.data().role !== "admin") {
      throw new Error("The recorded operator must be a current Platform Administrator.");
    }
    return options.actorId;
  }
  const snapshot = await db.collection("users").where("role", "==", "admin").get();
  const administrators = mapSnapshot(snapshot, "users")
    .map((item) => ({ id: item.id, ...item.data }))
    .filter((item) => item.id !== targetUserId);
  if (administrators.length === 1) return administrators[0].id;
  if (administrators.length === 0) {
    throw new Error("No different Platform Administrator is available to operate this deletion.");
  }
  console.log("\nPlatform Administrators:");
  administrators.forEach((administrator, index) => {
    console.log(`${index + 1}. ${administrator.displayName || administrator.email || administrator.id} — ${administrator.id}`);
  });
  const answer = await prompt.question("Choose the administrator recorded as operator: ");
  const selected = administrators[Number(answer) - 1];
  if (!selected) throw new Error("Choose a valid Platform Administrator.");
  return selected.id;
}

function transformRecord(item, sources, executionId, now) {
  const { source, identity } = sources;
  let next = replaceDeletedPlayerIdentity(item.data, source, identity);
  const metadata = {
    accountDeletionAnonymised: true,
    accountDeletionExecutionId: executionId,
    accountDeletionAnonymisedAt: now,
  };

  if (item.collectionName === "leagueMemberships") {
    next = {
      ...next,
      userId: identity.userId,
      displayName: identity.displayName,
      avatarId: identity.avatarId,
      status: "withdrawn",
      ...metadata,
    };
  } else if (["leagueContributions", "seasonEvidenceClaims"].includes(item.collectionName)) {
    next = {
      ...next,
      userId: identity.userId,
      displayName: identity.displayName,
      avatarId: identity.avatarId,
      ...metadata,
    };
  } else if (["entryCorrectionHeads", "entryCorrections"].includes(item.collectionName)) {
    next = {
      ...next,
      userId: identity.userId,
      accountDeletionEntryDataRemoved: true,
      ...metadata,
    };
  } else if (["exerciseSuggestions", "librarySuggestions"].includes(item.collectionName)) {
    next = {
      ...next,
      submittedBy: identity.userId,
      challengeEntryId: "",
      ...metadata,
    };
  } else if (item.collectionName === "leagueHouseAssignmentHistory") {
    next = {
      ...next,
      userId: identity.userId,
      displayName: identity.displayName,
      ...metadata,
    };
  } else if (item.collectionName === "leagueHouses") {
    const originalViceCaptainIds = item.data.viceCaptainIds ?? [];
    next = {
      ...next,
      captainId: item.data.captainId === source.userId ? "" : next.captainId || "",
      viceCaptainIds: originalViceCaptainIds
        .filter((id) => id !== source.userId)
        .map((id) => (id === source.userId ? "" : id))
        .filter(Boolean),
      ...metadata,
    };
  } else if (item.collectionName === "leagues") {
    const administratorIds = (item.data.administratorIds ?? [])
      .filter((id) => id !== source.userId);
    const liveMembershipCount = (sources.recordsByCollection.leagueMemberships ?? [])
      .filter((membership) => membership.data.leagueId === item.id)
      .filter((membership) => ["registered", "active"].includes(membership.data.status)).length;
    next = {
      ...next,
      administratorIds,
      participantCount: Math.max(0, Number(next.participantCount ?? 0) - liveMembershipCount),
      ...metadata,
    };
  } else {
    next = { ...next, ...metadata };
  }
  return next;
}

async function commitWrites(db, operations) {
  for (let start = 0; start < operations.length; start += BATCH_LIMIT) {
    const batch = db.batch();
    operations.slice(start, start + BATCH_LIMIT).forEach((operation) => {
      if (operation.type === "delete") batch.delete(operation.ref);
      else batch.set(operation.ref, operation.data, { merge: false });
    });
    await batch.commit();
  }
}

async function beginExecution({ db, request, audit, actorId }) {
  const requestReference = db.collection("accountDeletionRequests").doc(request.id);
  if (["processing", "failed"].includes(request.status) && request.executionId) {
    return request.executionId;
  }
  const executionReference = db.collection("accountDeletionExecutions").doc();
  const now = FieldValue.serverTimestamp();
  const batch = db.batch();
  batch.set(executionReference, {
    modelVersion: TRUSTED_ACCOUNT_DELETION_MODEL_VERSION,
    requestId: request.id,
    subjectUserId: request.userId || request.id,
    status: "processing",
    fingerprint: audit.fingerprint,
    anonymizedPlayerId: audit.identity.userId,
    anonymizedDisplayName: audit.identity.displayName,
    actorId,
    issueCounts: audit.issueCounts,
    plannedCounts: audit.counts,
    startedAt: now,
    updatedAt: now,
    completedAt: null,
    failureAt: null,
    failureMessage: "",
  });
  batch.update(requestReference, {
    status: "processing",
    processingAt: now,
    processingBy: actorId,
    executionId: executionReference.id,
    anonymizedPlayerId: audit.identity.userId,
    anonymizedDisplayName: audit.identity.displayName,
    failureAt: null,
    failureMessage: "",
    updatedAt: now,
  });
  await batch.commit();
  return executionReference.id;
}

async function markFailure(db, requestId, executionId, error) {
  const now = FieldValue.serverTimestamp();
  const message = String(error?.message || error).slice(0, 1000);
  const batch = db.batch();
  batch.set(db.collection("accountDeletionExecutions").doc(executionId), {
    status: "failed",
    failureAt: now,
    failureMessage: message,
    updatedAt: now,
  }, { merge: true });
  batch.set(db.collection("accountDeletionRequests").doc(requestId), {
    status: "failed",
    failureAt: now,
    failureMessage: message,
    updatedAt: now,
  }, { merge: true });
  await batch.commit();
}

async function processDeletion({ db, auth, request, sources, audit, actorId }) {
  const originalUserId = request.userId || request.id;
  const executionId = await beginExecution({ db, request, audit, actorId });
  const now = FieldValue.serverTimestamp();

  try {
    if (sources.authState.exists) {
      await auth.updateUser(originalUserId, { disabled: true });
      await auth.revokeRefreshTokens(originalUserId);
    }

    const operations = [];
    sources.records.forEach((item) => {
      if (item.mode === "delete") {
        operations.push({ type: "delete", ref: item.ref });
      } else {
        operations.push({
          type: "set",
          ref: item.ref,
          data: transformRecord(item, sources, executionId, now),
        });
      }
    });
    Object.values(sources.userSubcollections).flat().forEach((item) => {
      operations.push({ type: "delete", ref: item.ref });
    });
    if (sources.profile) {
      operations.push({ type: "delete", ref: db.collection("users").doc(originalUserId) });
    }
    await commitWrites(db, operations);

    if (sources.authState.exists) {
      try {
        await auth.deleteUser(originalUserId);
      } catch (error) {
        if (error?.code !== "auth/user-not-found") throw error;
      }
    }

    const receiptReference = db.collection("accountDeletionReceipts").doc(executionId);
    const auditReference = db.collection("auditEvents").doc();
    const requestReference = db.collection("accountDeletionRequests").doc(request.id);
    const executionReference = db.collection("accountDeletionExecutions").doc(executionId);
    const completionTime = FieldValue.serverTimestamp();
    const batch = db.batch();
    batch.set(receiptReference, {
      modelVersion: TRUSTED_ACCOUNT_DELETION_MODEL_VERSION,
      executionId,
      requestIdHash: audit.fingerprint,
      anonymizedPlayerId: sources.identity.userId,
      anonymizedDisplayName: sources.identity.displayName,
      actorId,
      fingerprint: audit.fingerprint,
      operationCounts: audit.counts,
      completedAt: completionTime,
      auditId: auditReference.id,
    });
    batch.set(auditReference, {
      actorId,
      action: "account.deletion.completed",
      entityType: "accountDeletionReceipt",
      entityId: receiptReference.id,
      summary: `Completed trusted account deletion for ${sources.identity.displayName}`,
      details: {
        anonymizedPlayerId: sources.identity.userId,
        executionId,
        fingerprint: audit.fingerprint,
        operationCounts: audit.counts,
      },
      createdAt: completionTime,
    });
    batch.set(executionReference, {
      status: "completed",
      subjectUserId: "",
      subjectUserIdHash: audit.fingerprint,
      completedAt: completionTime,
      updatedAt: completionTime,
      failureAt: null,
      failureMessage: "",
      receiptId: receiptReference.id,
      lastAuditId: auditReference.id,
    }, { merge: true });
    batch.set(requestReference, {
      userId: sources.identity.userId,
      email: "",
      displayName: sources.identity.displayName,
      reasonCode: "prefer-not-to-say",
      status: "completed",
      completedAt: completionTime,
      completedBy: actorId,
      updatedAt: completionTime,
      failureAt: null,
      failureMessage: "",
      lastAuditId: auditReference.id,
    }, { merge: true });
    await batch.commit();

    return { executionId, receiptId: receiptReference.id, operationCount: operations.length };
  } catch (error) {
    await markFailure(db, request.id, executionId, error);
    throw error;
  }
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  initializeTrustedApp(options);
  const db = getFirestore();
  const auth = getAuth();
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  try {
    if (options.list) {
      const requests = await listRequests(db);
      if (requests.length === 0) console.log("No account deletion requests exist.");
      else printRequestList(requests);
      return;
    }

    const request = await selectRequest(db, options, prompt);
    console.log(`\nLoading account-owned and shared records for ${request.displayName || request.id}…`);
    const sources = await loadDeletionSources(db, auth, request);
    const counts = operationCounts(sources);
    const audit = buildTrustedAccountDeletionAudit({
      request,
      profile: sources.profile,
      authUserExists: sources.authState.exists,
      administratorCount: sources.administratorCount,
      records: counts,
    });
    printAuditSummary(audit, sources);

    const dryRunPath = writeLocalReport({
      metadata: {
        reportType: "trusted-account-deletion",
        reportVersion: TRUSTED_ACCOUNT_DELETION_MODEL_VERSION,
        mode: "dry-run",
        generatedAt: new Date().toISOString(),
      },
      audit,
    }, "dry-run", options.reportDirectory);
    console.log(`\nLocal dry-run report: ${dryRunPath}`);

    if (!options.process) {
      console.log("No Firebase data or Authentication account was changed. Run the process command only after reviewing this report.");
      if (!audit.processable) process.exitCode = 2;
      return;
    }
    if (!audit.processable) {
      console.error("\nProcessing blocked. Resolve the findings or wait until the cancellation window ends.");
      process.exitCode = 2;
      return;
    }

    const answer = await prompt.question(`Type DELETE ${audit.identity.code} to begin irreversible processing: `);
    if (answer.trim().toUpperCase() !== `DELETE ${audit.identity.code}`) {
      console.log("Processing cancelled. No Firebase data or Authentication account was changed.");
      return;
    }

    const actorId = await resolveActorId(db, options, prompt, request.userId || request.id);
    console.log("\nRefreshing the request and deletion plan immediately before processing…");
    const liveRequestSnapshot = await db.collection("accountDeletionRequests").doc(request.id).get();
    if (!liveRequestSnapshot.exists) throw new Error("The account deletion request no longer exists.");
    const liveRequest = { id: liveRequestSnapshot.id, ...liveRequestSnapshot.data() };
    const liveSources = await loadDeletionSources(db, auth, liveRequest);
    const liveCounts = operationCounts(liveSources);
    const liveAudit = buildTrustedAccountDeletionAudit({
      request: liveRequest,
      profile: liveSources.profile,
      authUserExists: liveSources.authState.exists,
      administratorCount: liveSources.administratorCount,
      records: liveCounts,
    });
    if (!liveAudit.processable) {
      printAuditSummary(liveAudit, liveSources);
      throw new Error("The refreshed deletion plan is no longer safe to process.");
    }
    if (liveAudit.fingerprint !== audit.fingerprint && !["processing", "failed"].includes(liveRequest.status)) {
      const refreshedPath = writeLocalReport({
        metadata: {
          reportType: "trusted-account-deletion",
          reportVersion: TRUSTED_ACCOUNT_DELETION_MODEL_VERSION,
          mode: "refreshed-dry-run",
          generatedAt: new Date().toISOString(),
        },
        audit: liveAudit,
      }, "refreshed-dry-run", options.reportDirectory);
      throw new Error(`The account records changed while the report was reviewed. Review the refreshed report: ${refreshedPath}`);
    }

    const result = await processDeletion({
      db,
      auth,
      request: liveRequest,
      sources: liveSources,
      audit: liveAudit,
      actorId,
    });
    const completedPath = writeLocalReport({
      metadata: {
        reportType: "trusted-account-deletion",
        reportVersion: TRUSTED_ACCOUNT_DELETION_MODEL_VERSION,
        mode: "completed",
        generatedAt: new Date().toISOString(),
        ...result,
      },
      audit: liveAudit,
    }, "completed", options.reportDirectory);
    console.log(`\nTrusted account deletion completed. Receipt: ${result.receiptId}`);
    console.log(`Completion report: ${completedPath}`);
  } finally {
    prompt.close();
  }
}

main().catch((error) => {
  console.error(`\nTrusted account deletion failed: ${error.message}`);
  process.exitCode = 1;
});
