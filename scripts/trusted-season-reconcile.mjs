import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { createInterface } from "node:readline/promises";

import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

import { getTimeZoneDateKey, normalizeEvidencePolicy } from "../src/services/evidence/evidenceModel.js";
import {
  buildTrustedSeasonAudit,
  createTrustedSeasonFingerprint,
  stableStringify,
} from "../src/services/seasons/trustedSeasonModel.js";

const DEFAULT_PROJECT_ID = "fitnesschallengeapp-9e87f";
const DEFAULT_REPORT_DIRECTORY = path.join(
  os.homedir(),
  "firebase-private",
  "champions-legacy-trusted-reports",
);

function parseArguments(argv) {
  const options = {
    projectId: DEFAULT_PROJECT_ID,
    leagueId: "",
    actorId: "",
    credentialsPath: "",
    reportDirectory: process.env.CHAMPIONS_LEGACY_REPORT_DIR || DEFAULT_REPORT_DIRECTORY,
    publish: false,
    yes: false,
    list: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--publish") options.publish = true;
    else if (value === "--yes") options.yes = true;
    else if (value === "--list") options.list = true;
    else if (value === "--help" || value === "-h") options.help = true;
    else if (value === "--league") options.leagueId = argv[++index] || "";
    else if (value === "--actor") options.actorId = argv[++index] || "";
    else if (value === "--project") options.projectId = argv[++index] || DEFAULT_PROJECT_ID;
    else if (value === "--credentials") options.credentialsPath = argv[++index] || "";
    else if (value === "--report-dir") options.reportDirectory = argv[++index] || DEFAULT_REPORT_DIRECTORY;
    else throw new Error(`Unknown argument: ${value}`);
  }
  return options;
}

