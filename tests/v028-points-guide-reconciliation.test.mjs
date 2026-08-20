import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { DEFAULT_LEAGUE_RULESET } from "../src/constants/leagues.js";
import {
  POINTS_GUIDE_VERSION,
  PUBLIC_SEASON_SCORING_NOTES,
  getActivityPointGuide,
} from "../src/services/points/pointsGuideModel.js";

const read = (relative) =>
  fs.readFileSync(new URL(`../${relative}`, import.meta.url), "utf8");

const pageSource = read("src/pages/PointsGuide.jsx");
const cssSource = read("src/pages/PointsGuide.css");

test("28D10 advances the public guide and derives season evidence values from the active ruleset", () => {
  assert.equal(POINTS_GUIDE_VERSION, "points-v4");
  const policy = DEFAULT_LEAGUE_RULESET.evidencePolicy;
  const notes = Object.fromEntries(
    PUBLIC_SEASON_SCORING_NOTES.map((item) => [item.id, item]),
  );

  assert.match(notes["water-photo-bonus"].detail, new RegExp(String(policy.waterBonus.thresholdMillilitres)));
  assert.match(notes["water-photo-bonus"].detail, new RegExp(`\\+${policy.waterBonus.points}`));
  assert.match(notes["fruit-photo-bonus"].detail, new RegExp(String(policy.fruitBonus.thresholdServings)));
  assert.match(notes["fruit-photo-bonus"].detail, new RegExp(`\\+${policy.fruitBonus.points}`));
  assert.match(notes["fruit-photo-bonus"].detail, new RegExp(String(policy.fruitDailyServingCap)));
  assert.match(notes["proof-deadline"].detail, new RegExp(String(policy.proofDeadlineHours)));
});

test("28D10 makes evidence holds and bonuses visible on the affected activity guides", () => {
  assert.match(getActivityPointGuide("steps").footnote, /wait for verified proof/i);
  assert.match(getActivityPointGuide("water").footnote, /photo proof/i);
  assert.match(getActivityPointGuide("water").footnote, /\+3 season points/);
  assert.match(getActivityPointGuide("fruit").footnote, /\+3 season points/);
  assert.match(getActivityPointGuide("fruit").footnote, /5 Fruit servings/);
  assert.match(getActivityPointGuide("running").footnote, /Cardio points are released immediately/);
  assert.match(getActivityPointGuide("running").footnote, /Running points wait for verified proof/);
});

test("28D10 documents season bonuses without pretending they are an activity formula", () => {
  const adjustment = PUBLIC_SEASON_SCORING_NOTES.find(
    (item) => item.id === "approved-season-bonus",
  );
  assert.ok(adjustment);
  assert.match(adjustment.detail, /positive whole-number/i);
  assert.match(adjustment.detail, /factual reason/i);
  assert.match(adjustment.detail, /player and their House/i);
  assert.match(adjustment.detail, /daily activity cap/i);
  assert.match(adjustment.detail, /Power Plays/i);
  assert.match(adjustment.detail, /category title/i);
});

test("28D10 uses ThemeIcon for ordinary Points Guide chrome while preserving category identity", () => {
  assert.match(pageSource, /import ThemeIcon/);
  assert.match(pageSource, /icon: <ThemeIcon name="points"/);
  assert.match(pageSource, /icon: <ThemeIcon name="star"/);
  assert.match(pageSource, /icon: <ThemeIcon name="seasons"/);
  assert.match(pageSource, /icon: <ThemeIcon name="info"/);
  assert.match(pageSource, /icon=\{<ThemeIcon name="points"/);
  assert.match(pageSource, /\{guide\.icon\}/);
  assert.match(pageSource, /GOAL_BONUS_ICON_NAMES/);
  assert.match(pageSource, /SEASON_NOTE_ICON_NAMES/);
  assert.doesNotMatch(pageSource, /📊|🔎|⚖️|🧭|🔐|✨|🛡️/);
});

test("28D10 keeps URL-backed guide state and the Rulebook cross-reference intact", () => {
  assert.match(pageSource, /searchParams\.get\("category"\)/);
  assert.match(pageSource, /searchParams\.get\("tab"\)/);
  assert.match(pageSource, /next\.delete\("tab"\)/);
  assert.match(pageSource, /next\.delete\("category"\)/);
  assert.match(pageSource, /to="\/rules"/);
  assert.match(pageSource, />\s*Read the Rulebook\s*</);
});

test("28D10 adds a scannable season-adjustment surface without broad CSS churn", () => {
  assert.match(pageSource, /Evidence and approved adjustments/);
  assert.match(pageSource, /PUBLIC_SEASON_SCORING_NOTES\.map/);
  assert.match(cssSource, /\.points-season-note-list/);
  assert.match(cssSource, /\.points-season-note-list article/);
  assert.match(cssSource, /\.points-season-note-list article > span/);
  assert.match(cssSource, /\.points-guide-boundary > span/);
});
