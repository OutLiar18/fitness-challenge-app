import assert from "node:assert/strict";
import test from "node:test";

import {
  getDailyGoals,
  getEntriesForWeek,
  getWeeklyGoals,
} from "../src/services/statistics/index.js";

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

test("Daily goals exclude Running and show each workout category", () => {
  const referenceDate = new Date(2026, 6, 29, 12);
  const entries = [
    createWorkout("upperBody", "Push Up", 50, referenceDate),
    createWorkout("lowerBody", "Bodyweight Squat", 30, referenceDate),
    createWorkout("core", "Sit Up", 20, referenceDate),
  ];

  const goals = getDailyGoals(entries, referenceDate);

  assert.equal(goals.length, 9);
  assert.equal(goals.some((goal) => goal.goalId === "running"), false);

  const upperBody = goals.find((goal) => goal.goalId === "upperBody");
  assert.equal(upperBody.current, 50);
  assert.equal(upperBody.goal, 50);
  assert.equal(upperBody.completed, true);
  assert.equal(upperBody.bonusPoints, 1);

  assert.equal(
    goals.find((goal) => goal.goalId === "lowerBody").completed,
    false,
  );
  assert.equal(goals.find((goal) => goal.goalId === "core").current, 20);
  assert.equal(goals.find((goal) => goal.goalId === "reading").goal, 60);
  assert.equal(goals.find((goal) => goal.goalId === "cardio").goal, 15);
});

test("Weekly goals use Monday through Sunday and separate workout categories", () => {
  const referenceDate = new Date(2026, 6, 29, 12);
  const previousSunday = new Date(2026, 6, 26, 12);
  const monday = new Date(2026, 6, 27, 12);
  const sunday = new Date(2026, 7, 2, 12);

  const entries = [
    createEntry("water", { amount: 9999 }, previousSunday),
    createEntry("water", { amount: 10000 }, monday),
    createEntry("water", { amount: 5000 }, sunday),
    createEntry("running", { distance: 2, totalMinutes: 20 }, monday),
    createEntry("running", { distance: 3, totalMinutes: 40 }, sunday),
    createEntry(
      "cardio",
      { activity: "Walking", totalMinutes: 90 },
      monday,
    ),
    createWorkout("upperBody", "Push Up", 400, monday),
    createWorkout("lowerBody", "Bodyweight Squat", 250, sunday),
    createWorkout("core", "Sit Up", 400, sunday),
  ];

  assert.equal(
    getEntriesForWeek(entries, referenceDate).length,
    entries.length - 1,
  );

  const goals = getWeeklyGoals(entries, referenceDate);
  assert.equal(goals.length, 10);
  assert.equal(goals[0].missionBonusPoints, 8);

  const water = goals.find((goal) => goal.goalId === "water");
  assert.equal(water.current, 15000);
  assert.equal(water.completed, true);

  const running = goals.find((goal) => goal.goalId === "running");
  assert.equal(running.current, 5);
  assert.equal(running.entryCount, 2);
  assert.equal(running.minimumEntries, 1);
  assert.equal(running.completed, true);

  assert.equal(
    goals.find((goal) => goal.goalId === "upperBody").completed,
    true,
  );
  assert.equal(
    goals.find((goal) => goal.goalId === "lowerBody").completed,
    false,
  );
  assert.equal(goals.find((goal) => goal.goalId === "core").completed, true);

  const cardio = goals.find((goal) => goal.goalId === "cardio");
  assert.equal(cardio.current, 150);
  assert.equal(cardio.completed, true);
});
