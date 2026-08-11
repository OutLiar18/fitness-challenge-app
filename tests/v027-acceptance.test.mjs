import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const vite = read("vite.config.js");
const packageJson = JSON.parse(read("package.json"));
const acceptance = read("scripts/v027-acceptance.mjs");
const shell = read("src/components/layout/AppShell.jsx");
const integrity = read("src/components/admin/EntryIntegrityWorkspace.jsx");
const library = read("src/components/admin/LibraryPublisher.jsx");
const powerPlay = read("src/components/seasons/PowerPlayWorkspace.jsx");
const state = read("docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md");

test("Firebase vendor grouping uses a size target instead of one forced monolith", () => {
  assert.match(vite, /name: "firebase-vendor"/);
  assert.match(vite, /maxSize:\s*360 \* 1024/);
  assert.match(vite, /test: \/node_modules/);
});

test("the normal application check now includes the v0.27 automated acceptance gate", () => {
  assert.equal(packageJson.scripts["accept:v027"], "node scripts/v027-acceptance.mjs --verify");
  assert.match(packageJson.scripts.check, /npm run build && npm run accept:v027$/);
});

test("27G acceptance verifies performance, responsiveness, interaction and contrast foundations", () => {
  assert.match(acceptance, /Largest JavaScript chunk/);
  assert.match(acceptance, /Firebase vendor group was not partitioned/);
  assert.match(acceptance, /min-width:\\s\*320px/);
  assert.match(acceptance, /prefers-reduced-motion/);
  assert.match(acceptance, /role="alertdialog"/);
  assert.match(acceptance, /role="tablist"/);
  assert.ok(acceptance.includes("Browser-native confirm/prompt"));
  assert.match(acceptance, /checkContrast/);
});

test("27G documentation does not pretend automated checks replace manual visual acceptance", () => {
  assert.match(state, /manual authenticated visual acceptance remains/);
  assert.match(state, /Production version: 0\.26\.0/);
});

test("27G acceptance recognises the real skip-link contract", () => {
  assert.match(shell, /href="#main-content"/);
  assert.match(shell, /id="main-content"/);
  assert.match(shell, /Skip to main content/);
  assert.match(acceptance, /href="#main-content"/);
  assert.doesNotMatch(acceptance, /className="skip-link"/);
});

test("remaining admin and Power Play consequential actions avoid browser-native dialogs", () => {
  assert.doesNotMatch(integrity, /window\.(confirm|prompt)/);
  assert.doesNotMatch(library, /window\.(confirm|prompt)/);
  assert.doesNotMatch(powerPlay, /window\.(confirm|prompt)/);
  assert.match(integrity, /<ConfirmDialog/);
  assert.match(library, /<ConfirmDialog/);
  assert.match(powerPlay, /Explain this Power Play redraw/);
});
