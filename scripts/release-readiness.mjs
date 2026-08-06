import fs from "node:fs";
import path from "node:path";

const EXPECTED_VERSION = "0.23.0";
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
  "docs/01_CURRENT_DEVELOPMENT/SOURCE_AUDIT_V0230.md",
  "docs/02_GAME_DESIGN/POWER_PLAYS.md",
  "docs/03_ARCHITECTURE/decisions/ADR-030-themed-no-repeat-power-plays.md",
  "docs/04_DEVELOPMENT/POWER_PLAY_OPERATIONS.md",
  "src/constants/powerPlays.js",
  "src/services/seasons/powerPlayModel.js",
  "src/services/seasons/powerPlayService.js",
  "src/components/seasons/PowerPlayWorkspace.jsx",
  "src/components/seasons/PowerPlayWorkspace.css",
  "tests/power-plays.test.mjs",
  "scripts/trusted-season-reconcile.mjs",
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
  "firebase-private",
  "service-account.json",
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
  const lockData = readJson("package-lock.json");
  const firebaseConfig = readJson("firebase.json");
  const firebaseAliases = readJson(".firebaserc");
  const defaultProject = firebaseAliases.projects?.default;
  const hostingSites = firebaseAliases.targets?.[defaultProject]?.hosting?.[EXPECTED_HOSTING_TARGET] ?? [];

  if (packageData.version !== EXPECTED_VERSION) {
    failures.push(`Expected package version ${EXPECTED_VERSION}, found ${packageData.version}.`);
  }
  if (lockData.version !== EXPECTED_VERSION || lockData.packages?.[""]?.version !== EXPECTED_VERSION) {
    failures.push(`package-lock.json must identify v${EXPECTED_VERSION} at the root.`);
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
  if (!packageData.scripts?.test?.includes("tests/power-plays.test.mjs")) {
    failures.push("The v0.23.0 Power Play test suite is not part of npm test.");
  }
  if (!packageData.devDependencies?.["firebase-admin"]) {
    failures.push("firebase-admin is required for trusted local operations.");
  }

  requireText("src/constants/announcements.js", [`version: "${EXPECTED_VERSION}"`]);
  requireText("src/constants/leagues.js", [
    'LEAGUE_RULESET_VERSION = "season-houses-v3"',
    "powerPlayPolicy",
  ]);
  requireText("src/constants/powerPlays.js", [
    'POWER_PLAY_POLICY_VERSION = "power-play-v1"',
    "POWER_PLAY_MULTIPLIERS",
    "POWER_PLAY_CATEGORY_IDS",
  ]);
  requireText("src/services/seasons/powerPlayModel.js", [
    "createDefaultPowerPlayPolicy",
    "createPowerPlayDefinitionMap",
    "chooseRandomPowerPlay",
    "applyPowerPlayToContributionPoints",
    "noRepeatWithinSeason: true",
  ]);
  requireText("src/services/seasons/powerPlayService.js", [
    "selectRandomPowerPlay",
    "correctPowerPlayAssignment",
    "A Power Play already selected earlier in this season cannot be used again.",
    "powerPlayDefinitions",
  ]);
  requireText("src/services/leagues/leagueModel.js", [
    "applyPowerPlayToContributionPoints",
    "powerPlayAssignments",
  ]);
  requireText("src/pages/Seasons.jsx", ["PowerPlayWorkspace", 'id: "power-plays"']);
  requireText("firestore.rules", [
    "powerPlayDefinitions",
    "validPowerPlayStateAdvance",
    "validPowerPlayAssignmentCreate",
    "validPowerPlayAssignmentCorrection",
    "match /leaguePowerPlayWeeks/{assignmentId}",
  ]);
  requireText("scripts/trusted-season-reconcile.mjs", ["powerPlayAssignments"]);
  requireText("scripts/trusted-account-delete.mjs", ["leaguePowerPlayWeeks"]);
  requireText("docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md", [
    "<!-- RELEASE_STATUS: CANDIDATE -->",
    "Version: 0.23.0",
    "Production version: 0.22.0",
  ]);
  requireText("docs/02_GAME_DESIGN/POWER_PLAYS.md", [
    "Release the Kraken",
    "random from the enabled, theme-confirmed, unused pool",
    "A redrawn or corrected-away play also remains consumed",
  ]);
  requireText("docs/01_CURRENT_DEVELOPMENT/RELEASE_CANDIDATE_CHECKLIST.md", [
    "120 domain tests",
    "51 Firestore Security Rules tests",
  ]);
}

if (failures.length > 0) {
  console.error("Release-readiness verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Release-readiness structure verified for v${EXPECTED_VERSION} on the branded Firebase Hosting target.`);
}
