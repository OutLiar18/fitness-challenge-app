import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const EXPECTED_VERSION = "0.25.0";
const EXPECTED_PROJECT = "fitnesschallengeapp-9e87f";
const EXPECTED_HOSTING_TARGET = "app";
const EXPECTED_HOSTING_SITE = "champions-legacy-challenge";
const EXPECTED_RULES_TEST_COUNT = 94;
const EXPECTED_APP_TEST_COUNT = 148;
const RELEASE_SOURCE_BASELINE = "0f5b715e4888d12ddc53ede334a9cfe13c5e2048";

const projectRoot = process.cwd();
const failures = [];

function readJson(relativePath) {
  const fullPath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Required file is missing: ${relativePath}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  } catch (error) {
    failures.push(`${relativePath} is not valid JSON: ${error.message}`);
    return null;
  }
}

function readText(relativePath) {
  const fullPath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Required file is missing: ${relativePath}`);
    return "";
  }
  return fs.readFileSync(fullPath, "utf8");
}

function canonicalSha256(relativePath) {
  const text = readText(relativePath).replace(/\r\n/g, "\n");
  return crypto.createHash("sha256").update(text, "utf8").digest("hex");
}

function requireText(relativePath, markers) {
  const text = readText(relativePath);
  for (const marker of markers) {
    if (!text.includes(marker)) {
      failures.push(`${relativePath} is missing required marker: ${marker}`);
    }
  }
}

function countTests(relativePath) {
  const text = readText(relativePath);
  return (text.match(/^\s*test\(/gm) ?? []).length;
}

function git(args) {
  try {
    return execFileSync("git", args, {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch (error) {
    const message = String(error.stderr || error.message || error).trim();
    failures.push(`git ${args.join(" ")} failed${message ? `: ${message}` : "."}`);
    return "";
  }
}

function verifyFrozenSourceBoundary() {
  const head = git(["rev-parse", "HEAD"]);
  if (!head) return;

  try {
    execFileSync("git", ["merge-base", "--is-ancestor", RELEASE_SOURCE_BASELINE, "HEAD"], {
      cwd: projectRoot,
      stdio: "ignore",
    });
  } catch {
    failures.push(`HEAD ${head} does not descend from the frozen v0.25 source baseline ${RELEASE_SOURCE_BASELINE}.`);
    return;
  }

  const changed = git(["diff", "--name-only", RELEASE_SOURCE_BASELINE, "--"])
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  const allowed = changed.filter((relativePath) =>
    relativePath === "scripts/release-readiness.mjs"
    || relativePath.startsWith("docs/")
  );
  const unexpected = changed.filter((relativePath) => !allowed.includes(relativePath));

  if (unexpected.length > 0) {
    failures.push(
      `Release source changed after the frozen 25D baseline: ${unexpected.join(", ")}.`,
    );
  }
}

const packageData = readJson("package.json");
const lockData = readJson("package-lock.json");
const firebaseConfig = readJson("firebase.json");
const firebaseAliases = readJson(".firebaserc");

if (packageData) {
  if (packageData.version !== EXPECTED_VERSION) {
    failures.push(`Expected package version ${EXPECTED_VERSION}, found ${packageData.version}.`);
  }
  if (
    packageData.scripts?.["check:release"]
    !== "npm run check && npm run test:rules && node scripts/release-readiness.mjs"
  ) {
    failures.push("check:release must run the application gate, Rules emulator gate, then the v0.25 verifier.");
  }

  const blockedScript = "node scripts/block-development-deploy.mjs";
  for (const name of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
    if (packageData.scripts?.[name] !== blockedScript) {
      failures.push(`${name} must remain blocked during the development-branch release-readiness stage.`);
    }
  }

  const requiredAppTests = [
    "tests/house-movement-domain.test.mjs",
    "tests/power-plays.test.mjs",
    "tests/v025-ui-foundations.test.mjs",
    "tests/mbti-profiles.test.mjs",
    "tests/draft-deletion.test.mjs",
    "tests/season-bonus.test.mjs",
  ];
  for (const testFile of requiredAppTests) {
    if (!packageData.scripts?.test?.includes(testFile)) {
      failures.push(`${testFile} must remain part of npm test.`);
    }
  }

  const testFiles = [
    ...new Set(
      [...String(packageData.scripts?.test ?? "").matchAll(/tests\/[A-Za-z0-9_.-]+\.test\.mjs/g)]
        .map((match) => match[0]),
    ),
  ];
  const appTestCount = testFiles.reduce((total, relativePath) => total + countTests(relativePath), 0);
  if (appTestCount !== EXPECTED_APP_TEST_COUNT) {
    failures.push(`Expected ${EXPECTED_APP_TEST_COUNT} application tests across npm test; found ${appTestCount}.`);
  }
}

if (lockData) {
  if (lockData.version !== EXPECTED_VERSION || lockData.packages?.[""]?.version !== EXPECTED_VERSION) {
    failures.push(`package-lock.json must identify v${EXPECTED_VERSION} at the root.`);
  }
}

if (firebaseConfig) {
  if (firebaseConfig.firestore?.rules !== "firestore.rules") {
    failures.push("firebase.json must point Firestore to firestore.rules.");
  }
  if (firebaseConfig.hosting?.target !== EXPECTED_HOSTING_TARGET) {
    failures.push(`Firebase Hosting must target ${EXPECTED_HOSTING_TARGET}.`);
  }
  if (firebaseConfig.hosting?.public !== "dist") {
    failures.push("Firebase Hosting public folder must remain dist.");
  }
}

if (firebaseAliases) {
  const defaultProject = firebaseAliases.projects?.default;
  const hostingSites =
    firebaseAliases.targets?.[defaultProject]?.hosting?.[EXPECTED_HOSTING_TARGET] ?? [];
  if (defaultProject !== EXPECTED_PROJECT) {
    failures.push(`Default Firebase project must be ${EXPECTED_PROJECT}.`);
  }
  if (!hostingSites.includes(EXPECTED_HOSTING_SITE)) {
    failures.push(`Hosting target ${EXPECTED_HOSTING_TARGET} must map to ${EXPECTED_HOSTING_SITE}.`);
  }
}

const rulesTestCount = countTests("tests/firestore.rules.test.mjs");
if (rulesTestCount !== EXPECTED_RULES_TEST_COUNT) {
  failures.push(`Expected ${EXPECTED_RULES_TEST_COUNT} Firestore Rules tests; found ${rulesTestCount}.`);
}

requireText("firestore.rules", [
  "function validMbtiType(mbtiType)",
  "function validDraftSeasonDelete(leagueId)",
  "function validDraftHouseDelete(houseId)",
  "function validSeasonBonusRequestCreate(requestId)",
  "function validSeasonBonusAwardCreate(awardId)",
  "match /seasonBonusRequests/{requestId}",
  "match /seasonBonusAwards/{awardId}",
]);

requireText("src/constants/mbtiProfiles.js", [
  "export const MBTI_TYPES = Object.freeze([",
  "export const MBTI_PROFILES = Object.freeze(",
]);

requireText("src/services/seasons/draftDeletionModel.js", [
  'HOUSE: "house.draft-deleted"',
  'SEASON: "league.draft-deleted"',
  "canHardDeleteDraftSeason",
  "canHardDeleteDraftHouse",
]);

requireText("src/services/seasons/seasonBonusModel.js", [
  "SEASON_BONUS_POINT_LIMIT = 10000",
  'PLATFORM_DIRECT: "platform-direct"',
  'LEAGUE_ADMIN_REQUEST: "league-admin-request"',
  'PLATFORM_CORRECTION: "platform-correction"',
]);

requireText("src/services/seasons/seasonBonusService.js", [
  "subscribeToPendingSeasonBonusRequests",
  "awardSeasonBonusDirect",
  "reviewSeasonBonusRequest",
  "correctSeasonBonusAward",
  'source: "season-bonus"',
]);

requireText("src/services/seasons/trustedSeasonModel.js", [
  'TRUSTED_SEASON_MODEL_VERSION = "trusted-season-v3"',
  "seasonBonusPoints",
  "bonusAwardId",
]);

requireText("docs/01_CURRENT_DEVELOPMENT/ROADMAP.md", [
  "25A — Existing-app correctness foundations — COMPLETE",
  "25B — MBTI-based player profiles — COMPLETE",
  "25C — Safe Platform Administrator deletion/recovery behaviour — COMPLETE",
  "25D — League Season bonus points — COMPLETE",
  "25R — v0.25 release-readiness freeze — COMPLETE",
]);

requireText("scripts/block-development-deploy.mjs", [
  "Production deployment is intentionally blocked",
]);

verifyFrozenSourceBoundary();

const rulesHash = canonicalSha256("firestore.rules");

if (failures.length > 0) {
  console.error("v0.25.0 release-readiness verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Release-readiness structure verified for v0.25.0.");
  console.log(`Frozen application source baseline: ${RELEASE_SOURCE_BASELINE}.`);
  console.log(`Canonical Firestore Rules SHA-256: ${rulesHash}.`);
  console.log(
    "Verified release surface: 148 application tests, 94 Firestore Rules tests, "
    + "25A correctness foundations, 25B MBTI Legacy Profiles, 25C safe draft deletion, "
    + "25D audited League Season bonus ledger, trusted-season-v3 reconciliation, "
    + "and blocked development-branch production deploy scripts.",
  );
  console.log(
    "Firebase production mapping verified: fitnesschallengeapp-9e87f -> Hosting target app -> champions-legacy-challenge.",
  );
  console.log("No deployment is performed by check:release.");
}
