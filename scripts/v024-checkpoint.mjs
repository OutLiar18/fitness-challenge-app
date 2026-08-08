import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const EXPECTED_RULES_HASH = "0a9632756c3ad25a660977df9adb29dc83702554d580ef3008655300d2cc39d5";
const EXPECTED_RULES_TEST_HASH = "515c05992292fdea6383428d30f62987a9d80a4bbe139734de6a349e0746ba4a";
const EXPECTED_HOUSES_HASH = "d7c80398be4bada24d00316fe94c27b0333902c8f23c382162f7133f9d41b9af";
const EXPECTED_MOVEMENT_SERVICE_HASH = "668c7ed7f1956685734f4d3ab5bdba7ca83ff01e8ab63588b4167bc86b567e1c";
const EXPECTED_MOVEMENT_MODEL_HASH = "f6cb7697bd17072e4c9a7527408ad28f6fa2e6eb2a3ef72eaa080707eae0f663";
const EXPECTED_SEASON_CONSTANTS_HASH = "ee0d33acd055ac9910aac8c10097a7c9e37346b6d9551bf89a6cb691cdafa5f0";
const EXPECTED_DELETION_MODEL_HASH = "1e9e1aec054352fed079cd54b6c6f9fa520c56dd3b305eadd5a045491b03961c";
const EXPECTED_DELETION_SCRIPT_HASH = "f944ca1ecd1ceaf3daa05f0cd44387bc15844e4cec8a5555cc9dddcdd298f83d";

