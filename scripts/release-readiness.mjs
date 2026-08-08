import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const EXPECTED_VERSION = "0.24.0";
const EXPECTED_PROJECT = "fitnesschallengeapp-9e87f";
const EXPECTED_HOSTING_TARGET = "app";
const EXPECTED_HOSTING_SITE = "champions-legacy-challenge";
const projectRoot = process.cwd();
const failures = [];

const expectedHashes = {
  "firestore.rules": "5956295448d981c79e3065e022d7a86b18a104ac133b4a87848b290630194ee0",
  "tests/firestore.rules.test.mjs": "d2d6fa3aba5b7e7665c5cf42a547888f9e16afa9fdcc35d38f7c7eb7e1a8c385",
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
]);
requireText("scripts/block-development-deploy.mjs", ["Production deployment is intentionally blocked"]);

if (failures.length > 0) {
  console.error("v0.24.0 release-readiness verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Release-readiness structure verified for v0.24.0.");
  console.log("Frozen baseline: 131 domain tests, 69 Firestore Rules tests, v4 House Movement, composition privacy, and house-balance-v1 hashes pinned.");
  console.log("Firebase production mapping verified: fitnesschallengeapp-9e87f -> Hosting target app -> champions-legacy-challenge.");
  console.log("Production deploy scripts remain intentionally blocked. No deployment is performed by check:release.");
}
