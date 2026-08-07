import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED_RULES_HASH = "b5ff4236e71c526f916ac371497b8b8bd28fcb1d708011ba6f23d623213b935c";
const EXPECTED_RULES_TEST_HASH = "1aaa828110a887664d117f4c504a78ad39ebd5f5310499487861ebbaf59ac214";

function sha256(relativePath) {
  return crypto.createHash("sha256")
    .update(fs.readFileSync(path.join(root, relativePath)))
    .digest("hex");
}

const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageData.version !== "0.24.0-dev.3") failures.push(`Expected package version 0.24.0-dev.3, found ${packageData.version}.`);
if (!packageData.scripts?.["check:v024:step2b"]) failures.push("Checkpoint 2B verification script is missing.");
for (const scriptName of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
  if (packageData.scripts?.[scriptName] !== "node scripts/block-development-deploy.mjs") failures.push(`${scriptName} must stay blocked during v0.24 development.`);
}
if (sha256("firestore.rules") !== EXPECTED_RULES_HASH) failures.push("firestore.rules does not match Checkpoint 2B.");
if (sha256("tests/firestore.rules.test.mjs") !== EXPECTED_RULES_TEST_HASH) failures.push("Firestore Rules tests do not match Checkpoint 2B.");

const leagues = fs.readFileSync(path.join(root, "src/constants/leagues.js"), "utf8");
if (!leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v3"')) failures.push("Runtime must remain v3 during Checkpoint 2B.");

const rules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");
for (const marker of [
  "function validLeagueRulesetV3V4Full(ruleset)",
  'resource.data.rulesVersion in ["season-houses-v3", "season-houses-v4"]',
  "request.resource.data.ruleset.version == resource.data.rulesVersion",
  "validLeagueRulesetV3V4Full(request.resource.data.ruleset)",
]) { if (!rules.includes(marker)) failures.push(`Required Checkpoint 2B Rules marker missing: ${marker}`); }
for (const marker of ["houseMovementPolicy", "leagueHouseAssignmentHistory", "leagueCompositionProfiles", "leagueHouseBalanceWeeks", "rosterLockThroughWeekKey"]) {
  if (rules.includes(marker)) failures.push(`Later-checkpoint Rules marker appeared too early: ${marker}`);
}

const rulesTests = fs.readFileSync(path.join(root, "tests/firestore.rules.test.mjs"), "utf8");
if (!rulesTests.includes("v4 draft Power Play pool maintenance stays below Rules evaluation")) failures.push("The v4 Power Play pool positive-path test is missing.");
if (!rulesTests.includes("power-season-v4")) failures.push("The v4 Power Play pool test fixture is missing.");

if (failures.length) {
  console.error("v0.24 checkpoint 2B verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 2B structure verified: v4 draft Power Play pool maintenance is isolated; runtime remains v3 and no movement persistence/lifecycle expansion was added.");
