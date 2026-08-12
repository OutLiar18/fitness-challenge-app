import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const EXPECTED_VERSION = "0.27.0";
const EXPECTED_PROJECT = "fitnesschallengeapp-9e87f";
const EXPECTED_HOSTING_TARGET = "app";
const EXPECTED_HOSTING_SITE = "champions-legacy-challenge";
const EXPECTED_APP_TEST_COUNT = 188;
const EXPECTED_RULES_TEST_COUNT = 98;
const RELEASE_SOURCE_BASELINE = "ad92777cfa86481002639297ce8c7dce69b0e269";
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
      `HEAD ${head} does not descend from accepted 27G source ${RELEASE_SOURCE_BASELINE}.`,
    );
    return;
  }

  const changed = git(["diff", "--name-only", RELEASE_SOURCE_BASELINE, "--"])
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  const allowed = new Set([
    "package.json",
    "scripts/release-readiness.mjs",
    "scripts/block-development-deploy.mjs",
    "tests/v027-acceptance.test.mjs",
  ]);

  const unexpected = changed.filter(
    (relativePath) => !relativePath.startsWith("docs/") && !allowed.has(relativePath),
  );

  if (unexpected.length > 0) {
    failures.push(
      `Runtime/application source changed after accepted 27G baseline: ${unexpected.join(", ")}.`,
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
    !== "npm run check && node scripts/release-readiness.mjs"
  ) {
    failures.push(
      "check:release must run the full v0.27 application gate followed by the 27R verifier.",
    );
  }

  const blockedScript = "node scripts/block-development-deploy.mjs";
  for (const name of [
    "finalise:release",
    "deploy:rules",
    "deploy:hosting",
    "deploy:production",
  ]) {
    if (packageData.scripts?.[name] !== blockedScript) {
      failures.push(`${name} must remain blocked during the v0.27 release freeze.`);
    }
  }

  if (packageData.scripts?.check !== "npm run lint && npm test && npm run build && npm run accept:v027") {
    failures.push("The normal v0.27 application check must retain lint, tests, build and accept:v027.");
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

  if (appTestCount !== EXPECTED_APP_TEST_COUNT) {
    failures.push(
      `Expected exactly ${EXPECTED_APP_TEST_COUNT} application tests in the frozen npm test surface; found ${appTestCount}.`,
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
    `Expected ${EXPECTED_RULES_TEST_COUNT} Firestore Rules tests to remain available; found ${rulesTestCount}.`,
  );
}

const rulesSha = canonicalSha256("firestore.rules");
if (rulesSha !== EXPECTED_RULES_SHA) {
  failures.push(
    `Firestore Rules changed unexpectedly. Expected SHA-256 ${EXPECTED_RULES_SHA}, found ${rulesSha}. `
    + "Stop 27R and run an isolated Rules regression before proceeding.",
  );
}

requireText("docs/01_CURRENT_DEVELOPMENT/V027_ACCEPTANCE_AUTOMATED.md", [
  "Automated status: **PASS**",
  "Browser-native confirm/prompt usages in pages/components: 0",
]);

requireText("docs/01_CURRENT_DEVELOPMENT/V027_PERFORMANCE_ACCEPTANCE.md", [
  "Manual acceptance status: **PASS**",
  "27G accepted on 11 August 2026",
  "five bounded 27G defects",
]);

requireText("docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md", [
  "27R release freeze",
  "27G manual authenticated visual acceptance: PASSED",
  "Production version: 0.26.0",
]);

requireText("docs/01_CURRENT_DEVELOPMENT/V027_RELEASE_CANDIDATE.md", [
  RELEASE_SOURCE_BASELINE,
  EXPECTED_RULES_SHA,
  "188/188 application tests",
  "27G manual authenticated visual acceptance: PASS",
  "NO FIREBASE DEPLOYMENT",
  "separate reviewed production activation runner",
]);

requireText("scripts/block-development-deploy.mjs", [
  "v0.27.0 release freeze",
  "v0.26.0 remains the verified production baseline",
]);

verifyFrozenSourceBoundary();

if (failures.length > 0) {
  console.error("v0.27.0 release-readiness verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("27R RELEASE-READINESS: PASS");
  console.log(`Accepted 27G runtime baseline: ${RELEASE_SOURCE_BASELINE}.`);
  console.log(`Application tests in frozen npm test surface: ${globalThis.__releaseAppTestCount}.`);
  console.log(`Firestore Rules tests retained: ${EXPECTED_RULES_TEST_COUNT}.`);
  console.log(`Canonical unchanged Firestore Rules SHA-256: ${rulesSha}.`);
  console.log(
    "Rules emulator regression was not rerun because firestore.rules remains byte-for-byte "
    + "identical to the verified v0.26 production Rules source.",
  );
  console.log(
    "Firebase production mapping verified: fitnesschallengeapp-9e87f -> "
    + "Hosting target app -> champions-legacy-challenge.",
  );
  console.log("Development production/finalisation scripts remain blocked.");
  console.log("NO FIREBASE DEPLOYMENT is performed by 27R.");
}
