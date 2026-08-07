import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED_RULES_HASH = "683a37cbefd898e4cae4f536426a32669ef7d72ba19d77b7a1ff699b75e8d043";
const EXPECTED_RULES_TEST_HASH = "3cae4d5d44996685a4e9c6c01e7fb7b99c826fbdfc76450b08d4e0926a18a631";

function sha256(relativePath) {
  return crypto.createHash("sha256")
    .update(fs.readFileSync(path.join(root, relativePath)))
    .digest("hex");
}

const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageData.version !== "0.24.0-dev.5") failures.push(`Expected package version 0.24.0-dev.5, found ${packageData.version}.`);
if (!packageData.scripts?.["check:v024:step2d"]) failures.push("Checkpoint 2D verification script is missing.");
for (const scriptName of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
  if (packageData.scripts?.[scriptName] !== "node scripts/block-development-deploy.mjs") failures.push(`${scriptName} must stay blocked during v0.24 development.`);
}
if (sha256("firestore.rules") !== EXPECTED_RULES_HASH) failures.push("firestore.rules does not match Checkpoint 2D.");
if (sha256("tests/firestore.rules.test.mjs") !== EXPECTED_RULES_TEST_HASH) failures.push("Firestore Rules tests do not match Checkpoint 2D.");

const leagues = fs.readFileSync(path.join(root, "src/constants/leagues.js"), "utf8");
if (!leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v3"')) failures.push("Runtime must remain v3 during Checkpoint 2D.");

const rules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");
for (const marker of [
  'return resource.data.rulesVersion in ["season-houses-v3", "season-houses-v4"]',
  'league.rulesVersion in ["season-houses-v3", "season-houses-v4"]',
]) {
  if (!rules.includes(marker)) failures.push(`Required Checkpoint 2D Rules marker missing: ${marker}`);
}
const v3OnlyAssignmentChecks = (rules.match(/league\.rulesVersion == "season-houses-v3"/g) || []).length;
if (v3OnlyAssignmentChecks !== 2) failures.push(`Expected redraw and correction to remain v3-only (2 markers), found ${v3OnlyAssignmentChecks}.`);
for (const marker of ["houseMovementPolicy", "leagueHouseAssignmentHistory", "leagueCompositionProfiles", "leagueHouseBalanceWeeks", "rosterLockThroughWeekKey"]) {
  if (rules.includes(marker)) failures.push(`Later-checkpoint Rules marker appeared too early: ${marker}`);
}

const rulesTests = fs.readFileSync(path.join(root, "tests/firestore.rules.test.mjs"), "utf8");
for (const marker of [
  "weekly Power Play selection is atomic and cannot reuse a selected play",
  "v4 first weekly Power Play selection stays below Rules evaluation",
  "power-season-v4_week-01",
]) {
  if (!rulesTests.includes(marker)) failures.push(`Required Checkpoint 2D Rules-test marker missing: ${marker}`);
}

if (failures.length) {
  console.error("v0.24 checkpoint 2D verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 2D structure verified: first weekly Power Play selection is covered on v4; redraw and locked correction remain v3-only, runtime remains v3, and no House-movement persistence or later v0.24 Rules were added.");
