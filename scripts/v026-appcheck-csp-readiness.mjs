import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function load(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing required file: ${rel}`);
  return fs.readFileSync(full, "utf8").replace(/\r\n/g, "\n");
}

function requireText(text, token, label) {
  if (!text.includes(token)) throw new Error(`Missing expected ${label}.`);
}

const firebaseBootstrap = load("src/firebase.js");
const firebaseConfig = JSON.parse(load("firebase.json"));
const envExample = load(".env.example");
const indexHtml = load("index.html");

for (const token of [
  'firebase/app-check',
  'initializeAppCheck',
  'ReCaptchaEnterpriseProvider',
  'FIREBASE_APPCHECK_DEBUG_TOKEN',
]) {
  if (firebaseBootstrap.includes(token)) {
    throw new Error(`26E readiness-only checkpoint must not integrate App Check yet: found ${token} in src/firebase.js.`);
  }
}

if (/APP[_-]?CHECK/i.test(envExample)) {
  throw new Error("26E readiness-only checkpoint must not add App Check environment configuration yet.");
}

const headers = firebaseConfig?.hosting?.headers ?? [];
const serializedHeaders = JSON.stringify(headers);
for (const header of [
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
]) {
  requireText(serializedHeaders, header, `Hosting header ${header}`);
}

if (/content-security-policy/i.test(serializedHeaders)) {
  throw new Error("26E readiness-only checkpoint must not add a CSP or CSP-Report-Only header yet.");
}

requireText(
  serializedHeaders,
  '"X-Frame-Options","value":"DENY"',
  "existing X-Frame-Options DENY protection",
);

const scriptTags = [...indexHtml.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
if (scriptTags.length !== 1) {
  throw new Error(`Expected exactly one application script tag in index.html, found ${scriptTags.length}.`);
}
const [, attrs, body] = scriptTags[0];
if (!/\bsrc\s*=\s*["']\/src\/main\.jsx["']/i.test(attrs)) {
  throw new Error("Expected the sole application script to be the external Vite module entry.");
}
if (body.trim()) {
  throw new Error("Inline script content exists in index.html; CSP readiness assumptions must be reviewed.");
}

requireText(
  firebaseBootstrap,
  'export const auth = getAuth(app);',
  "Firebase Authentication bootstrap",
);
requireText(
  firebaseBootstrap,
  'export const db = getFirestore(app);',
  "Cloud Firestore bootstrap",
);

console.log("Champions Legacy Challenge — v0.26 Checkpoint 26E readiness guard");
console.log("App Check SDK integration : ABSENT (intentional readiness-only state)");
console.log("App Check env configuration: ABSENT");
console.log("App Check debug token      : NOT PRESENT IN APP BOOTSTRAP");
console.log("Explicit Hosting CSP       : ABSENT (intentional readiness-only state)");
console.log("Existing security headers  : PRESENT");
console.log("index.html inline scripts  : NONE");
console.log("Firebase services in scope : Authentication + Cloud Firestore");
console.log("26E App Check/CSP readiness guard PASSED");
