import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED_RULES_HASH = "182abd59f4404faf8a13357b73335fae1def4c82b30f40f1f035d7a6da12ea72";
const EXPECTED_RULES_TEST_HASH = "aaea9d3983cfa0449cf84f7708fe783b72935a8d06173d74ea266124ff3feb32";

function normalizedSha256(relativePath) {
  const contents = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/\r\n/g, "\n");
  return crypto.createHash("sha256").update(contents, "utf8").digest("hex");
}

const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageData.version !== "0.24.0-dev.9") failures.push(`Expected package version 0.24.0-dev.9, found ${packageData.version}.`);
if (!packageData.scripts?.["check:v024:step2h"]) failures.push("Checkpoint 2H verification script is missing.");
for (const scriptName of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
  if (packageData.scripts?.[scriptName] !== "node scripts/block-development-deploy.mjs") failures.push(`${scriptName} must stay blocked during v0.24 development.`);
}
if (normalizedSha256("firestore.rules") !== EXPECTED_RULES_HASH) failures.push("firestore.rules changed during the zero-Rules-change Checkpoint 2H runtime switch.");
if (normalizedSha256("tests/firestore.rules.test.mjs") !== EXPECTED_RULES_TEST_HASH) failures.push("The 59-test Firestore Rules suite changed during Checkpoint 2H.");

const leagues = fs.readFileSync(path.join(root, "src/constants/leagues.js"), "utf8");
if (!leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v4"')) failures.push("Normal new-season creation is not switched to season-houses-v4.");
if (leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v3"')) failures.push("The runtime default still points at season-houses-v3.");

const movementTests = fs.readFileSync(path.join(root, "tests/house-movement-domain.test.mjs"), "utf8");
if (!movementTests.includes("normal new-season creation now emits the v4 House movement contract")) failures.push("The runtime v4 creation regression test is missing.");

const rules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");
for (const marker of ["houseMovementPolicy", "leagueHouseAssignmentHistory", "leagueCompositionProfiles", "leagueHouseBalanceWeeks", "rosterLockThroughWeekKey"]) {
  if (rules.includes(marker)) failures.push(`Later-checkpoint Rules marker appeared too early: ${marker}`);
}

const rulesTests = fs.readFileSync(path.join(root, "tests/firestore.rules.test.mjs"), "utf8");
for (const marker of [
  "v4 C.H.A.O.S. supports eight Houses and sixteen players in the real atomic batch",
  "v4 locked Platform Administrator Power Play correction stays below Rules evaluation",
  "v4 draft-to-registration stays below Rules evaluation",
]) {
  if (!rulesTests.includes(marker)) failures.push(`Required proven v4 Rules-test marker missing: ${marker}`);
}

if (failures.length) {
  console.error("v0.24 checkpoint 2H verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 2H structure verified: normal new-season creation now emits the proven lean season-houses-v4 contract; Firestore Rules and the full 59-test Rules suite are unchanged, production deploy remains blocked, and no House-movement persistence has been added.");
