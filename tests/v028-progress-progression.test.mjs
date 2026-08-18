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
const shellCss = read("src/components/layout/AppShell.css");

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

test("28D2B keeps Progress responsive while restoring desktop tab titles", () => {
  assert.match(progress, /Every honest entry adds iron to your record/);
  assert.doesNotMatch(progress, /View analytics/);
  assert.doesNotMatch(progress, /badge:/);
  assert.match(progressCss, /28D2B — responsive Progress polish/);
  assert.match(progressCss, /\.progress-hero__level-wrap \{[\s\S]*aspect-ratio: 1/);
  assert.match(progressCss, /width: clamp\(136px, 42vw, 160px\)/);
  assert.match(progressCss, /\.progress-page \.workspace-tab__copy \{[\s\S]*position: static/);
  assert.match(progressCss, /\.progress-page \.workspace-tab__copy strong \{[\s\S]*display: block/);
  assert.match(progressCss, /repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(progressCss, /repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(shellCss, /safe-area-inset-left/);
  assert.match(shellCss, /font-size: clamp\(0\.66rem, 2\.2vw, 0\.72rem\)/);
});
