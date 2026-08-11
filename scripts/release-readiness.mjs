import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const EXPECTED_VERSION = "0.26.0";
const EXPECTED_PROJECT = "fitnesschallengeapp-9e87f";
const EXPECTED_HOSTING_TARGET = "app";
const EXPECTED_HOSTING_SITE = "champions-legacy-challenge";
const EXPECTED_RULES_TEST_COUNT = 98;
const MIN_APP_TEST_COUNT = 148;
const RELEASE_SOURCE_BASELINE = "909fe8938237c70b69aab1d72a2fef9ee2780e37";
const EXPECTED_RULES_SHA =
  "35d12a285436b420a13ec3cfaac0b9cd93a9c4a2a2d38735e92a7c0b950cef6e";

const root = process.cwd();
const failures = [];

function readJson(relativePath) {
  const fullPath = path.join(root, relativePath);
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
  const fullPath = path.join(root, relativePath);
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
      cwd: root,
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
      cwd: root,
      stdio: "ignore",
    });
  } catch {
    failures.push(
      `HEAD ${head} does not descend from the completed 26I source ${RELEASE_SOURCE_BASELINE}.`,
    );
    return;
  }

  const changed = git(["diff", "--name-only", RELEASE_SOURCE_BASELINE, "--"])
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  const allowed = changed.filter(
    (relativePath) =>
      relativePath === "scripts/release-readiness.mjs"
      || relativePath.startsWith("docs/"),
  );
  const unexpected = changed.filter((relativePath) => !allowed.includes(relativePath));

  if (unexpected.length > 0) {
    failures.push(
      `Application/security source changed after 26I freeze baseline: ${unexpected.join(", ")}.`,
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
    failures.push(
      "check:release must run the application gate, Rules emulator gate, then the v0.26 verifier.",
    );
  }

  const blockedScript = "node scripts/block-development-deploy.mjs";
  for (const name of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
    if (packageData.scripts?.[name] !== blockedScript) {
      failures.push(`${name} must remain blocked during the v0.26 release freeze.`);
    }
  }

  const requiredAppTests = [
    "tests/house-movement-domain.test.mjs",
    "tests/power-plays.test.mjs",
    "tests/v025-ui-foundations.test.mjs",
    "tests/mbti-profiles.test.mjs",
    "tests/draft-deletion.test.mjs",
    "tests/season-bonus.test.mjs",
    "tests/trusted-account-deletion.test.mjs",
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
  const appTestCount = testFiles.reduce(
    (total, relativePath) => total + countTests(relativePath),
    0,
  );
  if (appTestCount < MIN_APP_TEST_COUNT) {
    failures.push(
      `Expected at least ${MIN_APP_TEST_COUNT} application tests across npm test; found ${appTestCount}.`,
    );
  }
  globalThis.__releaseAppTestCount = appTestCount;
}

if (lockData) {
  if (
    lockData.version !== EXPECTED_VERSION
    || lockData.packages?.[""]?.version !== EXPECTED_VERSION
  ) {
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
    failures.push(
      `Hosting target ${EXPECTED_HOSTING_TARGET} must map to ${EXPECTED_HOSTING_SITE}.`,
    );
  }
}

const rulesTestCount = countTests("tests/firestore.rules.test.mjs");
if (rulesTestCount !== EXPECTED_RULES_TEST_COUNT) {
  failures.push(
    `Expected ${EXPECTED_RULES_TEST_COUNT} Firestore Rules tests; found ${rulesTestCount}.`,
  );
}

const rulesSha = canonicalSha256("firestore.rules");
if (rulesSha !== EXPECTED_RULES_SHA) {
  failures.push(
    `Expected Firestore Rules SHA-256 ${EXPECTED_RULES_SHA}, found ${rulesSha}.`,
  );
}

requireText("firestore.rules", [
  "function isPlatformAdmin()",
  "function isLeagueAdministrator(leagueId)",
  "match /seasonBonusRequests/{requestId}",
  "match /seasonBonusAwards/{awardId}",
  "match /{document=**}",
  "allow read, write: if false;",
]);

requireText("scripts/v026-security-baseline.mjs", [
  "Platform Admin source    : Firestore trusted role profile ONLY",
  "League Admin global role : bootstrap create only",
  "Rules simplification     : retired Team/reviewer blocks + read aliases removed",
  "Advanced infrastructure  : DEFERRED UNTIL SCALE REQUIRES IT",
  "practical 26B/26C/26F/26I contracts",
]);

for (const retiredToken of [
  "match /teams/{document=**}",
  "match /playerTeams/{document=**}",
  "match /teamInvites/{document=**}",
  "match /leagueEvidenceReviewers/{assignmentId}",
  "canReadEvidenceOperations",
  "canReadLiveLeagueOperations",
]) {
  if (readText("firestore.rules").includes(retiredToken)) {
    failures.push(`Retired Rules token returned after 26I: ${retiredToken}`);
  }
}

for (const deferredArtifact of [
  "docs/01_CURRENT_DEVELOPMENT/V026_APP_CHECK_CSP_READINESS.md",
  "docs/01_CURRENT_DEVELOPMENT/V026_FIRESTORE_BACKUP_RESTORE.md",
  "scripts/v026-appcheck-csp-readiness.mjs",
  "scripts/trusted-firestore-recovery-plan.mjs",
  "tests/trusted-firestore-recovery.test.mjs",
]) {
  if (fs.existsSync(path.join(root, deferredArtifact))) {
    failures.push(`Deferred infrastructure artifact returned: ${deferredArtifact}`);
  }
}

requireText("docs/01_CURRENT_DEVELOPMENT/V026_RELEASE_CANDIDATE.md", [
  RELEASE_SOURCE_BASELINE,
  EXPECTED_RULES_SHA,
  "NO FIREBASE DEPLOYMENT",
]);

requireText("scripts/block-development-deploy.mjs", [
  "Production deployment is intentionally blocked",
]);

verifyFrozenSourceBoundary();

if (failures.length > 0) {
  console.error("v0.26.0 release-readiness verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Release-readiness structure verified for v0.26.0.");
  console.log(`Frozen 26I application/security baseline: ${RELEASE_SOURCE_BASELINE}.`);
  console.log(`Application tests in frozen npm test surface: ${globalThis.__releaseAppTestCount}.`);
  console.log(`Firestore Rules tests: ${EXPECTED_RULES_TEST_COUNT}.`);
  console.log(`Canonical Firestore Rules SHA-256: ${rulesSha}.`);
  console.log(
    "Verified practical security surface: canonical Platform Admin profile authority, "
    + "league-scoped operations, Platform-Admin-only evidence decisions, House movement/rest, "
    + "Power Plays, League Season bonus ledger, trusted account-deletion recovery, "
    + "recursive deny-all fallback and deferred enterprise infrastructure.",
  );
  console.log(
    "Firebase production mapping verified: fitnesschallengeapp-9e87f -> Hosting target app -> champions-legacy-challenge.",
  );
  console.log("Development-branch production deploy scripts remain blocked.");
  console.log("NO FIREBASE DEPLOYMENT is performed by check:release.");
}
