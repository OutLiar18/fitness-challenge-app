import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED_RULES_HASH = "182abd59f4404faf8a13357b73335fae1def4c82b30f40f1f035d7a6da12ea72";
const EXPECTED_RULES_TEST_HASH = "67e234d8fddc89f0bea68a84945b55b8a5749e5e9e63b56163839b37a209d8f5";

function sha256(relativePath) {
  return crypto.createHash("sha256")
    .update(fs.readFileSync(path.join(root, relativePath)))
    .digest("hex");
}

const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageData.version !== "0.24.0-dev.7") failures.push(`Expected package version 0.24.0-dev.7, found ${packageData.version}.`);
if (!packageData.scripts?.["check:v024:step2f"]) failures.push("Checkpoint 2F verification script is missing.");
for (const scriptName of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
  if (packageData.scripts?.[scriptName] !== "node scripts/block-development-deploy.mjs") failures.push(`${scriptName} must stay blocked during v0.24 development.`);
}
if (sha256("firestore.rules") !== EXPECTED_RULES_HASH) failures.push("firestore.rules does not match Checkpoint 2F.");
if (sha256("tests/firestore.rules.test.mjs") !== EXPECTED_RULES_TEST_HASH) failures.push("Firestore Rules tests do not match Checkpoint 2F.");

const leagues = fs.readFileSync(path.join(root, "src/constants/leagues.js"), "utf8");
if (!leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v3"')) failures.push("Runtime must remain v3 during Checkpoint 2F.");

const rules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");
for (const marker of [
  'return resource.data.rulesVersion in ["season-houses-v3", "season-houses-v4"]',
  'league.rulesVersion in ["season-houses-v3", "season-houses-v4"]',
]) {
  if (!rules.includes(marker)) failures.push(`Required Checkpoint 2F Rules marker missing: ${marker}`);
}
const v3OnlyAssignmentChecks = (rules.match(/league\.rulesVersion == "season-houses-v3"/g) || []).length;
if (v3OnlyAssignmentChecks !== 0) failures.push(`Expected no Power Play assignment operation to remain v3-only, found ${v3OnlyAssignmentChecks}.`);
for (const marker of ["houseMovementPolicy", "leagueHouseAssignmentHistory", "leagueCompositionProfiles", "leagueHouseBalanceWeeks", "rosterLockThroughWeekKey"]) {
  if (rules.includes(marker)) failures.push(`Later-checkpoint Rules marker appeared too early: ${marker}`);
}

const rulesTests = fs.readFileSync(path.join(root, "tests/firestore.rules.test.mjs"), "utf8");
for (const marker of [
  "weekly Power Play selection is atomic and cannot reuse a selected play",
  "v4 first weekly Power Play selection stays below Rules evaluation",
  "v4 pre-week Power Play redraw stays below Rules evaluation",
  "v4 locked Platform Administrator Power Play correction stays below Rules evaluation",
  "power-redraw-v4_week-01",
  "power-correction-v4",
]) {
  if (!rulesTests.includes(marker)) failures.push(`Required Checkpoint 2F Rules-test marker missing: ${marker}`);
}

if (failures.length) {
  console.error("v0.24 checkpoint 2F verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 2F structure verified: all existing Power Play assignment operations are covered on v4; runtime remains v3, and no House-movement persistence or later v0.24 Rules were added.");
