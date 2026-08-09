import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const EXPECTED_VERSION = "0.24.0";
const EXPECTED_PROJECT = "fitnesschallengeapp-9e87f";
const EXPECTED_HOSTING_TARGET = "app";
const EXPECTED_HOSTING_SITE = "champions-legacy-challenge";
const EXPECTED_RULES_TEST_COUNT = 79;
const projectRoot = process.cwd();
const failures = [];

const expectedHashes = {
  "firestore.rules": "0ffa958a31cf2562acb00132a42a171eb89d8764848cca95aeb60df38b2ebc82",
  "tests/firestore.rules.test.mjs": "96e349f9fd0896da712799d6de7799de8dd21b508641dbffdedc3a9dda13f37b",
  "tests/evidence-system.test.mjs": "390a3f7daaee5eed7c6c82d8efc2321548125e41f727d0e174ba5a7fb075a4d6",
  "tests/season-operations.test.mjs": "7ac8a1f87b6ca618cbc5abcc56a1c7559b4a23b94fde74c41b4d25160e78dea4",
  "src/services/evidence/evidenceModel.js": "2a544b847bc89f847bdc211053a2b03033a6ba2b18ce9fe196feb8bda282b6f5",
  "src/services/evidence/evidenceService.js": "4f05e036f0e0d94e988019a3b306ab148d4d3cf0ec01ed038895be77c0d591b7",
  "src/pages/Seasons.jsx": "75ca30f4a38295764eac88a6531e1aae788bb2232e9e67177d0aecbc3d432fc7",
  "src/components/seasons/EvidenceWorkspace.jsx": "40c0d724e84e70f65271a785ce35b08682e518855902640d1cb5f3a706f80bca",
  "src/components/seasons/EvidenceWorkspace.css": "649806ae200978e5b44143d1458e5a217f36a100b26c6c04fd389e1eb989dad2",
  "src/components/seasons/SeasonCommandCentre.jsx": "83568341bd9c7098c76f8feaf00d0513e893f56fbf71cd49b123ef27907a4398",
  "src/services/seasons/seasonOperationsModel.js": "2a7db34ccdafa736d6c493e1b1d16d4f886519c433ed39f531c0659f202fdab1",
  "src/services/seasons/seasonOperationsService.js": "dd81e604ce4422af55f30217538739d106ce8b8216c0e5d21c7eccea2b0d633d",
  "src/services/seasons/houseMovementModel.js": "f9ff731859be0accdc91b2d1918217e0b3e48a8c866710840b1652df122d0be9",
  "src/services/seasons/houseMovementService.js": "493252a0208c0431f55d1a0c35b2326dc39f6481fb968f9a67ba32b324420b75",
  "src/pages/Houses.jsx": "42d495800ad65f59723ab44cf56a7a82f1c5b253a4cddc0d6c37e84badaf8ec9",
  "src/pages/Houses.css": "60dc4f3e4020fd9208a918c17412233258d2eb4376ff6888e5785392989db1dd",
  "src/constants/powerPlays.js": "fc61eb249ccf989ecc37b4b5e6a4b54561f388485d7260fd5b3b1c72b93fb4fe",
  "src/services/seasons/powerPlayModel.js": "52e5f35758c77f4d8884c3d4dfacc938d211caf00a3ab6fffd2bf088f12d177d",
  "src/services/seasons/powerPlayService.js": "29545b2ef81683d9dd250e644b81941fba6b24d2f50683bdbc2f26ec2c34aed8",
  "scripts/trusted-season-reconcile.mjs": "5c87cfed3d0b3ebdd21efec8f8629b03965cc51ddd975f97c60c17b71de98a10",
  "scripts/trusted-account-delete.mjs": "f944ca1ecd1ceaf3daa05f0cd44387bc15844e4cec8a5555cc9dddcdd298f83d",
};

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

function sha256(relativePath) {
  const fullPath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Required frozen file is missing: ${relativePath}`);
    return "";
  }
  return crypto.createHash("sha256").update(fs.readFileSync(fullPath)).digest("hex");
}

function requireTestCount(relativePath, expectedCount) {
  const fullPath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Required test file is missing: ${relativePath}`);
    return;
  }
  const text = fs.readFileSync(fullPath, "utf8");
  const count = (text.match(/^\s*test\(/gm) ?? []).length;
  if (count !== expectedCount) {
    failures.push(`${relativePath} must contain exactly ${expectedCount} Rules tests; found ${count}.`);
  }
}

function requireText(relativePath, markers) {
  const fullPath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    failures.push(`Required file is missing: ${relativePath}`);
    return;
  }
  const text = fs.readFileSync(fullPath, "utf8");
  for (const marker of markers) {
    if (!text.includes(marker)) failures.push(`${relativePath} is missing required marker: ${marker}`);
  }
}

const packageData = readJson("package.json");
const lockData = readJson("package-lock.json");
const firebaseConfig = readJson("firebase.json");
const firebaseAliases = readJson(".firebaserc");

