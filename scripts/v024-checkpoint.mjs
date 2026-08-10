import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED = {
  "firestore.rules": "5956295448d981c79e3065e022d7a86b18a104ac133b4a87848b290630194ee0",
  "tests/firestore.rules.test.mjs": "d2d6fa3aba5b7e7665c5cf42a547888f9e16afa9fdcc35d38f7c7eb7e1a8c385",
  "src/services/seasons/houseMovementModel.js": "f9ff731859be0accdc91b2d1918217e0b3e48a8c866710840b1652df122d0be9",
  "src/services/seasons/houseMovementService.js": "493252a0208c0431f55d1a0c35b2326dc39f6481fb968f9a67ba32b324420b75",
  "src/constants/seasons.js": "a3bcc813f2ddef1d545cb3430976384f341694bba77c2d90a1743000c929e1df",
  "src/pages/Houses.jsx": "42d495800ad65f59723ab44cf56a7a82f1c5b253a4cddc0d6c37e84badaf8ec9",
  "src/pages/Houses.css": "60dc4f3e4020fd9208a918c17412233258d2eb4376ff6888e5785392989db1dd",
  "src/constants/rulebook.js": "658c489b3fdc56ea3edef27f08d8e88732651e9fd216f591382c705cc1627c72",
  "tests/house-movement-domain.test.mjs": "ae12bde84094eb14e1423c6cf832e214d5c491527f04fdedb2835575d04e2133",
};

function normalizedSha256(relativePath) {
  const contents = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/\r\n/g, "\n");
  return crypto.createHash("sha256").update(contents, "utf8").digest("hex");
}
function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const packageData = JSON.parse(read("package.json"));
if (packageData.version !== "0.24.0-dev.16") failures.push(`Expected package version 0.24.0-dev.16, found ${packageData.version}.`);
if (!packageData.scripts?.["check:v024:step7"]) failures.push("Checkpoint 7 verification script is missing.");
for (const scriptName of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
  if (packageData.scripts?.[scriptName] !== "node scripts/block-development-deploy.mjs") failures.push(`${scriptName} must remain blocked during development.`);
}
for (const [file, expected] of Object.entries(EXPECTED)) {
  if (normalizedSha256(file) !== expected) failures.push(`${file} does not match the frozen Checkpoint 7 source.`);
}

const constants = read("src/constants/seasons.js");
for (const marker of [
  'HOUSE_BALANCE_CALCULATION_VERSION = "house-balance-v1"',
  "HOUSE_COMPOSITION_DISCLOSURE_MINIMUM = 3",
]) if (!constants.includes(marker)) failures.push(`Missing Checkpoint 7 constant: ${marker}`);

const model = read("src/services/seasons/houseMovementModel.js");
for (const marker of [
  "buildHouseBalanceCalculation",
  "distributionDeviation",
  'return "insufficient-data"',
  "maximumDeviation <= 15",
  "maximumDeviation <= 25",
  "scoringEnabled: false",
  "getBalanceStatusCopy",
]) if (!model.includes(marker)) failures.push(`Missing Checkpoint 7 model marker: ${marker}`);
for (const forbidden of ["points:", "multiplier:", "standingsAdjustment"]) {
  if (model.includes(forbidden)) failures.push(`Weekly balance must remain informational; forbidden marker found: ${forbidden}`);
}

const service = read("src/services/seasons/houseMovementService.js");
for (const marker of [
  "calculateWeeklyHouseBalance",
  'leagueHouseBalanceWeeks',
  'leagueHouseBalanceHouseWeeks',
  'leagueHouseBalancePrivateWeeks',
  'leagueHouseBalancePrivateHouseWeeks',
  'action: "house.balance-calculated"',
]) if (!service.includes(marker)) failures.push(`Missing Checkpoint 7 service marker: ${marker}`);

const rules = read("firestore.rules");
for (const marker of [
  "function validBalanceDistribution",
  "function validPrivateHouseBalanceWeekCreate",
  "function validPrivateHouseBalanceHouseCreate",
  "function validPublicHouseBalanceWeekCreate",
  "function validPublicHouseBalanceHouseCreate",
  "match /leagueHouseBalanceWeeks/{resultId}",
  "match /leagueHouseBalanceHouseWeeks/{rowId}",
  "match /leagueHouseBalancePrivateWeeks/{resultId}",
  "match /leagueHouseBalancePrivateHouseWeeks/{rowId}",
  'request.resource.data.scoringEnabled == false',
]) if (!rules.includes(marker)) failures.push(`Missing Checkpoint 7 Rules marker: ${marker}`);
const publicHouseRule = rules.slice(
  rules.indexOf("function validPublicHouseBalanceHouseCreate"),
  rules.indexOf("function validRosterSwapV4MovementPolicy"),
);
for (const identityMarker of ["userId", "displayName", "responseCount", "disclosedCount", "preferNotToSayCount"]) {
  const publicKeysSection = publicHouseRule.slice(0, publicHouseRule.indexOf("privateRow."));
  if (publicKeysSection.includes(`"${identityMarker}"`)) failures.push(`Member-visible House balance row exposes forbidden field: ${identityMarker}`);
}

const houses = read("src/pages/Houses.jsx");
for (const marker of [
  "Weekly House balance",
  "Preserve this week’s snapshot",
  "Administrator-only exact snapshot",
  "informational only",
  "subscribeToHouseBalanceWeeks",
  "subscribeToPrivateHouseBalanceWeeks",
]) if (!houses.includes(marker)) failures.push(`Missing Checkpoint 7 Houses UI marker: ${marker}`);

const rulesTests = read("tests/firestore.rules.test.mjs");
for (const marker of [
  "weekly House balance publishes suppressed member summaries while exact counts stay administrator-only",
  "v4 weekly House balance supports eight Houses in the real immutable snapshot batch",
  "Attempted unsafe weekly House balance disclosure",
]) if (!rulesTests.includes(marker)) failures.push(`Missing Checkpoint 7 Rules test marker: ${marker}`);
const rulesTestCount = (rulesTests.match(/^test\(/gm) || []).length;
if (rulesTestCount !== 69) failures.push(`Expected exactly 69 Firestore Rules tests, found ${rulesTestCount}.`);

const domainTests = read("tests/house-movement-domain.test.mjs");
for (const marker of [
  "weekly House balance compares each visible House with the season distribution",
  "weekly House balance suppresses small disclosed groups from the member snapshot",
  "weekly House balance status copy remains informational",
]) if (!domainTests.includes(marker)) failures.push(`Missing Checkpoint 7 domain test marker: ${marker}`);

const checkpointDoc = read("docs/01_CURRENT_DEVELOPMENT/V0240_CHECKPOINTS.md");
if (!checkpointDoc.includes("Status: implemented in `0.24.0-dev.16` as the final security-sensitive feature checkpoint.")) failures.push("Checkpoint 7 documentation is not marked implemented.");

if (failures.length) {
  console.error("v0.24 checkpoint 7 verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 7 structure verified: house-balance-v1 preserves immutable public/private weekly snapshots, suppresses House composition below three disclosed responses, survives the eight-House storage shape, and remains strictly informational with no points or standings effect.");
