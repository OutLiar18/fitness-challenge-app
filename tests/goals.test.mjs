import assert from "node:assert/strict";
import test from "node:test";

import {
  getDailyGoals,
  getEntriesForWeek,
  getWeeklyGoals,
} from "../src/services/statistics/index.js";

function createEntry(category, data, date) {
  return {
    category,
    data,
    challengeDate: {
      toDate: () => date,
    },
  };
}

function createWorkout(category, exercise, reps, date) {
  return createEntry(
    category,
    {
      exercises: [
        {
          exercise,
          source: "library",
          sets: [
            {
              reps,
              weight: "",
            },
          ],
        },
      ],
    },
    date,
  );
}

test("Daily goals exclude Running and combine workout categories", () => {
  const referenceDate = new Date(2026, 6, 29, 12);

  const entries = [
    createWorkout("upperBody", "Push Up", 20, referenceDate),
    createWorkout("lowerBody", "Bodyweight Squat", 30, referenceDate),
  ];

  const goals = getDailyGoals(entries, referenceDate);

  assert.equal(goals.length, 7);

  assert.equal(
    goals.some((goal) => goal.goalId === "running"),
    false,
  );

  const workouts = goals.find((goal) => goal.goalId === "workouts");

  assert.equal(workouts.current, 50);
  assert.equal(workouts.goal, 50);
  assert.equal(workouts.completed, true);

  assert.equal(goals.find((goal) => goal.goalId === "reading").goal, 60);

  assert.equal(goals.find((goal) => goal.goalId === "cardio").goal, 15);
});

test("Weekly goals use Monday through Sunday and include Running Cardio time", () => {
  const referenceDate = new Date(2026, 6, 29, 12);

  const previousSunday = new Date(2026, 6, 26, 12);

  const monday = new Date(2026, 6, 27, 12);

  const sunday = new Date(2026, 7, 2, 12);

  const entries = [
    createEntry("water", { amount: 9999 }, previousSunday),
    createEntry("water", { amount: 10000 }, monday),
    createEntry("water", { amount: 5000 }, sunday),
    createEntry(
      "running",
      {
        distance: 2,
        totalMinutes: 20,
      },
      monday,
    ),
    createEntry(
      "running",
      {
        distance: 3,
        totalMinutes: 40,
      },
      sunday,
    ),
    createEntry(
      "cardio",
      {
        activity: "Walking",
        totalMinutes: 90,
      },
      monday,
    ),
    createWorkout("upperBody", "Push Up", 200, monday),
    createWorkout("lowerBody", "Bodyweight Squat", 200, sunday),
  ];

  const weekEntries = getEntriesForWeek(entries, referenceDate);

  assert.equal(weekEntries.length, entries.length - 1);

  const goals = getWeeklyGoals(entries, referenceDate);

  assert.equal(goals.length, 8);

  const water = goals.find((goal) => goal.goalId === "water");

  assert.equal(water.current, 15000);
  assert.equal(water.completed, true);

  const running = goals.find((goal) => goal.goalId === "running");

  assert.equal(running.current, 5);
  assert.equal(running.entryCount, 2);
  assert.equal(running.minimumEntries, 1);
  assert.equal(running.completed, true);

  const workouts = goals.find((goal) => goal.goalId === "workouts");

  assert.equal(workouts.current, 400);
  assert.equal(workouts.completed, true);

  const cardio = goals.find((goal) => goal.goalId === "cardio");

  assert.equal(cardio.current, 150);
  assert.equal(cardio.completed, true);
});
