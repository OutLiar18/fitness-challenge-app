import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED_RULES_HASH = "ac0312f8a9fdf1f47a284cc326b84a1be6ab330fb32d430980c28dc2381c8a5f";
const EXPECTED_RULES_TEST_HASH = "87731ccaff8977ac1506fc033295748ae9d8f8d1eee9e90013e61c48c095a036";

function normalizedSha256(relativePath) {
  const contents = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/\r\n/g, "\n");
  return crypto.createHash("sha256").update(contents, "utf8").digest("hex");
}

const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageData.version !== "0.24.0-dev.10") failures.push(`Expected package version 0.24.0-dev.10, found ${packageData.version}.`);
if (!packageData.scripts?.["check:v024:step3a"]) failures.push("Checkpoint 3A verification script is missing.");
for (const scriptName of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
  if (packageData.scripts?.[scriptName] !== "node scripts/block-development-deploy.mjs") failures.push(`${scriptName} must stay blocked during v0.24 development.`);
}

if (normalizedSha256("firestore.rules") !== EXPECTED_RULES_HASH) failures.push("firestore.rules is not the exact isolated Checkpoint 3A schema change.");
if (normalizedSha256("tests/firestore.rules.test.mjs") !== EXPECTED_RULES_TEST_HASH) failures.push("Firestore Rules tests are not the exact 60-test Checkpoint 3A suite.");

const leagues = fs.readFileSync(path.join(root, "src/constants/leagues.js"), "utf8");
if (!leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v4"')) failures.push("Runtime new-season creation must remain on season-houses-v4.");

const leagueService = fs.readFileSync(path.join(root, "src/services/leagues/leagueService.js"), "utf8");
for (const marker of ['rosterLockThroughWeekKey: ""', 'rosterEligibleWeekKey: ""']) {
  if (!leagueService.includes(marker)) failures.push(`New registration does not persist empty rest state: ${marker}`);
}

const seasonService = fs.readFileSync(path.join(root, "src/services/seasons/seasonService.js"), "utf8");
const swapStart = seasonService.indexOf("export async function swapHousePlayers");
const swapEnd = seasonService.indexOf("export async function storePocketActivity", swapStart);
const swapSection = swapStart >= 0 && swapEnd > swapStart ? seasonService.slice(swapStart, swapEnd) : "";
if (!swapSection) failures.push("Could not locate the existing weekly roster-swap service section.");
for (const marker of ["rosterLockThroughWeekKey", "rosterEligibleWeekKey"]) {
  if (swapSection.includes(marker)) failures.push(`Checkpoint 3A must not write ${marker} during weekly swaps yet.`);
}

const rules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");
for (const marker of ['"rosterLockThroughWeekKey", "rosterEligibleWeekKey"', 'get("rosterLockThroughWeekKey", "") == ""', 'get("rosterEligibleWeekKey", "") == ""']) {
  if (!rules.includes(marker)) failures.push(`Checkpoint 3A membership-create guard missing: ${marker}`);
}
const rosterSwapStart = rules.indexOf("function validMembershipRosterSwap()");
const rosterSwapEnd = rules.indexOf("function validHouseCreate()", rosterSwapStart);
const rosterSwapRules = rosterSwapStart >= 0 && rosterSwapEnd > rosterSwapStart ? rules.slice(rosterSwapStart, rosterSwapEnd) : "";
if (!rosterSwapRules) failures.push("Could not locate validMembershipRosterSwap in Firestore Rules.");
for (const marker of ["rosterLockThroughWeekKey", "rosterEligibleWeekKey"]) {
  if (rosterSwapRules.includes(marker)) failures.push(`Checkpoint 3A must not authorise roster-swap writes to ${marker} yet.`);
}
for (const marker of ["houseMovementPolicy", "leagueHouseAssignmentHistory", "leagueCompositionProfiles", "leagueHouseBalanceWeeks"]) {
  if (rules.includes(marker)) failures.push(`Later-checkpoint Rules marker appeared too early: ${marker}`);
}

const rulesTests = fs.readFileSync(path.join(root, "tests/firestore.rules.test.mjs"), "utf8");
for (const marker of [
  "v4 registration persists empty post-move rest state and rejects pre-seeded locks",
  "v4 C.H.A.O.S. supports eight Houses and sixteen players in the real atomic batch",
  "v4 locked Platform Administrator Power Play correction stays below Rules evaluation",
]) {
  if (!rulesTests.includes(marker)) failures.push(`Required Rules-test marker missing: ${marker}`);
}

if (failures.length) {
  console.error("v0.24 checkpoint 3A verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 3A structure verified: registrations can persist only empty House-movement rest state; legacy omitted fields remain compatible; weekly roster swaps still cannot write rest locks, and later v0.24 persistence remains absent.");
