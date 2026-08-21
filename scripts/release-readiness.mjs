import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const EXPECTED_VERSION = "0.29.0";
const EXPECTED_PROJECT = "fitnesschallengeapp-9e87f";
const EXPECTED_HOSTING_TARGET = "app";
const EXPECTED_HOSTING_SITE = "champions-legacy-challenge";
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

const packageData = readJson("package.json");
const lockData = readJson("package-lock.json");
const firebaseConfig = readJson("firebase.json");
const firebaseAliases = readJson(".firebaserc");

if (packageData) {
  if (packageData.version !== EXPECTED_VERSION) {
    failures.push(`Expected package version ${EXPECTED_VERSION}, found ${packageData.version}.`);
  }

  if (packageData.scripts?.check !== "npm run lint && npm test && npm run build && npm run quality:ui") {
    failures.push("npm run check must retain lint, tests, build and the UI quality gate.");
  }

  if (packageData.scripts?.["quality:ui"] !== "node scripts/ui-quality-check.mjs --verify") {
    failures.push("quality:ui must run the version-neutral UI quality verifier.");
  }

  const blockedScript = "node scripts/block-development-deploy.mjs";
  for (const name of ["finalise:release", "deploy:rules", "deploy:hosting", "deploy:production"]) {
    if (packageData.scripts?.[name] !== blockedScript) {
      failures.push(`${name} must remain blocked from normal development commands.`);
    }
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

const rulesSha = canonicalSha256("firestore.rules");
if (rulesSha !== EXPECTED_RULES_SHA) {
  failures.push(
    `Firestore Rules changed. Expected canonical SHA-256 ${EXPECTED_RULES_SHA}, found ${rulesSha}. `
    + "Treat Rules changes as a separate security review.",
  );
}

for (const forbidden of [".env", ".firebase", "firebase-debug.log", "firestore-debug.log"]) {
  const tracked = git(["ls-files", "--", forbidden]);
  if (tracked) {
    failures.push(`Local/generated artifact must not be tracked in release source: ${forbidden}`);
  }
}

requireText("README.md", ["Development line: **v0.29.0**", "Production: **v0.28.0**"]);
requireText("docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md", [
  "Current development branch: `development/v0.29.0`",
  "Production version: **v0.28.0**",
]);
requireText("docs/01_CURRENT_DEVELOPMENT/NEXT_SESSION.md", ["development/v0.29.0"]);
requireText("scripts/block-development-deploy.mjs", ["Production deployment is intentionally blocked"]);

const branch = git(["branch", "--show-current"]);
if (branch && branch !== "development/v0.29.0") {
  failures.push(`Release-readiness should run from development/v0.29.0; current branch is ${branch}.`);
}

if (failures.length > 0) {
  console.error("Release-readiness verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("RELEASE READINESS: PASS");
  console.log(`- Package version: ${EXPECTED_VERSION}`);
  console.log(`- Firebase project: ${EXPECTED_PROJECT}`);
  console.log(`- Hosting target/site: ${EXPECTED_HOSTING_TARGET} / ${EXPECTED_HOSTING_SITE}`);
  console.log(`- Firestore Rules SHA-256: ${EXPECTED_RULES_SHA}`);
  console.log("- Normal production deploy commands remain blocked.");
}
