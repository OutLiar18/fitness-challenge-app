import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) => fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");
const exists = (relative) => fs.existsSync(new URL(`../${relative}`, import.meta.url));

const packageJson = JSON.parse(read("package.json"));
const indexCss = read("src/index.css");
const pageHeaderCss = read("src/components/layout/PageHeader.css");
const shellCss = read("src/components/layout/AppShell.css");
const welcomeCss = read("src/components/dashboard/WelcomeCard.css");
const currentState = read("docs/01_CURRENT_DEVELOPMENT/CURRENT_STATE.md");
const roadmap = read("docs/01_CURRENT_DEVELOPMENT/ROADMAP.md");

test("v0.29 identifies the cleanup and hardening development line", () => {
  assert.equal(packageJson.version, "0.29.0");
  assert.equal(packageJson.scripts.test, "node scripts/run-app-tests.mjs");
  assert.equal(packageJson.scripts["quality:ui"], "node scripts/ui-quality-check.mjs --verify");
  assert.doesNotMatch(JSON.stringify(packageJson.scripts), /accept:v027|check:v024/);
});

test("proven dead dashboard and avatar components are removed", () => {
  for (const relative of [
    "src/components/profile/AvatarPicker.jsx",
    "src/components/profile/AvatarPicker.css",
    "src/components/dashboard/MotivationCard.jsx",
    "src/components/dashboard/MotivationCard.css",
    "src/components/dashboard/StatsCard.jsx",
    "src/components/dashboard/StatsCard.css",
    "src/components/dashboard/StatItem.jsx",
    "src/components/dashboard/StatItem.css",
    "src/constants/dashboardStats.js",
  ]) {
    assert.equal(exists(relative), false, `${relative} should remain removed`);
  }
});

test("global visual hierarchy derives accent text and links from shared theme tokens", () => {
  for (const token of ["--accent-bright", "--accent-soft", "--link", "--link-hover", "--heading-accent"]) {
    assert.match(indexCss, new RegExp(`${token}:`));
  }
  assert.match(indexCss, /\.section-kicker\s*\{[\s\S]*?color:\s*var\(--heading-accent\)/);
  assert.match(indexCss, /\.text-link\s*\{[\s\S]*?color:\s*var\(--link\)/);
  assert.match(indexCss, /:root\[data-mbti-theme\][\s\S]*?--heading-accent:/);
  assert.match(pageHeaderCss, /var\(--accent-bright\)/);
  assert.match(shellCss, /var\(--accent-soft\)/);
});

test("responsive polish keeps one canonical compact Welcome Card breakpoint", () => {
  assert.equal((welcomeCss.match(/@media \(max-width: 620px\)/g) ?? []).length, 1);
  assert.match(welcomeCss, /@media \(max-width: 620px\)[\s\S]*?min-height:\s*0/);
  assert.match(welcomeCss, /@media \(max-width: 460px\)[\s\S]*?grid-template-columns:\s*1fr/);
});

test("current documentation reflects the simplified path toward v1", () => {
  assert.match(currentState, /Current development branch: `development\/v0\.29\.0`/);
  assert.match(currentState, /Production version: \*\*v0\.28\.0\*\*/);
  assert.match(roadmap, /v0\.29\.0 — cleanup, polish and hardening/);
  assert.match(roadmap, /v1\.0\.0 — first stable public release/);
  assert.match(roadmap, /full season rehearsal is not a required gate/i);
});