if (packageData) {
  if (packageData.version !== EXPECTED_VERSION) failures.push(`Expected package version ${EXPECTED_VERSION}, found ${packageData.version}.`);
  if (packageData.scripts?.["check:release"] !== "npm run check && npm run test:rules && node scripts/release-readiness.mjs") {
    failures.push("check:release must run check, Rules tests, then the v0.24 release verifier.");
  }
  const blockedScript = "node scripts/block-development-deploy.mjs";
  for (const name of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
    if (packageData.scripts?.[name] !== blockedScript) failures.push(`${name} must remain blocked until the isolated production deployment stage.`);
  }
  if (!packageData.scripts?.test?.includes("tests/house-movement-domain.test.mjs")) failures.push("House Movement domain tests must remain part of npm test.");
  if (!packageData.scripts?.test?.includes("tests/power-plays.test.mjs")) failures.push("Power Play domain tests must remain part of npm test.");
}

if (lockData) {
  if (lockData.version !== EXPECTED_VERSION || lockData.packages?.[""]?.version !== EXPECTED_VERSION) {
    failures.push(`package-lock.json must identify v${EXPECTED_VERSION} at the root.`);
  }
}

if (firebaseConfig) {
  if (firebaseConfig.firestore?.rules !== "firestore.rules") failures.push("firebase.json must point Firestore to firestore.rules.");
  if (firebaseConfig.hosting?.target !== EXPECTED_HOSTING_TARGET) failures.push(`Firebase Hosting must target ${EXPECTED_HOSTING_TARGET}.`);
  if (firebaseConfig.hosting?.public !== "dist") failures.push("Firebase Hosting public folder must remain dist.");
}

if (firebaseAliases) {
  const defaultProject = firebaseAliases.projects?.default;
  const hostingSites = firebaseAliases.targets?.[defaultProject]?.hosting?.[EXPECTED_HOSTING_TARGET] ?? [];
  if (defaultProject !== EXPECTED_PROJECT) failures.push(`Default Firebase project must be ${EXPECTED_PROJECT}.`);
  if (!hostingSites.includes(EXPECTED_HOSTING_SITE)) failures.push(`Hosting target ${EXPECTED_HOSTING_TARGET} must map to ${EXPECTED_HOSTING_SITE}.`);
}

for (const [relativePath, expectedHash] of Object.entries(expectedHashes)) {
  const actualHash = sha256(relativePath);
  if (actualHash && actualHash !== expectedHash) failures.push(`${relativePath} no longer matches the frozen Checkpoint 7 / 8B release baseline.`);
}

requireTestCount("tests/firestore.rules.test.mjs", EXPECTED_RULES_TEST_COUNT);
requireText("src/constants/leagues.js", ['LEAGUE_RULESET_VERSION = "season-houses-v4"']);
requireText("src/constants/seasons.js", ['HOUSE_BALANCE_CALCULATION_VERSION = "house-balance-v1"']);
requireText("src/services/seasons/houseMovementModel.js", ["scoringEnabled: false", "buildHouseBalanceCalculation"]);
requireText("src/services/seasons/houseMovementService.js", ["leagueCompositionProfiles", "leagueHouseBalanceWeeks", "leagueHouseBalancePrivateWeeks"]);
requireText("src/pages/Houses.jsx", ["CompositionBalancePanel", "Weekly balance is informational only."]);
requireText("firestore.rules", [
  "leagueCompositionProfiles",
  "leagueHouseBalanceWeeks",
  "leagueHouseBalancePrivateWeeks",
  "leagueHouseAssignmentHistory",
  "Retired in v0.24 Checkpoint 8G",
]);
requireText("docs/03_ARCHITECTURE/decisions/ADR-027-trusted-platform-admin-transactions.md", [
  "Trusted Platform Administrator Transaction Boundary",
  "Player-originated evidence claim creation remains strictly validated",
]);
requireText("docs/03_ARCHITECTURE/decisions/ADR-028-trusted-derived-record-boundary.md", [
  "Trusted Derived-Record Boundary",
  "No ordinary player gains a new write path",
]);
requireText("docs/03_ARCHITECTURE/decisions/ADR-029-trusted-platform-operations.md", [
  "Trusted Platform Operations Boundary",
  "Player-originated suggestion creation, client-error report creation",
]);
requireText("docs/03_ARCHITECTURE/decisions/ADR-029-trusted-platform-operations.md", [
  "Trusted Platform Operations Boundary",
  "Player-originated suggestion creation, client-error report creation",
]);
requireText("src/services/evidence/evidenceService.js", [
  "Only Platform Administrators can review evidence.",
]);
requireText("src/components/seasons/EvidenceWorkspace.jsx", [
  "Only Platform Administrators can make evidence decisions.",
  "Decision authority",
]);
requireText("scripts/block-development-deploy.mjs", ["Production deployment is intentionally blocked"]);

if (failures.length > 0) {
  console.error("v0.24.0 release-readiness verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Release-readiness structure verified for v0.24.0.");
  console.log("Frozen baseline: 131 domain tests, 79 Firestore Rules tests, Platform-Administrator-only evidence decisions, trusted derived-record and Platform-operations boundaries, v4 House Movement, composition privacy, and house-balance-v1 hashes pinned.");
  console.log("Firebase production mapping verified: fitnesschallengeapp-9e87f -> Hosting target app -> champions-legacy-challenge.");
  console.log("Production deploy scripts remain intentionally blocked. No deployment is performed by check:release.");
}
