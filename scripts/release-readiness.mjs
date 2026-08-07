import fs from "node:fs";
import path from "node:path";

const EXPECTED_VERSION = "0.22.0";
const EXPECTED_HOSTING_TARGET = "app";
const projectRoot = process.cwd();
const failures = [];

const requiredFiles = [
  "dist/index.html",
  "firebase.json",
  ".firebaserc",
  "firestore.rules",
  ".env.example",
  "docs/01_CURRENT_DEVELOPMENT/RELEASE_CANDIDATE_CHECKLIST.md",
  "docs/01_CURRENT_DEVELOPMENT/SOURCE_AUDIT_V0220.md",
  "docs/02_GAME_DESIGN/TRUSTED_ACCOUNT_DELETION.md",
  "docs/03_ARCHITECTURE/decisions/ADR-029-trusted-account-deletion-and-anonymised-history.md",
  "docs/04_DEVELOPMENT/TRUSTED_ACCOUNT_DELETION_OPERATIONS.md",
  "src/services/account/accountModel.js",
  "src/services/account/trustedDeletionModel.js",
  "scripts/trusted-account-delete.mjs",
  "tests/trusted-account-deletion.test.mjs",
  "scripts/finalise-release.mjs",
];

const forbiddenRepositoryArtifacts = [
  "payload",
  "APPLY_UPDATE.ps1",
  "FINALISE_RELEASE.ps1",
  "README_UPDATE.md",
  "trusted-reports",
  "trusted-account-deletion-reports",
  "account-deletion-reports",
  "champions-legacy-account-deletion-reports",
  "src/src",
  "tests/tests",
  "docs/docs",
  "public/public",
  "scripts/scripts",
  "src/context/TeamProvider.jsx",
  "src/context/TeamContext.js",
  "src/hooks/useTeam.js",
  "src/constants/teams.js",
  "src/services/teams",
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath), "utf8"));
}

function requireText(relativePath, markers) {
  const fullPath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(fullPath)) return;
  const text = fs.readFileSync(fullPath, "utf8");
  markers.forEach((marker) => {
    if (!text.includes(marker)) failures.push(`${relativePath} is missing: ${marker}`);
  });
}

requiredFiles.forEach((relativePath) => {
  if (!fs.existsSync(path.join(projectRoot, relativePath))) {
    failures.push(`Required release file is missing: ${relativePath}`);
  }
});

forbiddenRepositoryArtifacts.forEach((relativePath) => {
  if (fs.existsSync(path.join(projectRoot, relativePath))) {
    failures.push(`Local or retired artifact must remain outside the repository: ${relativePath}`);
  }
});

if (failures.length === 0) {
  const packageData = readJson("package.json");
  const firebaseConfig = readJson("firebase.json");
  const firebaseAliases = readJson(".firebaserc");
  const defaultProject = firebaseAliases.projects?.default;
  const hostingSites = firebaseAliases.targets?.[defaultProject]?.hosting?.[EXPECTED_HOSTING_TARGET] ?? [];

  if (packageData.version !== EXPECTED_VERSION) {
    failures.push(`Expected package version ${EXPECTED_VERSION}, found ${packageData.version}.`);
  }
  if (firebaseConfig.hosting?.target !== EXPECTED_HOSTING_TARGET) {
    failures.push(`Firebase Hosting must target ${EXPECTED_HOSTING_TARGET}.`);
  }
  if (!hostingSites.includes("champions-legacy-challenge")) {
    failures.push("The app Hosting target is not mapped to champions-legacy-challenge.");
  }
  if (packageData.scripts?.["finalise:release"] !== "node scripts/finalise-release.mjs") {
    failures.push("finalise:release must run the in-repository release finaliser.");
  }
  if (!packageData.scripts?.["deploy:production"]?.includes("firestore:rules,hosting:app")) {
    failures.push("deploy:production must deploy Firestore Rules and the branded app target together.");
  }

  const expectedScripts = {
    "account:deletion:list": "node --import=./scripts/register-loader.mjs scripts/trusted-account-delete.mjs --list",
    "account:deletion:audit": "node --import=./scripts/register-loader.mjs scripts/trusted-account-delete.mjs",
    "account:deletion:process": "node --import=./scripts/register-loader.mjs scripts/trusted-account-delete.mjs --process",
  };
  Object.entries(expectedScripts).forEach(([name, command]) => {
    if (packageData.scripts?.[name] !== command) failures.push(`${name} is not configured correctly.`);
  });
  if (!packageData.scripts?.test?.includes("tests/trusted-account-deletion.test.mjs")) {
    failures.push("The v0.22.0 trusted account-deletion test suite is not part of npm test.");
  }
  if (!packageData.devDependencies?.["firebase-admin"]) {
    failures.push("firebase-admin is required for trusted local operations.");
  }

  requireText("src/constants/announcements.js", [`version: "${EXPECTED_VERSION}"`]);
  requireText("firestore.rules", [
    "match /accountDeletionExecutions/{executionId}",
    "match /accountDeletionReceipts/{receiptId}",
    "deletionPolicyVersion == \"trusted-deletion-v1\"",
    "waitingPeriodDays == 7",
  ]);
  requireText("src/services/account/accountModel.js", [
    "ACCOUNT_DELETION_WAITING_DAYS = 7",
    "TRUSTED_ACCOUNT_DELETION_POLICY_VERSION",
    "createFormerPlayerIdentity",
  ]);
  requireText("src/services/account/trustedDeletionModel.js", [
    "buildTrustedAccountDeletionAudit",
    "replaceDeletedPlayerIdentity",
    "LAST_PLATFORM_ADMIN",
  ]);
  requireText("scripts/trusted-account-delete.mjs", [
    "GOOGLE_APPLICATION_CREDENTIALS",
    "champions-legacy-account-deletion-reports",
    "Type DELETE",
    "deleteUser",
  ]);
  requireText("src/services/account/dataExportModel.js", ["PERSONAL_DATA_EXPORT_SCHEMA_VERSION = 3"]);
}

if (failures.length > 0) {
  console.error("Release-readiness verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Release-readiness structure verified for v${EXPECTED_VERSION} on the branded Firebase Hosting target.`);
}
