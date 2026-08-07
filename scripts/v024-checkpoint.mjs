import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED_RULES_HASH = "1459cd42a872501ffe6a61a7c10ee347a9203011e40c66278703379b238088b1";
const EXPECTED_RULES_TEST_HASH = "2072fc7eaa022c2d6344efa7110152993c5e57303d6d930cd14d366773743fa2";

function normalizedSha256(relativePath) {
  const contents = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/\r\n/g, "\n");
  return crypto.createHash("sha256").update(contents, "utf8").digest("hex");
}

const packageData = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (packageData.version !== "0.24.0-dev.11") failures.push(`Expected package version 0.24.0-dev.11, found ${packageData.version}.`);
if (!packageData.scripts?.["check:v024:step3b"]) failures.push("Checkpoint 3B verification script is missing.");
for (const scriptName of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
  if (packageData.scripts?.[scriptName] !== "node scripts/block-development-deploy.mjs") failures.push(`${scriptName} must stay blocked during v0.24 development.`);
}

if (normalizedSha256("firestore.rules") !== EXPECTED_RULES_HASH) failures.push("firestore.rules is not the exact isolated Checkpoint 3B rest-lock write change.");
if (normalizedSha256("tests/firestore.rules.test.mjs") !== EXPECTED_RULES_TEST_HASH) failures.push("Firestore Rules tests are not the exact 61-test Checkpoint 3B suite.");

const leagues = fs.readFileSync(path.join(root, "src/constants/leagues.js"), "utf8");
if (!leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v4"')) failures.push("Runtime new-season creation must remain on season-houses-v4.");

const leagueService = fs.readFileSync(path.join(root, "src/services/leagues/leagueService.js"), "utf8");
for (const marker of ['rosterLockThroughWeekKey: ""', 'rosterEligibleWeekKey: ""']) {
  if (!leagueService.includes(marker)) failures.push(`Registration rest-state schema regressed: ${marker}`);
}

const seasonService = fs.readFileSync(path.join(root, "src/services/seasons/seasonService.js"), "utf8");
const swapStart = seasonService.indexOf("export async function swapHousePlayers");
const swapEnd = seasonService.indexOf("export async function storePocketActivity", swapStart);
const swapSection = swapStart >= 0 && swapEnd > swapStart ? seasonService.slice(swapStart, swapEnd) : "";
if (!swapSection) failures.push("Could not locate the weekly roster-swap service section.");
for (const marker of [
  "supportsHouseMovementV1(league)",
  "getRosterRestWindow(weekKey)",
  "rulesVersion: league.rulesVersion",
  "lockThroughWeekKey: restWindow.lockThroughWeekKey",
  "eligibleWeekKey: restWindow.eligibleWeekKey",
  "rosterLockThroughWeekKey: restWindow.lockThroughWeekKey",
  "rosterEligibleWeekKey: restWindow.eligibleWeekKey",
]) {
  if (!swapSection.includes(marker)) failures.push(`Checkpoint 3B service marker missing: ${marker}`);
}
for (const marker of ["leagueHouseAssignmentHistory", "overrideApplied", "overrideReason"]) {
  if (swapSection.includes(marker)) failures.push(`Later House-movement feature appeared too early in the swap service: ${marker}`);
}

const rules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");
const rosterMembershipStart = rules.indexOf("function validMembershipRosterSwap()");
const rosterMembershipEnd = rules.indexOf("function validHouseCreate()", rosterMembershipStart);
const rosterMembershipRules = rosterMembershipStart >= 0 && rosterMembershipEnd > rosterMembershipStart ? rules.slice(rosterMembershipStart, rosterMembershipEnd) : "";
for (const marker of [
  'let v4 = league.rulesVersion == "season-houses-v4"',
  '"rosterLockThroughWeekKey"',
  '"rosterEligibleWeekKey"',
  'request.resource.data.rosterLockThroughWeekKey == swap.lockThroughWeekKey',
  'request.resource.data.rosterEligibleWeekKey == swap.eligibleWeekKey',
]) {
  if (!rosterMembershipRules.includes(marker)) failures.push(`Checkpoint 3B membership-swap Rules marker missing: ${marker}`);
}
const rosterSwapStart = rules.indexOf("function validRosterSwapCreate(swapId)");
const rosterSwapEnd = rules.indexOf("function validRosterLockCreate(lockId)", rosterSwapStart);
const rosterSwapRules = rosterSwapStart >= 0 && rosterSwapEnd > rosterSwapStart ? rules.slice(rosterSwapStart, rosterSwapEnd) : "";
for (const marker of [
  '"rulesVersion"',
  '"lockThroughWeekKey"',
  '"eligibleWeekKey"',
  'request.resource.data.rulesVersion == "season-houses-v4"',
  'firstAfter.rosterLockThroughWeekKey == request.resource.data.lockThroughWeekKey',
  'secondAfter.rosterEligibleWeekKey == request.resource.data.eligibleWeekKey',
]) {
  if (!rosterSwapRules.includes(marker)) failures.push(`Checkpoint 3B roster-swap Rules marker missing: ${marker}`);
}
for (const marker of ["leagueHouseAssignmentHistory", "leagueCompositionProfiles", "leagueHouseBalanceWeeks"]) {
  if (rules.includes(marker)) failures.push(`Later-checkpoint Rules marker appeared too early: ${marker}`);
}
if (rosterSwapRules.includes("firstRestActive") || rosterSwapRules.includes("secondRestActive")) {
  failures.push("Checkpoint 3B must not enforce a previous rest window yet; that belongs to Checkpoint 3C.");
}

const rulesTests = fs.readFileSync(path.join(root, "tests/firestore.rules.test.mjs"), "utf8");
for (const marker of [
  "v4 roster swaps persist the one-week rest window and reject membership values that disagree with the swap",
  "v4 registration persists empty post-move rest state and rejects pre-seeded locks",
  "v4 C.H.A.O.S. supports eight Houses and sixteen players in the real atomic batch",
]) {
  if (!rulesTests.includes(marker)) failures.push(`Required Rules-test marker missing: ${marker}`);
}

if (failures.length) {
  console.error("v0.24 checkpoint 3B verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 3B structure verified: v4 weekly roster swaps persist a rest window that must match the same atomic swap document; v3 compatibility remains, previous-rest enforcement and later House-movement persistence are still deferred.");
