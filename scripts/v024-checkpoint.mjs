import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED_RULES_HASH = "eade1af392a2ab38c9b070798e5abb73ec3bbee65a16689512022dfa92c74936";
const EXPECTED_RULES_TEST_HASH = "698828ea14d68af48b9dabb736ecb8506b341d099cb06c8f53790cbd7ea32554";

function sha256(relativePath) {
  return crypto.createHash("sha256")
    .update(fs.readFileSync(path.join(root, relativePath)))
    .digest("hex");
}

const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageData.version !== "0.24.0-dev.2") {
  failures.push(`Expected package version 0.24.0-dev.2, found ${packageData.version}.`);
}
if (!packageData.scripts?.test?.includes("tests/house-movement-domain.test.mjs")) {
  failures.push("House movement domain tests are not part of npm test.");
}
if (!packageData.scripts?.["check:v024:step2a"]) {
  failures.push("Checkpoint 2A verification script is missing.");
}
for (const scriptName of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
  if (packageData.scripts?.[scriptName] !== "node scripts/block-development-deploy.mjs") {
    failures.push(`${scriptName} must stay blocked during v0.24 development.`);
  }
}
if (sha256("firestore.rules") !== EXPECTED_RULES_HASH) {
  failures.push("firestore.rules does not match the lean checkpoint 2A Rules payload.");
}
if (sha256("tests/firestore.rules.test.mjs") !== EXPECTED_RULES_TEST_HASH) {
  failures.push("Firestore Rules tests do not match the lean checkpoint 2A regression suite.");
}

const leagues = fs.readFileSync(path.join(root, "src/constants/leagues.js"), "utf8");
if (!leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v3"')) {
  failures.push("The application default must remain v3 during the lean Rules probe.");
}
if (leagues.includes("houseMovementPolicy")) {
  failures.push("A redundant nested House movement policy was reintroduced into the League ruleset.");
}

const model = fs.readFileSync(path.join(root, "src/services/seasons/houseMovementModel.js"), "utf8");
if (!model.includes('league?.rulesVersion === "season-houses-v4"')) {
  failures.push("House Movement v1 is not keyed to the lean v4 season contract.");
}
if (model.includes("league?.ruleset?.houseMovementPolicy")) {
  failures.push("House Movement still depends on the rejected nested policy architecture.");
}

const rules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");
for (const marker of [
  'function validLeagueRulesetV3V4DraftCreate(ruleset)',
  'ruleset.version in ["season-houses-v3", "season-houses-v4"]',
  'request.resource.data.rulesVersion == request.resource.data.ruleset.version',
]) {
  if (!rules.includes(marker)) failures.push(`Required lean v4 Rules marker is missing: ${marker}`);
}
for (const marker of [
  "validDraftHouseMovementPolicyV1",
  "houseMovementPolicy",
  "leagueHouseAssignmentHistory",
  "leagueCompositionProfiles",
  "leagueHouseBalanceWeeks",
  "leagueHouseBalancePrivateWeeks",
  "rosterLockThroughWeekKey",
  "rosterEligibleWeekKey",
]) {
  if (rules.includes(marker)) failures.push(`A rejected or later-checkpoint Rules marker appeared too early: ${marker}`);
}

const rulesTests = fs.readFileSync(path.join(root, "tests/firestore.rules.test.mjs"), "utf8");
if (!rulesTests.includes("v4 draft creation stays below Rules evaluation when the version itself freezes House Movement")) {
  failures.push("The legitimate lean v4 draft positive-path Rules regression test is missing.");
}
if (!rulesTests.includes("houseCount: 8")) {
  failures.push("The lean v4 positive-path test is not exercising the maximum supported House-count field.");
}

if (failures.length) {
  console.error("v0.24 checkpoint 2A lean verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 2A lean structure verified: v4 is a version-only House Movement contract; no nested movement policy, persistence, history, override, composition or weekly-balance Rules were added.");
