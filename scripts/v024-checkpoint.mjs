import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED_RULES_HASH = "260fc21d98dc39412c814eff97719621a01bbe691d4c8bf7d016280698b1efb4";
const EXPECTED_RULES_TEST_HASH = "7af40d7560f5dc207ffe755bf7236a21ea8c8aff832463de456f4d42dcb1d079";

function sha256(relativePath) {
  return crypto.createHash("sha256")
    .update(fs.readFileSync(path.join(root, relativePath)))
    .digest("hex");
}

const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageData.version !== "0.24.0-dev.1") failures.push(`Expected package version 0.24.0-dev.1, found ${packageData.version}.`);
if (!packageData.scripts?.test?.includes("tests/house-movement-domain.test.mjs")) failures.push("House movement domain tests are not part of npm test.");
if (sha256("firestore.rules") !== EXPECTED_RULES_HASH) failures.push("firestore.rules changed during the no-Rules checkpoint.");
if (sha256("tests/firestore.rules.test.mjs") !== EXPECTED_RULES_TEST_HASH) failures.push("Firestore Rules tests changed during the no-Rules checkpoint.");

const leagues = fs.readFileSync(path.join(root, "src/constants/leagues.js"), "utf8");
if (!leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v3"')) failures.push("Default season ruleset changed before the Rules checkpoint.");
if (leagues.includes("houseMovementPolicy")) failures.push("House movement policy was wired into the default ruleset too early.");

const rules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");
for (const marker of ["leagueHouseAssignmentHistory", "leagueCompositionProfiles", "leagueHouseBalanceWeeks", "leagueHouseBalancePrivateWeeks"]) {
  if (rules.includes(marker)) failures.push(`Deferred Rules marker appeared too early: ${marker}`);
}

if (failures.length) {
  console.error("v0.24 checkpoint 1 verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 1 verified: House-movement domain foundation added with the exact v0.23.5 Firestore Rules baseline unchanged.");