function normalizedSha256(relativePath) {
  const contents = fs.readFileSync(path.join(root, relativePath), "utf8").replace(/\r\n/g, "\n");
  return crypto.createHash("sha256").update(contents, "utf8").digest("hex");
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const packageData = JSON.parse(read("package.json"));
if (packageData.version !== "0.24.0-dev.15") failures.push(`Expected package version 0.24.0-dev.15, found ${packageData.version}.`);
if (!packageData.scripts?.["check:v024:step6"]) failures.push("Checkpoint 6 verification script is missing.");
for (const scriptName of ["deploy:rules", "deploy:hosting", "deploy:production"]) {
  if (packageData.scripts?.[scriptName] !== "node scripts/block-development-deploy.mjs") failures.push(`${scriptName} must stay blocked during v0.24 development.`);
}

const exactFiles = [
  ["firestore.rules", EXPECTED_RULES_HASH, "Checkpoint 6 composition/privacy Rules"],
  ["tests/firestore.rules.test.mjs", EXPECTED_RULES_TEST_HASH, "67-test Checkpoint 6 Rules suite"],
  ["src/pages/Houses.jsx", EXPECTED_HOUSES_HASH, "Checkpoint 6 Balance workspace"],
  ["src/services/seasons/houseMovementService.js", EXPECTED_MOVEMENT_SERVICE_HASH, "Checkpoint 6 composition service"],
  ["src/services/seasons/houseMovementModel.js", EXPECTED_MOVEMENT_MODEL_HASH, "Checkpoint 6 composition model"],
  ["src/constants/seasons.js", EXPECTED_SEASON_CONSTANTS_HASH, "Checkpoint 6 composition constants"],
  ["src/services/account/trustedDeletionModel.js", EXPECTED_DELETION_MODEL_HASH, "Checkpoint 6 deletion model"],
  ["scripts/trusted-account-delete.mjs", EXPECTED_DELETION_SCRIPT_HASH, "Checkpoint 6 trusted deletion processor"],
];
for (const [file, expected, label] of exactFiles) {
  if (normalizedSha256(file) !== expected) failures.push(`${file} is not the exact ${label}.`);
}

const leagues = read("src/constants/leagues.js");
if (!leagues.includes('LEAGUE_RULESET_VERSION = "season-houses-v4"')) failures.push("Runtime new-season creation must remain on season-houses-v4.");

const constants = read("src/constants/seasons.js");
for (const marker of [
  'HOUSE_COMPOSITION_PROFILE_VERSION = "season-composition-v1"',
  "HOUSE_COMPOSITION_DISCLOSURE_MINIMUM = 3",
  '{ id: "prefer-not-to-say", label: "Prefer not to say" }',
]) {
  if (!constants.includes(marker)) failures.push(`Checkpoint 6 constant marker missing: ${marker}`);
}
for (const marker of ["HOUSE_BALANCE_CALCULATION_VERSION", "weeklyHouseBalance", "compositionPrivacy"]) {
  if (constants.includes(marker)) failures.push(`Weekly-balance ruleset expansion appeared too early: ${marker}`);
}

const model = read("src/services/seasons/houseMovementModel.js");
for (const marker of ["normalizeCompositionValue", "createCompositionProfile", "HOUSE_COMPOSITION_PROFILE_VERSION"]) {
  if (!model.includes(marker)) failures.push(`Checkpoint 6 composition model marker missing: ${marker}`);
}
if (model.includes("buildHouseBalanceCalculation")) failures.push("Weekly House-balance calculation appeared during the composition-only checkpoint.");

const service = read("src/services/seasons/houseMovementService.js");
for (const marker of [
  "subscribeToCompositionProfile",
  "subscribeToLeagueCompositionProfiles",
  "saveCompositionProfile",
  "clearCompositionProfile",
  'doc(db, "leagueCompositionProfiles", `${league.id}_${userId}`)',
]) {
  if (!service.includes(marker)) failures.push(`Checkpoint 6 composition service marker missing: ${marker}`);
}
for (const marker of ["leagueHouseBalanceWeeks", "leagueHouseBalancePrivateWeeks", "calculateWeeklyHouseBalance"]) {
  if (service.includes(marker)) failures.push(`Weekly-balance persistence appeared too early in composition service: ${marker}`);
}

const rules = read("firestore.rules");
for (const marker of [
  "function validCompositionProfileCreate(profileId)",
  "function validCompositionProfileUpdate(profileId)",
  'request.resource.data.profileVersion == "season-composition-v1"',
  'get(/databases/$(database)/documents/leagues/$(request.resource.data.leagueId)).data.rulesVersion == "season-houses-v4"',
  "match /leagueCompositionProfiles/{profileId}",
  "resource.data.userId == request.auth.uid || isLeagueAdministrator(resource.data.leagueId)",
  "allow list: if signedIn() && isLeagueAdministrator(resource.data.leagueId);",
  "allow delete: if signedIn() && resource.data.userId == request.auth.uid;",
]) {
  if (!rules.includes(marker)) failures.push(`Checkpoint 6 Rules marker missing: ${marker}`);
}
for (const marker of ["leagueHouseBalanceWeeks", "leagueHouseBalancePrivateWeeks", "validPublicHouseBalanceCreate", "validPrivateHouseBalanceCreate"]) {
  if (rules.includes(marker)) failures.push(`Weekly-balance Rules appeared too early: ${marker}`);
}

const houses = read("src/pages/Houses.jsx");
for (const marker of [
  "Optional composition response",
  "Save private response",
  "Remove my response",
  "Administrator privacy view",
  "Response coverage",
  'id: "balance"',
]) {
  if (!houses.includes(marker)) failures.push(`Checkpoint 6 Houses UI marker missing: ${marker}`);
}
if (houses.includes('useEffect(() => {\n    setValue(profile?.value || "");')) failures.push("Composition response UI must not synchronously mirror profile state inside an effect.");
if (!houses.includes('key={`${league.id}:${compositionProfile?.value || "unset"}`}')) failures.push("Composition response UI must remount from the saved profile value instead of synchronising state in an effect.");
if (!houses.includes('const membershipUserId = membership?.userId || "";')) failures.push("Composition subscription must use a stable membershipUserId dependency.");
if (!houses.includes('[league?.id, movementV1, membershipUserId, manager, user?.uid, showToast]')) failures.push("Composition subscription dependency list must include membershipUserId explicitly.");

const deletionModel = read("src/services/account/trustedDeletionModel.js");
const deletionScript = read("scripts/trusted-account-delete.mjs");
if (!deletionModel.includes('"leagueCompositionProfiles"')) failures.push("Trusted deletion model must classify composition profiles as private data.");
if (!deletionScript.includes('["leagueCompositionProfiles", "userId", "delete"]')) failures.push("Trusted deletion processor must delete composition profiles rather than anonymise them.");

const rulesTests = read("tests/firestore.rules.test.mjs");
for (const marker of [
  "season composition responses stay private to the owner and authorised administrators",
  "composition responses cannot be forged outside the v4 season membership contract",
  "season-v4-composition-private",
  "season-v3-composition-blocked",
]) {
  if (!rulesTests.includes(marker)) failures.push(`Required Checkpoint 6 Rules-test marker missing: ${marker}`);
}
const rulesTestCount = (rulesTests.match(/^test\(/gm) || []).length;
if (rulesTestCount !== 67) failures.push(`Expected exactly 67 Firestore Rules tests, found ${rulesTestCount}.`);

const checkpointDoc = read("docs/01_CURRENT_DEVELOPMENT/V0240_CHECKPOINTS.md");
if (!checkpointDoc.includes("Status: implemented in `0.24.0-dev.15` as the private composition-data foundation.")) failures.push("Checkpoint documentation is missing the completed Checkpoint 6 status.");

if (failures.length) {
  console.error("v0.24 checkpoint 6 verification failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log("v0.24 checkpoint 6 structure verified: optional season composition responses are self-declared, owner-controlled and private from other players/House leaders; authorised administrators can read exact season data for operations, trusted deletion removes it, and no weekly House-balance snapshot or scoring behaviour exists yet.");
