import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED_RULES_HASH = "eb113d92b47162e6d336156d47a82730ffe09c888adfd06837105914eaf9bc12";
const EXPECTED_RULES_TEST_HASH = "75b38b6c9864017c4d468021711cbb593cad51e86d457add9efa7115f840ae1a";

function sha256(relativePath) {
  return crypto.createHash("sha256")
    .update(fs.readFileSync(path.join(root, relativePath)))
    .digest("hex");
}

const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageData.version !== "0.24.0-dev.4") failures.push(`Expected package version 0.24.0-dev.4, found ${packageData.version}.`);
if (!packageData.scripts?.["check:v024:step2c"]) failures.push("Checkpoint 2C verification script is missing.");
for (const scriptName of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
  if (packageData.scripts?.[scriptName] !== "node scripts/block-development-deploy.mjs") failures.push(`${scriptName} must stay blocked during v0.24 development.`);
}
if (sha256("firestore.rules") !== EXPECTED_RULES_HASH) failures.push("firestore.rules does not match Checkpoint 2C.");
if (sha256("tests/firestore.rules.test.mjs") !== EXPECTED_RULES_TEST_HASH) failures.push("Firestore Rules tests do not match Checkpoint 2C.");

const leagues = fs.readFileSync(path.join(root, "src/constants/leagues.js"), "utf8");
if (!leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v3"')) failures.push("Runtime must remain v3 during Checkpoint 2C.");

const rules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");
for (const marker of [
  '!(resource.data.rulesVersion in ["season-houses-v3", "season-houses-v4"])',
  "validLeagueRulesetV3V4Full(resource.data.ruleset)",
  "validInitialPowerPlayState(resource.data.powerPlayState)",
]) {
  if (!rules.includes(marker)) failures.push(`Required Checkpoint 2C Rules marker missing: ${marker}`);
}
for (const marker of ["houseMovementPolicy", "leagueHouseAssignmentHistory", "leagueCompositionProfiles", "leagueHouseBalanceWeeks", "rosterLockThroughWeekKey"]) {
  if (rules.includes(marker)) failures.push(`Later-checkpoint Rules marker appeared too early: ${marker}`);
}

const rulesTests = fs.readFileSync(path.join(root, "tests/firestore.rules.test.mjs"), "utf8");
for (const marker of [
  "existing v3 draft-to-registration remains valid under the shared readiness check",
  "v4 draft-to-registration stays below Rules evaluation",
  "REGV4AAA",
  "BADV4AAA",
]) {
  if (!rulesTests.includes(marker)) failures.push(`Required Checkpoint 2C Rules-test marker missing: ${marker}`);
}

if (failures.length) {
  console.error("v0.24 checkpoint 2C verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 2C structure verified: the audited draft-to-registration path is covered for v3/v4; runtime remains v3 and no House-movement persistence or later v0.24 Rules were added.");
