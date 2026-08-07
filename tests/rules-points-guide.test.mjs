import assert from "node:assert/strict";
import test from "node:test";

import {
  RULEBOOK_RULES,
  RULEBOOK_SECTIONS,
  RULE_STATUSES,
} from "../src/constants/rulebook.js";
import { REFERENCE_NAV_ITEMS } from "../src/constants/navigation.js";
import { POINTS } from "../src/constants/points/points.js";
import { WORKOUT_POINTS } from "../src/constants/points/workoutPoints.js";
import {
  ACTIVITY_POINT_GUIDES,
  DIFFICULTY_POINT_GUIDE,
  PUBLIC_GOAL_BONUSES,
  PUBLIC_LEAGUE_SCORING,
  PUBLIC_POINT_FORMULAS,
  createThresholdRows,
  getActivityPointGuide,
} from "../src/services/points/pointsGuideModel.js";
import {
  filterRulebookSections,
  getRulebookStats,
} from "../src/services/rules/rulebookModel.js";

function flattenRules(sections) {
  return sections.flatMap((section) => section.rules);
}

test("Rulebook sections and rules use stable unique identifiers", () => {
  const sectionIds = RULEBOOK_SECTIONS.map((section) => section.id);
  const ruleIds = RULEBOOK_RULES.map((item) => item.id);

  assert.equal(new Set(sectionIds).size, sectionIds.length);
  assert.equal(new Set(ruleIds).size, ruleIds.length);
  assert.ok(RULEBOOK_SECTIONS.every((section) => section.rules.length > 0));
  assert.ok(RULEBOOK_RULES.every((item) => item.text.length >= 3));
});

test("Rulebook separates current, season and inactive mechanics", () => {
  const stats = getRulebookStats();

  assert.ok(stats.current > stats.season);
  assert.ok(stats.current > stats.inactive);
  assert.equal(stats.rules, RULEBOOK_RULES.length);
  assert.ok(
    RULEBOOK_RULES.some(
      (item) => item.id === "pocket-window" && item.status === RULE_STATUSES.SEASON,
    ),
  );
  assert.ok(
    RULEBOOK_RULES.some(
      (item) => item.id === "chaos-assignment" && item.status === RULE_STATUSES.SEASON,
    ),
  );
  assert.ok(
    RULEBOOK_RULES.some(
      (item) => item.id === "transfer-market" && item.status === RULE_STATUSES.INACTIVE,
    ),
  );
  assert.ok(
    RULEBOOK_RULES.some(
      (item) => item.id === "legacy-champion" && item.status === RULE_STATUSES.SEASON,
    ),
  );
});

test("Rulebook search finds relevant rules without exposing inactive rules by default", () => {
  const currentRunning = filterRulebookSections(RULEBOOK_SECTIONS, {
    query: "running",
    status: "current",
  });
  const inactive = filterRulebookSections(RULEBOOK_SECTIONS, {
    query: "transfer",
    status: RULE_STATUSES.INACTIVE,
  });

  assert.ok(flattenRules(currentRunning).some((item) => item.id === "running-distance"));
  assert.equal(
    flattenRules(currentRunning).some((item) => item.status === RULE_STATUSES.INACTIVE),
    false,
  );
  assert.ok(flattenRules(inactive).some((item) => item.id === "transfer-market"));
});

test("Public point ladders are generated from the live scoring constants", () => {
  assert.deepEqual(getActivityPointGuide("water").rows, createThresholdRows(POINTS.water));
  assert.deepEqual(getActivityPointGuide("workouts").rows, createThresholdRows(WORKOUT_POINTS));
  const runningRows = getActivityPointGuide("running").rows;
  assert.deepEqual(runningRows[0], {
    minimum: 0,
    maximum: 2.99,
    points: 0,
  });
  assert.equal(runningRows[1].minimum, 3);
  assert.ok(
    ACTIVITY_POINT_GUIDES.filter((guide) => guide.type === "table").every(
      (guide) => guide.rows[0].minimum === 0 && guide.rows[0].points === 0,
    ),
  );
  assert.equal(getActivityPointGuide("fruit").formula, "Fruit points = whole servings × 5");
});

test("Every public activity category has one guide and difficulty remains moderate", () => {
  const guideIds = ACTIVITY_POINT_GUIDES.map((guide) => guide.id);

  assert.equal(new Set(guideIds).size, guideIds.length);
  assert.deepEqual(guideIds.sort(), [
    "cardio",
    "fruit",
    "reading",
    "running",
    "skill",
    "steps",
    "water",
    "workouts",
  ]);
  assert.equal(DIFFICULTY_POINT_GUIDE[0].multiplier, 1);
  assert.equal(DIFFICULTY_POINT_GUIDE.at(-1).multiplier, 1.5);
});

test("Points Guide exposes visible goal and league scoring but omits streak rewards", () => {
  assert.deepEqual(
    PUBLIC_GOAL_BONUSES.map((bonus) => bonus.points),
    [1, 3, 2, 8],
  );
  assert.equal(PUBLIC_GOAL_BONUSES.some((bonus) => bonus.id.includes("streak")), false);
  assert.equal(PUBLIC_POINT_FORMULAS.some((item) => item.id === "running"), true);
  assert.equal(PUBLIC_LEAGUE_SCORING.dailyActivityCap, 20);
  assert.equal(PUBLIC_LEAGUE_SCORING.dailyParticipationBonus, 5);
  assert.match(PUBLIC_LEAGUE_SCORING.houseFormula, /credited while representing/);
  assert.match(PUBLIC_LEAGUE_SCORING.pocketFormula, /0 points until activated/);
});

test("Rules and Points Guide remain directly reachable through reference navigation", () => {
  assert.deepEqual(
    REFERENCE_NAV_ITEMS.map((item) => item.to),
    ["/rules", "/points-guide"],
  );
});
