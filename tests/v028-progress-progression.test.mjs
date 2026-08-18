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

test("28D2 level journey keeps the 100-level long-term curve but only reveals unlocked titles", () => {
  assert.match(progression, /maxLevel: 100/);
  assert.match(progression, /targetYears: 10/);
  assert.match(xpService, /getTotalXpRequiredForLevel/);
  assert.match(progress, /filter\(\(item\) => item\.minimumLevel <= unlockedLevel\)/);
  assert.doesNotMatch(progress, /LEVEL_CONFIGURATION\.maxLevel/);
  assert.doesNotMatch(progress, /getTotalXpRequiredForLevel/);
});

test("28D2A refines the hero copy, removes analytics CTA and simplifies tab chrome", () => {
  assert.match(progress, /Every honest entry adds iron to your record/);
  assert.doesNotMatch(progress, /View analytics/);
  assert.doesNotMatch(progress, /badge:/);
  assert.match(progressCss, /\.progress-page \.workspace-tab__copy \{[\s\S]*position: absolute/);
  assert.match(progressCss, /\.progress-page \.workspace-tab__badge \{[\s\S]*display: none/);
  assert.match(progressCss, /\.progress-hero__level-ring/);
});