function printHelp() {
  console.log(`Champions Legacy Challenge trusted season reconciliation\n\nUsage:\n  npm run season:list\n  npm run season:reconcile\n  npm run season:reconcile -- --league <leagueId>\n  npm run season:reconcile:publish -- --league <leagueId>\n\nOptions:\n  --league <id>       Select a season directly.\n  --actor <userId>    Platform Administrator recorded as the publisher.\n  --credentials <path> Use a service-account JSON file without changing your shell.\n  --project <id>      Override the Firebase project ID.\n  --publish           Publish a new immutable trusted snapshot when safe.\n  --yes               Skip the final publication confirmation.\n  --list              List available seasons and stop.\n  --help              Show this guide.\n\nDry run is the default. It reads production data and writes only a local JSON report.`);
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

function mapSnapshot(snapshot) {
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

function timestampMillis(value) {
  if (typeof value?.toMillis === "function") return value.toMillis();
  const parsed = new Date(value ?? 0).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function listSeasons(db) {
  const snapshot = await db.collection("leagues").get();
  return mapSnapshot(snapshot).sort((first, second) => {
    const statusOrder = { active: 0, registration: 1, completed: 2, draft: 3, archived: 4 };
    return (statusOrder[first.status] ?? 9) - (statusOrder[second.status] ?? 9)
      || timestampMillis(second.startDate) - timestampMillis(first.startDate)
      || String(first.name).localeCompare(String(second.name));
  });
}

function printSeasonList(seasons) {
  console.log("\nAvailable seasons:");
  seasons.forEach((season, index) => {
    console.log(`${index + 1}. ${season.name || season.id} [${season.status || "unknown"}] — ${season.id}`);
  });
}

async function selectSeason(db, options, prompt) {
  if (options.leagueId) {
    const snapshot = await db.collection("leagues").doc(options.leagueId).get();
    if (!snapshot.exists) throw new Error(`Season not found: ${options.leagueId}`);
    return { id: snapshot.id, ...snapshot.data() };
  }

  const seasons = await listSeasons(db);
  if (seasons.length === 0) throw new Error("No seasons exist in this Firebase project.");
  printSeasonList(seasons);
  const answer = await prompt.question("Choose a season number: ");
  const selected = seasons[Number(answer) - 1];
  if (!selected) throw new Error("Choose a valid season number.");
  return selected;
}

async function getCollectionByLeague(db, collectionName, leagueId) {
  const snapshot = await db.collection(collectionName).where("leagueId", "==", leagueId).get();
  return mapSnapshot(snapshot);
}

async function getCorrectionsForLeague(db, leagueId) {
  const snapshot = await db.collection("entryCorrections")
    .where("affectedLeagueIds", "array-contains", leagueId)
    .get();
  return mapSnapshot(snapshot);
}

async function getDocumentsByIds(db, collectionName, ids) {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  const items = [];
  for (let start = 0; start < uniqueIds.length; start += 100) {
    const references = uniqueIds.slice(start, start + 100)
      .map((id) => db.collection(collectionName).doc(id));
    if (references.length === 0) continue;
    const snapshots = await db.getAll(...references);
    snapshots.forEach((snapshot) => {
      if (snapshot.exists) items.push({ id: snapshot.id, ...snapshot.data() });
    });
  }
  return items;
}

async function loadSeasonSources(db, league) {
  const [
    memberships,
    contributions,
    claims,
    decisions,
    corrections,
    snapshots,
    powerPlayAssignments,
  ] = await Promise.all([
    getCollectionByLeague(db, "leagueMemberships", league.id),
    getCollectionByLeague(db, "leagueContributions", league.id),
    getCollectionByLeague(db, "seasonEvidenceClaims", league.id),
    getCollectionByLeague(db, "seasonEvidenceDecisions", league.id),
    getCorrectionsForLeague(db, league.id),
    getCollectionByLeague(db, "leagueLeaderboardSnapshots", league.id),
    getCollectionByLeague(db, "leaguePowerPlayWeeks", league.id),
  ]);
  const entryIds = [
    ...contributions.map((item) => item.entryId),
    ...claims.flatMap((item) => [item.entryId, ...(item.entryIds ?? [])]),
    ...corrections.flatMap((item) => [item.sourceEntryId, item.replacementEntryId]),
  ];
  const entries = await getDocumentsByIds(db, "challengeEntries", entryIds);
  return {
    memberships,
    contributions,
    claims,
    decisions,
    corrections,
    snapshots,
    powerPlayAssignments,
    entries,
  };
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
  return String(value || "season")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "season";
}

function writeLocalReport(audit, mode, publication = {}, reportDirectory = DEFAULT_REPORT_DIRECTORY) {
  const directory = path.resolve(reportDirectory);
  fs.mkdirSync(directory, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${safeFilename(audit.leagueName)}-${mode}-${timestamp}.json`;
  const filepath = path.join(directory, filename);
  const report = {
    metadata: {
      reportType: "trusted-season-reconciliation",
      reportVersion: audit.modelVersion,
      mode,
      generatedAt: new Date().toISOString(),
      ...publication,
    },
    audit,
  };
  fs.writeFileSync(filepath, `${JSON.stringify(portableValue(report), null, 2)}\n`, "utf8");
  return filepath;
}

function printAuditSummary(audit) {
  console.log(`\nTrusted reconciliation — ${audit.leagueName}`);
  console.log(`Fingerprint: ${audit.fingerprint}`);
  console.log(`Players: ${audit.standings.players.length}`);
  console.log(`Houses: ${audit.standings.houses.length}`);
  console.log(`Contributions: ${audit.sourceCounts.contributions}`);
  console.log(`Blocking issues: ${audit.issueCounts.blocking}`);
  console.log(`Warnings: ${audit.issueCounts.warning}`);
  console.log(`Published snapshot: ${audit.snapshotComparison.status}`);
  if (audit.issues.length > 0) {
    console.log("\nHighest-priority findings:");
    audit.issues.slice(0, 12).forEach((issue) => {
      console.log(`- [${issue.severity}] ${issue.code}: ${issue.message} (${issue.entityType}/${issue.entityId || "season"})`);
    });
  }
}

async function resolveActorId(db, options, prompt) {
  if (options.actorId) return options.actorId;
  const snapshot = await db.collection("users").where("role", "==", "admin").get();
  const administrators = mapSnapshot(snapshot);
  if (administrators.length === 1) return administrators[0].id;
  if (administrators.length === 0) {
    throw new Error("No Platform Administrator profile exists. Pass --actor with the correct administrator user ID after confirming it in Firebase Authentication.");
  }
  console.log("\nPlatform Administrators:");
  administrators.forEach((administrator, index) => {
    console.log(`${index + 1}. ${administrator.displayName || administrator.email || administrator.id} — ${administrator.id}`);
  });
  const answer = await prompt.question("Choose the administrator recorded as publisher: ");
  const selected = administrators[Number(answer) - 1];
  if (!selected) throw new Error("Choose a valid Platform Administrator.");
  return selected.id;
}

function sanitizeRows(rows = []) {
  return rows.map((row) => Object.fromEntries(
    Object.entries(row).filter(([, value]) => value !== undefined),
  ));
}

async function publishTrustedSnapshot({ db, league, audit, actorId, sources }) {
  if (!audit.publishable) {
    throw new Error("Publication is blocked because trusted reconciliation found integrity errors.");
  }

  const leagueReference = db.collection("leagues").doc(league.id);
  const snapshotReference = db.collection("leagueLeaderboardSnapshots").doc();
  const auditReference = db.collection("auditEvents").doc();
  const runReference = db.collection("seasonTrustedRuns").doc();
  const policy = normalizeEvidencePolicy(league.ruleset?.evidencePolicy);
  const publicationDateKey = getTimeZoneDateKey(new Date(), policy.leaderboardPublication.timezone);

  return db.runTransaction(async (transaction) => {
    const liveLeagueSnapshot = await transaction.get(leagueReference);
    if (!liveLeagueSnapshot.exists) throw new Error("The season no longer exists.");
    const liveLeague = { id: liveLeagueSnapshot.id, ...liveLeagueSnapshot.data() };
    const liveFingerprint = createTrustedSeasonFingerprint({
      league: liveLeague,
      memberships: sources.memberships,
      contributions: sources.contributions,
      powerPlayAssignments: sources.powerPlayAssignments,
    });
    if (liveFingerprint !== audit.fingerprint) {
      throw new Error(
        "The season configuration changed during reconciliation. Run a new dry run before publishing.",
      );
    }

    if (liveLeague.publishedLeaderboardSnapshotId) {
      const currentReference = db.collection("leagueLeaderboardSnapshots")
        .doc(liveLeague.publishedLeaderboardSnapshotId);
      const currentSnapshot = await transaction.get(currentReference);
      if (currentSnapshot.exists && currentSnapshot.data().trustedFingerprint === audit.fingerprint) {
        return {
          snapshotId: currentSnapshot.id,
          runId: currentSnapshot.data().trustedRunId || "",
          alreadyCurrent: true,
        };
      }
    }

    const revision = Number(liveLeague.publishedLeaderboardRevision ?? 0) + 1;
    const serverTime = FieldValue.serverTimestamp();
    const snapshotPayload = {
      leagueId: league.id,
      rulesVersion: liveLeague.rulesVersion,
      publicationType: "trusted-local",
      replacesSnapshotId: liveLeague.publishedLeaderboardSnapshotId || "",
      publicationDateKey,
      players: sanitizeRows(audit.standings.players),
      houses: sanitizeRows(audit.standings.houses),
      honours: {
        individual: sanitizeRows(audit.honours.individual),
        houseChampions: sanitizeRows(audit.honours.houseChampions),
        houseOfChampions: audit.honours.houseOfChampions
          ? Object.fromEntries(Object.entries(audit.honours.houseOfChampions).filter(([, value]) => value !== undefined))
          : null,
      },
      trustedFingerprint: audit.fingerprint,
      trustedRunId: runReference.id,
      reconciliationStatus: audit.health,
      sourceCounts: audit.sourceCounts,
      issueCounts: audit.issueCounts,
      publishedAt: serverTime,
      publishedBy: actorId,
      lastAuditId: auditReference.id,
    };

    transaction.set(snapshotReference, snapshotPayload);
    transaction.set(auditReference, {
      actorId,
      action: "leaderboard.snapshot.trusted-published",
      entityType: "league",
      entityId: league.id,
      summary: `Published trusted local leaderboard snapshot for ${league.name}`,
      details: {
        snapshotId: snapshotReference.id,
        runId: runReference.id,
        fingerprint: audit.fingerprint,
        publicationDateKey,
        playerCount: audit.standings.players.length,
        houseCount: audit.standings.houses.length,
        issueCounts: audit.issueCounts,
      },
      createdAt: serverTime,
    });
    transaction.set(runReference, {
      leagueId: league.id,
      leagueName: league.name || "Season",
      modelVersion: audit.modelVersion,
      mode: "publish",
      status: audit.health === "healthy" ? "published" : "warning",
      fingerprint: audit.fingerprint,
      snapshotId: snapshotReference.id,
      actorId,
      sourceCounts: audit.sourceCounts,
      issueCounts: audit.issueCounts,
      snapshotComparison: {
        status: audit.snapshotComparison.status,
        playerDifferenceCount: audit.snapshotComparison.playerDifferenceCount,
        houseDifferenceCount: audit.snapshotComparison.houseDifferenceCount,
      },
      issueSample: audit.issues.slice(0, 20),
      startedAt: serverTime,
      completedAt: serverTime,
      createdAt: serverTime,
      lastAuditId: auditReference.id,
    });
    transaction.update(leagueReference, {
      publishedLeaderboardSnapshotId: snapshotReference.id,
      publishedLeaderboardAt: serverTime,
      publishedLeaderboardBy: actorId,
      publishedLeaderboardRevision: revision,
      updatedAt: serverTime,
      updatedBy: actorId,
      lastAuditId: auditReference.id,
    });

    return { snapshotId: snapshotReference.id, runId: runReference.id, alreadyCurrent: false };
  });
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  initializeTrustedApp(options);
  const db = getFirestore();
  const prompt = createInterface({ input: process.stdin, output: process.stdout });
  try {
    if (options.list) {
      printSeasonList(await listSeasons(db));
      return;
    }

    const league = await selectSeason(db, options, prompt);
    console.log(`\nLoading immutable season records for ${league.name || league.id}…`);
    const sources = await loadSeasonSources(db, league);
    const audit = buildTrustedSeasonAudit({ league, ...sources });
    printAuditSummary(audit);

    const dryRunPath = writeLocalReport(audit, "dry-run", {}, options.reportDirectory);
    console.log(`\nLocal dry-run report: ${dryRunPath}`);

    if (!options.publish) {
      console.log("No Firebase competition state was changed. Rerun with --publish after reviewing this report.");
      if (!audit.publishable) process.exitCode = 2;
      return;
    }

    if (!audit.publishable) {
      console.error("\nPublication blocked. Resolve the blocking integrity findings first.");
      process.exitCode = 2;
      return;
    }

    if (!options.yes) {
      const answer = await prompt.question("Publish a new immutable trusted snapshot now? Type PUBLISH to continue: ");
      if (answer.trim().toUpperCase() !== "PUBLISH") {
        console.log("Publication cancelled. No Firebase competition state was changed.");
        return;
      }
    }

    const actorId = await resolveActorId(db, options, prompt);
    console.log("\nRefreshing season records immediately before publication…");
    const finalSources = await loadSeasonSources(db, league);
    const finalAudit = buildTrustedSeasonAudit({ league, ...finalSources });
    const safetyFields = (value) => ({
      fingerprint: value.fingerprint,
      publishable: value.publishable,
      issueCounts: value.issueCounts,
      issues: value.issues,
      sourceCounts: value.sourceCounts,
    });
    if (stableStringify(safetyFields(finalAudit)) !== stableStringify(safetyFields(audit))) {
      printAuditSummary(finalAudit);
      const refreshedPath = writeLocalReport(
        finalAudit,
        "refreshed-dry-run",
        {},
        options.reportDirectory,
      );
      console.error(
        `\nSeason records changed while the first report was being reviewed. Publication stopped. Review the refreshed report: ${refreshedPath}`,
      );
      process.exitCode = 2;
      return;
    }

    const result = await publishTrustedSnapshot({
      db,
      league,
      audit: finalAudit,
      actorId,
      sources: finalSources,
    });
    const publishedPath = writeLocalReport(
      finalAudit,
      "published",
      {
        actorId,
        snapshotId: result.snapshotId,
        runId: result.runId,
        alreadyCurrent: result.alreadyCurrent,
      },
      options.reportDirectory,
    );
    console.log(result.alreadyCurrent
      ? `\nThe current trusted snapshot already matches fingerprint ${finalAudit.fingerprint}.`
      : `\nTrusted snapshot published: ${result.snapshotId}`);
    console.log(`Publication report: ${publishedPath}`);
  } finally {
    prompt.close();
  }
}

main().catch((error) => {
  console.error(`\nTrusted reconciliation failed: ${error.message}`);
  process.exitCode = 1;
});
