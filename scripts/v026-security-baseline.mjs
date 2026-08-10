import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function load(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing required file: ${rel}`);
  return fs.readFileSync(full, "utf8");
}
function requireText(text, token, label) {
  if (!text.includes(token)) throw new Error(`26A baseline missing expected ${label}.`);
}

const pkg = JSON.parse(load("package.json"));
const rules = load("firestore.rules");
const firebase = JSON.parse(load("firebase.json"));
const firebaseBootstrap = load("src/firebase.js");
const accountDelete = load("scripts/trusted-account-delete.mjs");

if (pkg.version !== "0.26.0") {
  throw new Error(`Expected package version 0.26.0, found ${pkg.version}.`);
}

requireText(rules, 'request.auth.token.get("admin", false) == true', "Platform Admin Auth claim source");
requireText(rules, '.data.role == "admin"', "Platform Admin Firestore profile source");
requireText(rules, '.data.role == "leagueAdmin"', "League Admin profile source");
requireText(rules, 'match /users/{userId}', "user profile match");
requireText(rules, 'allow read: if isOwner(userId) || isPlatformAdmin();', "private user-profile read boundary");
requireText(rules, 'match /auditEvents/{auditId}', "audit collection");
requireText(rules, 'allow update, delete: if false;', "immutable client records");
requireText(rules, 'match /{document=**}', "recursive fallback");
requireText(rules, 'allow read, write: if false;', "deny-all fallback");

if (firebaseBootstrap.includes("initializeAppCheck") || firebaseBootstrap.includes("firebase/app-check")) {
  throw new Error("26A expected App Check to be absent at baseline; integration has already changed.");
}

requireText(accountDelete, "ACCOUNT_DELETION_WAITING_DAYS", "account deletion waiting-period model");
requireText(accountDelete, "credential: applicationDefault()", "Admin SDK application-default credentials");
requireText(accountDelete, "await auth.revokeRefreshTokens", "Auth token revocation");
requireText(accountDelete, "await auth.deleteUser", "trusted Authentication deletion");
requireText(accountDelete, "status: \"failed\"", "trusted deletion failure-state recording");

const headers = firebase?.hosting?.headers ?? [];
const serializedHeaders = JSON.stringify(headers);
for (const header of ["X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"]) {
  if (!serializedHeaders.includes(header)) {
    throw new Error(`Expected Hosting security header missing: ${header}`);
  }
}

const hasCsp = serializedHeaders.toLowerCase().includes("content-security-policy");
const ruleLines = rules.replace(/\r\n/g, "\n").split("\n").length;
const accessCalls = {
  get: (rules.match(/\bget\s*\(/g) ?? []).length,
  exists: (rules.match(/\bexists\s*\(/g) ?? []).length,
  getAfter: (rules.match(/\bgetAfter\s*\(/g) ?? []).length,
  existsAfter: (rules.match(/\bexistsAfter\s*\(/g) ?? []).length,
};

console.log("Champions Legacy Challenge — v0.26 Checkpoint 26A static baseline");
console.log(`Package version          : ${pkg.version}`);
console.log(`Firestore Rules lines    : ${ruleLines}`);
console.log(`Rules get() occurrences  : ${accessCalls.get}`);
console.log(`Rules exists() occurrences: ${accessCalls.exists}`);
console.log(`Rules getAfter()          : ${accessCalls.getAfter}`);
console.log(`Rules existsAfter()       : ${accessCalls.existsAfter}`);
console.log("Platform Admin sources   : Auth custom claim OR Firestore role profile");
console.log("League Admin profile     : present");
console.log("Final deny-all fallback  : present");
console.log("App Check integration    : absent (baseline finding)");
console.log(`Explicit Hosting CSP     : ${hasCsp ? "present" : "absent (baseline finding)"}`);
console.log("Trusted deletion recovery: failure state present; multi-phase review required");
console.log("Static 26A baseline PASSED");
