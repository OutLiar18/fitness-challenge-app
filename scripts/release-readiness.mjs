import fs from "node:fs";
import path from "node:path";

const EXPECTED_VERSION = "0.20.0";
const EXPECTED_HOSTING_TARGET = "app";
const projectRoot = process.cwd();
const requiredFiles = [
  "dist/index.html",
  "firebase.json",
  ".firebaserc",
  "firestore.rules",
  ".env.example",
  "docs/01_CURRENT_DEVELOPMENT/RELEASE_CANDIDATE_CHECKLIST.md",
  "docs/01_CURRENT_DEVELOPMENT/SOURCE_AUDIT_V0200.md",
  "src/services/entries/entryCorrectionModel.js",
  "src/services/entries/entryCorrectionService.js",
  "src/services/entries/entryHistoryModel.js",
  "src/components/admin/EntryIntegrityWorkspace.jsx",
  "src/components/admin/EntryIntegrityWorkspace.css",
  "tests/entry-corrections.test.mjs",
  "docs/02_GAME_DESIGN/AUDITED_ENTRY_CORRECTIONS.md",
  "docs/03_ARCHITECTURE/decisions/ADR-027-audited-entry-corrections-and-active-history.md",
  "scripts/finalise-release.mjs",
];
const forbiddenUpdaterArtifacts = [
  "payload",
  "APPLY_UPDATE.ps1",
  "FINALISE_RELEASE.ps1",
  "README_UPDATE.md",
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
const failures = [];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(projectRoot, relativePath), "utf8"));
}

requiredFiles.forEach((relativePath) => {
  if (!fs.existsSync(path.join(projectRoot, relativePath))) {
    failures.push(`Required release file is missing: ${relativePath}`);
  }
});

forbiddenUpdaterArtifacts.forEach((relativePath) => {
  if (fs.existsSync(path.join(projectRoot, relativePath))) {
    failures.push(`Local updater artifact must remain outside the repository: ${relativePath}`);
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
  if (!packageData.scripts?.test?.includes("tests/entry-corrections.test.mjs")) {
    failures.push("The v0.20.0 entry-correction test suite is not part of npm test.");
  }

  const announcements = fs.readFileSync(
    path.join(projectRoot, "src/constants/announcements.js"),
    "utf8",
  );
  if (!announcements.includes(`version: "${EXPECTED_VERSION}"`)) {
    failures.push(`Bundled announcements do not include v${EXPECTED_VERSION}.`);
  }

  const rules = fs.readFileSync(path.join(projectRoot, "firestore.rules"), "utf8");
  for (const marker of [
    "match /entryCorrectionHeads/{rootEntryId}",
    "match /entryCorrections/{correctionId}",
    "validCorrectionLeagueContributionCreate",
    "validEvidenceClaimSupersede",
  ]) {
    if (!rules.includes(marker)) failures.push(`Firestore Rules are missing: ${marker}`);
  }

  const exportModel = fs.readFileSync(
    path.join(projectRoot, "src/services/account/dataExportModel.js"),
    "utf8",
  );
  if (!exportModel.includes("PERSONAL_DATA_EXPORT_SCHEMA_VERSION = 2")) {
    failures.push("Personal export schema must be version 2 for correction history.");
  }
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
