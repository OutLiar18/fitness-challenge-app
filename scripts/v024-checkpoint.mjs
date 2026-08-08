import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED_RULES_HASH = "eef3827d76ea8858d87b1d0acc0b78f51fda85a682052d5da39a4c60bbec6526";
const EXPECTED_RULES_TEST_HASH = "8d9c4fe78b5ae1ec2f7a7ca8c864cc3c2b248c5f48824cd1d80aaee98da78711";
const EXPECTED_SEASON_SERVICE_HASH = "0a926179a54835762a5440dff4ef93f9955dd67a44a896f5f65123ca3687215d";
const EXPECTED_HOUSES_HASH = "6422f6718a1131589370b661da33a99cc3da67019c96c396184f3633d11fa31d";

function normalizedSha256(relativePath) {
  const contents = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/\r\n/g, "\n");
  return crypto.createHash("sha256").update(contents, "utf8").digest("hex");
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const packageData = JSON.parse(read("package.json"));
if (packageData.version !== "0.24.0-dev.14") failures.push(`Expected package version 0.24.0-dev.14, found ${packageData.version}.`);
if (!packageData.scripts?.["check:v024:step5"]) failures.push("Checkpoint 5 verification script is missing.");
for (const scriptName of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
  if (packageData.scripts?.[scriptName] !== "node scripts/block-development-deploy.mjs") failures.push(`${scriptName} must stay blocked during v0.24 development.`);
}

if (normalizedSha256("firestore.rules") !== EXPECTED_RULES_HASH) failures.push("firestore.rules is not the exact Checkpoint 5 movement-override Rules set.");
if (normalizedSha256("tests/firestore.rules.test.mjs") !== EXPECTED_RULES_TEST_HASH) failures.push("Firestore Rules tests are not the exact 65-test Checkpoint 5 suite.");
if (normalizedSha256("src/services/seasons/seasonService.js") !== EXPECTED_SEASON_SERVICE_HASH) failures.push("seasonService.js is not the exact Checkpoint 5 override implementation.");
if (normalizedSha256("src/pages/Houses.jsx") !== EXPECTED_HOUSES_HASH) failures.push("Houses.jsx is not the exact Checkpoint 5 administrator-correction UI.");

const leagues = read("src/constants/leagues.js");
if (!leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v4"')) failures.push("Runtime new-season creation must remain on season-houses-v4.");

const service = read("src/services/seasons/seasonService.js");
for (const marker of [
  "allowRestOverride = false",
  "overriddenPlayerIds",
  'action: overrideApplied ? "house.roster-rest-overridden" : "house.roster-swapped"',
  "A player who already moved this week cannot move again",
  "A Platform Administrator correction requires a factual reason",
  "overrideApplied: overriddenPlayerIds.includes(firstLive.userId)",
  "overrideApplied: overriddenPlayerIds.includes(secondLive.userId)",
]) {
  if (!service.includes(marker)) failures.push(`Checkpoint 5 service marker missing: ${marker}`);
}
for (const marker of ["leagueCompositionProfiles", "leagueHouseBalanceWeeks"]) {
  if (service.includes(marker)) failures.push(`Later v0.24 feature appeared too early in seasonService: ${marker}`);
}

const rules = read("firestore.rules");
for (const marker of [
  'let firstMovedThisWeek = firstBefore.get("lastRosterWeekKey", "") == request.resource.data.weekKey;',
  'let overrideApplied = request.resource.data.get("overrideApplied", false);',
  'let overriddenPlayerIds = request.resource.data.get("overriddenPlayerIds", []);',
  "return !firstMovedThisWeek",
  "&& !secondMovedThisWeek",
  "&& isPlatformAdmin()",
  "overrideReason.size() >= 12",
  "overrideReason.size() <= 500",
  'request.resource.data.get("overrideApplied", false) == true',
  'request.resource.data.get("overrideReason", "") == swap.get("overrideReason", "")',
]) {
  if (!rules.includes(marker)) failures.push(`Checkpoint 5 Rules marker missing: ${marker}`);
}
for (const marker of ["leagueCompositionProfiles", "leagueHouseBalanceWeeks"]) {
  if (rules.includes(marker)) failures.push(`Later v0.24 Rules marker appeared too early: ${marker}`);
}
const firstMovedCheckCount = (rules.match(/!firstMovedThisWeek/g) || []).length;
const secondMovedCheckCount = (rules.match(/!secondMovedThisWeek/g) || []).length;
if (firstMovedCheckCount !== 1 || secondMovedCheckCount !== 1) {
  failures.push("Same-week roster movement checks must exist exactly once inside the compiler-safe movement-policy helper.");
}

const houses = read("src/pages/Houses.jsx");
for (const marker of [
  "platformAdmin={isPlatformAdmin}",
  "Platform Administrator factual correction",
  "Post-move rest override required",
  "Complete audited correction",
  "Administrator correction · {record.overrideReason}",
]) {
  if (!houses.includes(marker)) failures.push(`Checkpoint 5 Houses UI marker missing: ${marker}`);
}

const rulesTests = read("tests/firestore.rules.test.mjs");
for (const marker of [
  "only a Platform Administrator can override an active post-move rest with a factual reason",
  "Platform Administrator rest override cannot bypass same-week movement, House locks or leadership protection",
  "season-v4-rest-override-house-leader",
  "season-v4-rest-override-season-admin",
  "season-v4-override-house-locked",
  "season-v4-override-leader",
]) {
  if (!rulesTests.includes(marker)) failures.push(`Required Checkpoint 5 Rules-test marker missing: ${marker}`);
}

const checkpointDoc = read("docs/01_CURRENT_DEVELOPMENT/V0240_CHECKPOINTS.md");
if (!checkpointDoc.includes("Status: implemented in `0.24.0-dev.14` as the complete movement-administration layer.")) failures.push("Checkpoint documentation is missing the completed Checkpoint 5 status.");

if (failures.length) {
  console.error("v0.24 checkpoint 5 verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 5 structure verified: only Platform Administrators can make an audited factual correction to the one-week post-move rest restriction; the immutable swap/history trail preserves the reason, while same-week movement, House locks and leadership remain non-bypassable. Composition and weekly balance remain absent.");
