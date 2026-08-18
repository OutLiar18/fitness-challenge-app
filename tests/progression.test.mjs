import assert from "node:assert/strict";
import test from "node:test";

import {
  ACHIEVEMENT_DIFFICULTY,
  LEVEL_CONFIGURATION,
  PROGRESSION_ACHIEVEMENTS,
} from "../src/constants/progression.js";
import { getGoalBonusSummary } from "../src/services/progression/goalBonusService.js";
import { getProgressionSummary } from "../src/services/progression/progressionService.js";
import { getStreakSummary } from "../src/services/progression/streakService.js";
import {
  calculateLevel,
  getTotalXpRequiredForLevel,
} from "../src/services/progression/xpService.js";

function createEntry(category, data, date) {
  return { category, data, challengeDate: { toDate: () => date } };
}

function createWorkout(category, exercise, reps, date) {
  return createEntry(
    category,
    {
      exercises: [
        {
          exercise,
          source: "library",
          sets: [{ reps, weight: "" }],
        },
      ],
    },
    date,
  );
}

function createPerfectDay(date) {
  return [
    createEntry("water", { amount: 2000 }, date),
    createEntry("fruit", { servings: 3 }, date),
    createEntry("reading", { totalMinutes: 60 }, date),
    createWorkout("upperBody", "Push Up", 50, date),
    createWorkout("lowerBody", "Bodyweight Squat", 50, date),
    createWorkout("core", "Sit Up", 50, date),
    createEntry(
      "cardio",
      { activity: "Walking", totalMinutes: 15 },
      date,
    ),
    createEntry("skill", { skill: "Writing", totalMinutes: 15 }, date),
    createEntry("steps", { steps: 10000 }, date),
  ];
}

function createPerfectWeek(date) {
  return [
    createEntry("water", { amount: 15000 }, date),
    createEntry("fruit", { servings: 21 }, date),
    createEntry("reading", { totalMinutes: 450 }, date),
    createEntry(
      "running",
      { distance: 5, totalMinutes: 30, totalSeconds: 1800 },
      date,
    ),
    createWorkout("upperBody", "Push Up", 400, date),
    createWorkout("lowerBody", "Bodyweight Squat", 400, date),
    createWorkout("core", "Sit Up", 400, date),
    createEntry(
      "cardio",
      { activity: "Walking", totalMinutes: 120 },
      date,
    ),
    createEntry("skill", { skill: "Writing", totalMinutes: 150 }, date),
    createEntry("steps", { steps: 90000 }, date),
  ];
}

test("A completed daily goal earns a small bonus without changing entry scoring", () => {
  const date = new Date(2026, 6, 27, 12);
  const entries = [createEntry("water", { amount: 2000 }, date)];
  const progression = getProgressionSummary(entries, date);

  assert.equal(progression.score.activityPoints, 5);
  assert.equal(progression.score.bonusPoints, 1);
  assert.equal(progression.score.totalPoints, 6);
  assert.equal(progression.bonuses.goalBonuses.completedDailyGoals, 1);
});

test("Completing every daily goal earns nine goal bonuses and one mission bonus", () => {
  const date = new Date(2026, 6, 27, 12);
  const summary = getGoalBonusSummary(createPerfectDay(date), date);

  assert.equal(summary.completedDailyGoals, 9);
  assert.equal(summary.perfectDays, 1);
  assert.equal(summary.totalPoints, 12);
});

test("Completing every weekly goal earns moderate weekly bonuses", () => {
  const monday = new Date(2026, 6, 27, 12);
  const summary = getGoalBonusSummary(createPerfectWeek(monday), monday);
  const weeklyEvents = summary.events.filter((event) =>
    event.type.startsWith("weekly"),
  );

  assert.equal(summary.completedWeeklyGoals, 10);
  assert.equal(summary.perfectWeeks, 1);
  assert.equal(
    weeklyEvents.reduce((total, event) => total + event.points, 0),
    28,
  );
});

test("A streak shield is earned after seven successful days and protects one miss", () => {
  const start = new Date(2026, 6, 6, 12);
  const entries = [];

  for (let index = 0; index < 7; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    entries.push(createEntry("water", { amount: 2000 }, date));
  }

  const ninthDay = new Date(start);
  ninthDay.setDate(start.getDate() + 8);
  entries.push(createEntry("water", { amount: 2000 }, ninthDay));

  const streak = getStreakSummary(entries, ninthDay);

  assert.equal(streak.currentStreak, 8);
  assert.equal(streak.longestStreak, 8);
  assert.equal(streak.protectedDays.length, 1);
  assert.equal(streak.shieldAvailable, 0);
  assert.deepEqual(
    streak.milestoneEvents.map((event) => event.metadata.days),
    [3, 7],
  );
  assert.equal(
    streak.milestoneEvents.reduce((total, event) => total + event.points, 0),
    4,
  );
});

test("A miss before a shield is earned resets the active streak", () => {
  const start = new Date(2026, 6, 6, 12);
  const entries = [];

  for (const offset of [0, 1, 2, 4, 5]) {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    entries.push(createEntry("water", { amount: 2000 }, date));
  }

  const reference = new Date(start);
  reference.setDate(start.getDate() + 5);
  const streak = getStreakSummary(entries, reference);

  assert.equal(streak.currentStreak, 2);
  assert.equal(streak.longestStreak, 3);
  assert.equal(streak.protectedDays.length, 0);
});

