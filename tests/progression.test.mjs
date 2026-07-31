import assert from "node:assert/strict";
import test from "node:test";

import { getGoalBonusSummary } from "../src/services/progression/goalBonusService.js";
import { getProgressionSummary } from "../src/services/progression/progressionService.js";
import { getStreakSummary } from "../src/services/progression/streakService.js";

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

  assert.equal(progression.xp.level, 2);
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
