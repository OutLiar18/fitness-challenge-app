import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const vite = read("vite.config.js");
const packageJson = JSON.parse(read("package.json"));
const qualityCheck = read("scripts/ui-quality-check.mjs");
const shell = read("src/components/layout/AppShell.jsx");
const integrity = read("src/components/admin/EntryIntegrityWorkspace.jsx");
const library = read("src/components/admin/LibraryPublisher.jsx");
const powerPlay = read("src/components/seasons/PowerPlayWorkspace.jsx");

test("Firebase vendor grouping uses a size target instead of one forced monolith", () => {
  assert.match(vite, /name: "firebase-vendor"/);
  assert.match(vite, /maxSize:\s*360 \* 1024/);
  assert.match(vite, /test: \/node_modules/);
});

test("the normal application check includes the version-neutral UI quality gate", () => {
  assert.equal(packageJson.scripts["quality:ui"], "node scripts/ui-quality-check.mjs --verify");
  assert.match(packageJson.scripts.check, /npm run build && npm run quality:ui$/);
});

test("UI quality verification covers performance, responsiveness, interaction and contrast foundations", () => {
  assert.match(qualityCheck, /Largest JavaScript chunk/);
  assert.match(qualityCheck, /Firebase vendor group was not partitioned/);
  assert.match(qualityCheck, /min-width:\\s\*320px/);
  assert.match(qualityCheck, /prefers-reduced-motion/);
  assert.match(qualityCheck, /role="alertdialog"/);
  assert.match(qualityCheck, /role="tablist"/);
  assert.ok(qualityCheck.includes("Browser-native confirm/prompt"));
  assert.match(qualityCheck, /checkContrast/);
});

test("UI quality verification recognises the real skip-link contract", () => {
  assert.match(shell, /href="#main-content"/);
  assert.match(shell, /id="main-content"/);
  assert.match(shell, /Skip to main content/);
  assert.match(qualityCheck, /href="#main-content"/);
});

test("consequential admin and Power Play actions avoid browser-native dialogs", () => {
  assert.doesNotMatch(integrity, /window\.(confirm|prompt)/);
  assert.doesNotMatch(library, /window\.(confirm|prompt)/);
  assert.doesNotMatch(powerPlay, /window\.(confirm|prompt)/);
  assert.match(integrity, /<ConfirmDialog/);
  assert.match(library, /<ConfirmDialog/);
  assert.match(powerPlay, /Explain this Power Play redraw/);
});
