import assert from "node:assert/strict";
import test from "node:test";

import { getProgressionSummary } from "../src/services/progression/progressionService.js";

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

test("Personal records derive running, reading and workout bests", () => {
  const firstDay = new Date(2026, 6, 27, 12);

  const secondDay = new Date(2026, 6, 28, 12);

  const entries = [
    createEntry(
      "reading",
      {
        title: "Book One",
        totalMinutes: 90,
      },
      firstDay,
    ),

    createEntry(
      "running",
      {
        distance: 5,
        totalMinutes: 50,
        totalSeconds: 3000,
        averagePaceSecondsPerKm: 600,
      },
      firstDay,
    ),

    createWorkout("upperBody", "Push Up", 75, firstDay),

    createEntry("water", { amount: 2000 }, firstDay),

    createEntry("steps", { steps: 12000 }, firstDay),

    createEntry(
      "running",
      {
        distance: 7,
        totalMinutes: 84,
        totalSeconds: 5040,
        averagePaceSecondsPerKm: 720,
      },
      secondDay,
    ),

    createEntry(
      "running",
      {
        distance: 3,
        totalMinutes: 27,
        totalSeconds: 1620,
        averagePaceSecondsPerKm: 540,
      },
      secondDay,
    ),

    createEntry(
      "reading",
      {
        title: "Book Two",
        totalMinutes: 30,
      },
      secondDay,
    ),

    createWorkout("lowerBody", "Bodyweight Squat", 120, secondDay),

    createEntry("water", { amount: 3000 }, secondDay),

    createEntry("steps", { steps: 15000 }, secondDay),
  ];

  const progression = getProgressionSummary(entries, secondDay);

  const records = progression.records.personal;

  assert.equal(records.running.longestRun.value, 7);

  assert.equal(records.running.fastestQualifyingRun.value, 540);

  assert.equal(records.running.fastestQualifyingRun.metadata.distance, 3);

  assert.equal(records.reading.longestSession.value, 90);

  assert.equal(records.workouts.largestWorkout.value, 120);

  assert.equal(records.workouts.largestWorkout.categoryId, "lowerBody");

  assert.equal(records.workouts.categoryRecords.upperBody.value, 75);

  assert.equal(records.daily.highestWaterDay.value, 3000);

  assert.equal(records.daily.highestStepsDay.value, 15000);
});

test("Running pace records require a qualifying run", () => {
  const date = new Date(2026, 6, 27, 12);

  const progression = getProgressionSummary(
    [
      createEntry(
        "running",
        {
          distance: 2,
          totalMinutes: 10,
          totalSeconds: 600,
          averagePaceSecondsPerKm: 300,
        },
        date,
      ),

      createEntry(
        "running",
        {
          distance: 5,
          totalMinutes: 60,
          totalSeconds: 3600,
          averagePaceSecondsPerKm: 720,
        },
        date,
      ),
    ],
    date,
  );

  assert.equal(progression.records.personal.running.longestRun.value, 5);

  assert.equal(progression.records.personal.running.fastestQualifyingRun, null);
});
