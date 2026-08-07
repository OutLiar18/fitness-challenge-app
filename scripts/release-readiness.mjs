import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const EXPECTED_VERSION = "0.23.5";
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
  "docs/01_CURRENT_DEVELOPMENT/SOURCE_AUDIT_V0235.md",
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
  "src/services/seasons/houseMovementModel.js",
  "src/services/seasons/houseMovementService.js",
  "tests/house-movement.test.mjs",
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
  if (packageData.scripts?.["deploy:production"] !== "npm run check:release && npm run deploy:rules && npm run deploy:hosting") {
    failures.push("deploy:production must deploy verified Firestore Rules before Hosting.");
  }
  if (!packageData.scripts?.test?.includes("tests/power-plays.test.mjs")) {
    failures.push("The Power Play test suite is not part of npm test.");
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
    "Version: 0.23.5",
    "Production version: 0.23.0",
    "season-houses-v3",
  ]);
  requireText("docs/02_GAME_DESIGN/POWER_PLAYS.md", [
    "Release the Kraken",
    "random from the enabled, theme-confirmed, unused pool",
    "A redrawn or corrected-away play also remains consumed",
  ]);
  requireText("docs/01_CURRENT_DEVELOPMENT/RELEASE_CANDIDATE_CHECKLIST.md", [
    "120 domain tests",
    "51 Firestore Rules tests",
  ]);

  requireText("src/constants/announcements.js", [
    'id: "v0-23-5-stability-checkpoint"',
    'version: "0.23.5"',
  ]);

  const forbiddenV024Markers = [
    ["src/constants/leagues.js", "season-houses-v4"],
    ["src/constants/leagues.js", "houseMovementPolicy"],
    ["src/pages/Houses.jsx", "houseMovementModel"],
    ["src/pages/Houses.jsx", "houseMovementService"],
    ["firestore.rules", "leagueHouseBalanceWeeks"],
    ["firestore.rules", "leagueCompositionProfiles"],
  ];
  forbiddenV024Markers.forEach(([relativePath, marker]) => {
    const text = fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
    if (text.includes(marker)) failures.push(`${relativePath} must not contain deferred v0.24 marker: ${marker}`);
  });

  const expectedRulesHash = "260fc21d98dc39412c814eff97719621a01bbe691d4c8bf7d016280698b1efb4";
  const expectedRulesTestHash = "7af40d7560f5dc207ffe755bf7236a21ea8c8aff832463de456f4d42dcb1d079";
  const sha256 = (relativePath) => crypto.createHash("sha256").update(fs.readFileSync(path.join(projectRoot, relativePath))).digest("hex");
  if (sha256("firestore.rules") !== expectedRulesHash) failures.push("firestore.rules no longer matches the verified v0.23 security baseline.");
  if (sha256("tests/firestore.rules.test.mjs") !== expectedRulesTestHash) failures.push("Firestore Rules tests no longer match the verified v0.23 baseline.");
}

if (failures.length > 0) {
  console.error("Release-readiness verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`Release-readiness structure verified for v${EXPECTED_VERSION} on the branded Firebase Hosting target.`);
}
