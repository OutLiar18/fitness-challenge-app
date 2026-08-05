import fs from "node:fs";
import path from "node:path";

const EXPECTED_VERSION = "0.21.0";
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
  "docs/01_CURRENT_DEVELOPMENT/SOURCE_AUDIT_V0210.md",
  "docs/02_GAME_DESIGN/TRUSTED_SEASON_RECONCILIATION.md",
  "docs/03_ARCHITECTURE/decisions/ADR-028-free-first-trusted-season-reconciliation.md",
  "docs/04_DEVELOPMENT/TRUSTED_SEASON_OPERATIONS.md",
  "src/services/seasons/trustedSeasonModel.js",
  "scripts/trusted-season-reconcile.mjs",
  "tests/trusted-season.test.mjs",
  "scripts/finalise-release.mjs",
];

const forbiddenRepositoryArtifacts = [
  "payload",
  "APPLY_UPDATE.ps1",
  "FINALISE_RELEASE.ps1",
  "README_UPDATE.md",
  "trusted-reports",
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
  const hostingSites =
    firebaseAliases.targets?.[defaultProject]?.hosting?.[EXPECTED_HOSTING_TARGET] ?? [];

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
  if (packageData.scripts?.["season:reconcile"] !== "node scripts/trusted-season-reconcile.mjs") {
    failures.push("season:reconcile must run the trusted local dry-run command.");
  }
  if (packageData.scripts?.["season:reconcile:publish"] !== "node scripts/trusted-season-reconcile.mjs --publish") {
    failures.push("season:reconcile:publish must require the explicit publication mode.");
  }
  if (!packageData.scripts?.test?.includes("tests/trusted-season.test.mjs")) {
    failures.push("The v0.21.0 trusted-season test suite is not part of npm test.");
  }
  if (!packageData.devDependencies?.["firebase-admin"]) {
    failures.push("firebase-admin is required for the local trusted operations command.");
  }

  requireText("src/constants/announcements.js", [`version: "${EXPECTED_VERSION}"`]);
  requireText("firestore.rules", ["match /seasonTrustedRuns/{runId}", "allow create, update, delete: if false;"]);
  requireText("src/services/seasons/trustedSeasonModel.js", [
    "TRUSTED_SEASON_MODEL_VERSION",
    "buildTrustedSeasonAudit",
    "createTrustedSeasonFingerprint",
  ]);
  requireText("scripts/trusted-season-reconcile.mjs", [
    "GOOGLE_APPLICATION_CREDENTIALS",
    "trusted-local",
    "Publish a new immutable trusted snapshot",
  ]);
  requireText("src/services/account/dataExportModel.js", ["PERSONAL_DATA_EXPORT_SCHEMA_VERSION = 2"]);
}

if (failures.length > 0) {
  console.error("Release-readiness verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(
    `Release-readiness structure verified for v${EXPECTED_VERSION} on the branded Firebase Hosting target.`,
  );
}
