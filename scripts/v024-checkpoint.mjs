import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED_RULES_HASH = "3ee5ec3b41eda7055907b206aa5308be88ce55ee4bc09ea5f75c73c50ca124f5";
const EXPECTED_RULES_TEST_HASH = "8da2070e77fb5b9e057509720e7f341ff715f46c3972f4b70e82a67085b50f12";
const EXPECTED_SEASON_SERVICE_HASH = "f82ecce3dcb8e85281aec3f44022f09b6d9b7e854cd3c9eb2e166952bfa786a5";

function normalizedSha256(relativePath) {
  const contents = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/\r\n/g, "\n");
  return crypto.createHash("sha256").update(contents, "utf8").digest("hex");
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const packageData = JSON.parse(read("package.json"));
if (packageData.version !== "0.24.0-dev.13") failures.push(`Expected package version 0.24.0-dev.13, found ${packageData.version}.`);
if (!packageData.scripts?.["check:v024:step4"]) failures.push("Checkpoint 4 verification script is missing.");
for (const scriptName of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
  if (packageData.scripts?.[scriptName] !== "node scripts/block-development-deploy.mjs") failures.push(`${scriptName} must stay blocked during v0.24 development.`);
}

if (normalizedSha256("firestore.rules") !== EXPECTED_RULES_HASH) failures.push("firestore.rules is not the exact Checkpoint 4 assignment-history Rules set.");
if (normalizedSha256("tests/firestore.rules.test.mjs") !== EXPECTED_RULES_TEST_HASH) failures.push("Firestore Rules tests are not the exact 63-test Checkpoint 4 suite.");
if (normalizedSha256("src/services/seasons/seasonService.js") !== EXPECTED_SEASON_SERVICE_HASH) failures.push("seasonService.js is not the exact Checkpoint 4 history-write implementation.");

const leagues = read("src/constants/leagues.js");
if (!leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v4"')) failures.push("Runtime new-season creation must remain on season-houses-v4.");

const seasonModel = read("src/services/seasons/seasonModel.js");
if (!seasonModel.includes('displayName: member.displayName || "Champion"')) failures.push("C.H.A.O.S. assignments must carry display names for immutable history.");

const seasonService = read("src/services/seasons/seasonService.js");
for (const marker of [
  'doc(db, "leagueHouseAssignmentHistory", historyId)',
  'method: "chaos"',
  'createHouseAssignmentHistoryId(swapId, firstLive.userId)',
  'method: "weekly-swap"',
  'fromHouseId: firstHouse.id',
  'toHouseId: secondHouse.id',
]) {
  if (!seasonService.includes(marker)) failures.push(`Checkpoint 4 history-write marker missing: ${marker}`);
}
for (const marker of ["overrideApplied", "overrideReason", "leagueCompositionProfiles", "leagueHouseBalanceWeeks"]) {
  if (seasonService.includes(marker)) failures.push(`Later v0.24 feature appeared too early in seasonService: ${marker}`);
}

const historyService = read("src/services/seasons/houseMovementService.js");
for (const marker of [
  "subscribeToHouseAssignmentHistory",
  'collection(db, "leagueHouseAssignmentHistory")',
  'where("leagueId", "==", leagueId)',
]) {
  if (!historyService.includes(marker)) failures.push(`Assignment-history subscription marker missing: ${marker}`);
}

const housesPage = read("src/pages/Houses.jsx");
for (const marker of [
  "AssignmentHistoryPanel",
  'id: "history"',
  "subscribeToHouseAssignmentHistory",
  "Immutable roster history",
]) {
  if (!housesPage.includes(marker)) failures.push(`Houses assignment-history UI marker missing: ${marker}`);
}

const deletionModel = read("src/services/account/trustedDeletionModel.js");
const deletionScript = read("scripts/trusted-account-delete.mjs");
if (!deletionModel.includes('"leagueHouseAssignmentHistory"')) failures.push("Trusted account deletion model must include assignment history anonymisation.");
if (!deletionScript.includes('["leagueHouseAssignmentHistory", "userId", "anonymise"]')) failures.push("Trusted account deletion command must query assignment history by userId.");
if (!deletionScript.includes('item.collectionName === "leagueHouseAssignmentHistory"')) failures.push("Trusted account deletion command must anonymise assignment history identity fields.");

const rules = read("firestore.rules");
for (const marker of [
  "function validHouseAssignmentHistoryBase(historyId)",
  "function validChaosAssignmentHistory(historyId)",
  "function validSwapAssignmentHistory(historyId)",
  "function validHouseAssignmentHistoryCreate(historyId)",
  "match /leagueHouseAssignmentHistory/{historyId}",
  "allow update, delete: if false;",
  'existsAfter(/databases/$(database)/documents/leagueHouseAssignmentHistory/$(swapId + "_" + request.resource.data.firstPlayerId))',
  'existsAfter(/databases/$(database)/documents/leagueHouseAssignmentHistory/$(swapId + "_" + request.resource.data.secondPlayerId))',
]) {
  if (!rules.includes(marker)) failures.push(`Checkpoint 4 Rules marker missing: ${marker}`);
}
for (const marker of ["overrideApplied", "overrideReason", "leagueCompositionProfiles", "leagueHouseBalanceWeeks"]) {
  if (rules.includes(marker)) failures.push(`Later v0.24 Rules marker appeared too early: ${marker}`);
}

const rulesTests = read("tests/firestore.rules.test.mjs");
for (const marker of [
  "v4 C.H.A.O.S. supports eight Houses and sixteen players in the real atomic batch",
  "v4 roster swaps require readable immutable assignment history for both players",
  "v4 roster swaps enforce the persisted rest week and reopen eligibility afterward",
  'includeHistory: false',
  'collection(playerContext("player-one").firestore(), "leagueHouseAssignmentHistory")',
]) {
  if (!rulesTests.includes(marker)) failures.push(`Required Checkpoint 4 Rules-test marker missing: ${marker}`);
}

const architecture = read("docs/03_ARCHITECTURE/FIRESTORE_STRUCTURE.md");
if (!architecture.includes("leagueHouseAssignmentHistory")) failures.push("Firestore architecture documentation must describe assignment history.");

if (failures.length) {
  console.error("v0.24 checkpoint 4 verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 4 structure verified: v4 C.H.A.O.S. and weekly swaps append immutable House assignment history; members/admins can read the season timeline, weekly swaps require both records atomically, trusted deletion anonymises identity, and override/composition/weekly-balance systems remain absent.");