test("XP, levels and achievements remain separate from competitive points", () => {
  const monday = new Date(2026, 6, 27, 12);
  const progression = getProgressionSummary(createPerfectWeek(monday), monday);

  assert.ok(progression.xp.level >= 2);
  assert.ok(progression.xp.achievementXp > 0);
  assert.ok(progression.xp.totalXp > progression.score.bonusPoints);
  assert.equal(
    progression.achievements.unlocked.some(
      (achievement) => achievement.id === "perfect-day",
    ),
    true,
  );
  assert.equal(
    progression.achievements.unlocked.some(
      (achievement) => achievement.id === "perfect-week",
    ),
    true,
  );
});

test("Progression ignores entries after the requested reference date", () => {
  const reference = new Date(2026, 6, 27, 12);
  const future = new Date(2026, 6, 28, 12);
  const entries = [
    createEntry("water", { amount: 2000 }, reference),
    createEntry("water", { amount: 10000 }, future),
  ];

  const progression = getProgressionSummary(entries, reference);

  assert.equal(progression.score.activityPoints, 5);
  assert.equal(progression.score.bonusPoints, 1);
  assert.equal(progression.xp.participationXp, 2);
  assert.equal(progression.records.successfulDays, 1);
});


test("achievement catalogue is large, unique, tiered and includes hidden rewards", () => {
  assert.ok(PROGRESSION_ACHIEVEMENTS.length >= 80);

  const ids = PROGRESSION_ACHIEVEMENTS.map((achievement) => achievement.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(
    PROGRESSION_ACHIEVEMENTS.every(
      (achievement) =>
        achievement.requirement &&
        achievement.metric?.type &&
        Number(achievement.xp) > 0 &&
        ACHIEVEMENT_DIFFICULTY[achievement.difficulty],
    ),
  );
  assert.ok(
    PROGRESSION_ACHIEVEMENTS.filter((achievement) => achievement.hidden).length >= 5,
  );
});

test("every activity category has a natural achievement family", () => {
  const families = new Set(
    PROGRESSION_ACHIEVEMENTS.map((achievement) => achievement.family),
  );

  [
    "water",
    "fruit",
    "reading",
    "running",
    "upperBody",
    "lowerBody",
    "core",
    "cardio",
    "skill",
    "steps",
  ].forEach((family) => assert.ok(families.has(family), family));
});

test("running ladder covers first kilometre through marathon and ultra milestones", () => {
  const runningTargets = PROGRESSION_ACHIEVEMENTS
    .filter((achievement) => achievement.family === "running")
    .map((achievement) => achievement.metric.target);

  [1, 3, 5, 10, 15, 20, 21.1, 42.2, 50, 100].forEach((target) =>
    assert.ok(runningTargets.includes(target), target),
  );

  const marathon = PROGRESSION_ACHIEVEMENTS.find(
    (achievement) => achievement.id === "running-marathon",
  );
  const ultra = PROGRESSION_ACHIEVEMENTS.find(
    (achievement) => achievement.id === "running-ultra50",
  );

  assert.ok(ultra.xp > marathon.xp);
  assert.ok(ultra.xp < getTotalXpRequiredForLevel(LEVEL_CONFIGURATION.maxLevel));
});

test("achievement progress promotes only the next visible milestone per family", () => {
  const date = new Date(2026, 6, 27, 12);
  const entries = [
    createEntry("water", { amount: 10000 }, date),
    createEntry(
      "running",
      { distance: 5, totalMinutes: 35, totalSeconds: 2100 },
      date,
    ),
  ];
  const progression = getProgressionSummary(entries, date);
  const waterNext = progression.achievements.nextByFamily.find(
    (achievement) => achievement.family === "water",
  );
  const runningNext = progression.achievements.nextByFamily.find(
    (achievement) => achievement.family === "running",
  );

  assert.equal(waterNext.metric.target, 25000);
  assert.equal(waterNext.progressPercentage, 40);
  assert.equal(runningNext.metric.target, 10);
  assert.equal(runningNext.progressPercentage, 50);
  assert.equal(
    progression.achievements.nextByFamily.filter(
      (achievement) => achievement.family === "running",
    ).length,
    1,
  );
});

test("hidden achievements stay out of next challenges until earned", () => {
  const date = new Date(2026, 6, 27, 12);
  const progression = getProgressionSummary(
    [
      createEntry(
        "running",
        { distance: 50, totalMinutes: 360, totalSeconds: 21600 },
        date,
      ),
    ],
    date,
  );

  assert.equal(
    progression.achievements.nextByFamily.some(
      (achievement) => achievement.id === "running-ultra100",
    ),
    false,
  );
  assert.ok(progression.achievements.hiddenTotal > 0);
  assert.ok(progression.xp.achievementXp >= 3000);
});

test("level 100 is capped behind a roughly decade-scale XP curve", () => {
  const maximumXp = getTotalXpRequiredForLevel(100);

  assert.equal(LEVEL_CONFIGURATION.maxLevel, 100);
  assert.equal(maximumXp, 354420);
  assert.equal(calculateLevel(maximumXp - 1).level, 99);
  assert.equal(calculateLevel(maximumXp).level, 100);
  assert.equal(calculateLevel(maximumXp + 1000000).level, 100);
  assert.equal(calculateLevel(maximumXp).maximumLevel, true);
});
