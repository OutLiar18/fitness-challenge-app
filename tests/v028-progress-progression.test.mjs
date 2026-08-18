import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const progress = read("src/pages/Progress.jsx");
const progressCss = read("src/pages/Progress.css");
const progression = read("src/constants/progression.js");
const achievementService = read("src/services/progression/achievementService.js");
const xpService = read("src/services/progression/xpService.js");

test("28D2 exposes in-progress, available and collapsed completed achievements", () => {
  assert.match(progress, /achievements\.inProgress/);
  assert.match(progress, /achievements\.available/);
  assert.match(progress, /<details className="achievement-completed">/);
  assert.match(progress, /achievement\.requirement/);
  assert.match(progress, /achievement\.progressPercentage/);
});

test("28D2 achievement cards show configured XP difficulty and hide undiscovered details", () => {
  assert.match(progress, /achievement\.difficultyLabel/);
  assert.match(progress, /formatExperiencePoints\(achievement\.xp\)/);
  assert.match(progress, /hiddenLockedCount/);
  assert.match(progress, /remain undiscovered/);
  assert.match(progression, /ACHIEVEMENT_DIFFICULTY/);
});

test("28D2 uses one next visible milestone per achievement family", () => {
  assert.match(achievementService, /getNextByFamily/);
  assert.match(achievementService, /!achievement\.hidden && !achievement\.unlocked/);
  assert.match(achievementService, /progressPercentage/);
});

test("28D2 level journey has a capped 100-level long-term curve", () => {
  assert.match(progression, /maxLevel: 100/);
  assert.match(progression, /targetYears: 10/);
  assert.match(xpService, /getTotalXpRequiredForLevel/);
  assert.match(progress, /LEVEL_CONFIGURATION\.maxLevel/);
});

test("28D2 cleans desktop Progress tabs without regressing mobile select navigation", () => {
  assert.match(
    progressCss,
    /\.progress-page \.workspace-switcher__tabs \{[\s\S]*repeat\(5, minmax\(0, 1fr\)\)/,
  );
  assert.match(progressCss, /@media \(max-width: 1180px\)/);
  assert.match(progressCss, /@media \(max-width: 900px\)/);
  assert.match(progressCss, /var\(--interactive-glow\)/);
});
