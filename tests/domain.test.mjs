import assert from "node:assert/strict";
import test from "node:test";

import {
  formatDateInputValue,
  isSameDay,
  parseDateInputValue,
} from "../src/services/dateService.js";
import { normalizeEntry } from "../src/services/entries/normalizer.js";
import {
  calculateEntryPoints,
  getEntryPointBreakdown,
} from "../src/services/points/index.js";
import {
  getCategoryTotal,
  getDailyGoals,
  getTopCategories,
} from "../src/services/statistics/index.js";
import { validateEntry } from "../src/services/validation/index.js";
import { getCategory } from "../src/utils/categoryHelpers.js";

test("Qualifying Running awards Running points and a Cardio bonus", () => {
  const entry = {
    id: "running-test",
    category: "running",
    data: { distance: 5, totalMinutes: 30, totalSeconds: 1800 },
    challengeDate: { toDate: () => new Date() },
  };

  const result = getEntryPointBreakdown(entry);

  assert.equal(result.breakdown.length, 2);
  assert.equal(result.breakdown[0].categoryId, "running");
  assert.equal(result.breakdown[0].points, 18);
  assert.equal(result.breakdown[1].categoryId, "cardio");
  assert.equal(result.breakdown[1].points, 7);
  assert.equal(result.total, 25);
  assert.equal(calculateEntryPoints(entry), 25);
});

test("Running below 3 km earns only Cardio points", () => {
  const entry = {
    category: "running",
    data: { distance: 2, totalMinutes: 20, totalSeconds: 1200 },
  };

  const result = getEntryPointBreakdown(entry);

  assert.equal(result.breakdown[0].points, 0);
  assert.match(result.breakdown[0].detail, /at least 3 km/i);
  assert.equal(result.breakdown[1].categoryId, "cardio");
  assert.equal(result.breakdown[1].points, 2);
  assert.equal(result.total, 2);
});

test("Running slower than 11 minutes per kilometre earns only Cardio points", () => {
  const entry = {
    category: "running",
    data: { distance: 3, totalMinutes: 36, totalSeconds: 2160 },
  };

  const result = getEntryPointBreakdown(entry);

  assert.equal(result.breakdown[0].points, 0);
  assert.match(result.breakdown[0].detail, /11:00\/km or faster/i);
  assert.equal(result.breakdown[1].categoryId, "cardio");
  assert.equal(result.breakdown[1].points, 7);
  assert.equal(result.total, 7);
});

test("Running contributes to both Running and Cardio statistics", () => {
  const entry = {
    category: "running",
    data: { distance: 5, totalMinutes: 30 },
    challengeDate: { toDate: () => new Date() },
  };

  assert.equal(getCategoryTotal([entry], "running"), 5);
  assert.equal(getCategoryTotal([entry], "cardio"), 30);

  const topCategories = getTopCategories([entry]);
  assert.equal(
    topCategories.find((category) => category.id === "running")?.points,
    18,
  );
  assert.equal(
    topCategories.find((category) => category.id === "cardio")?.points,
    7,
  );
});

test("Workout daily goals use Effective Repetitions", () => {
  const today = new Date();
  const entries = [
    {
      category: "upperBody",
      data: {
        exercises: [
          {
            exercise: "Push Up",
            source: "library",
            sets: [{ reps: 20, weight: "" }],
          },
        ],
      },
      challengeDate: { toDate: () => today },
    },
    {
      category: "upperBody",
      data: {
        exercises: [
          {
            exercise: "Push Up",
            source: "library",
            sets: [{ reps: 30, weight: "" }],
          },
        ],
      },
      challengeDate: { toDate: () => today },
    },
  ];

  const goal = getDailyGoals(entries).find((item) => item.id === "upperBody");

  assert.equal(goal.current, 50);
  assert.equal(goal.goal, 50);
  assert.equal(goal.percentage, 100);
  assert.equal(goal.unit, "effective reps");
  assert.equal(goal.completed, true);
});

test("Legacy exercise definitions without exerciseType still score", () => {
  const entry = {
    category: "upperBody",
    data: {
      exercises: [
        {
          exercise: "Push Up",
          source: "library",
          sets: [{ reps: 20, weight: "" }],
        },
      ],
    },
  };

  const result = getEntryPointBreakdown(entry);

  assert.ok(result.total > 0);
  assert.equal(result.breakdown[0].detail, "20 effective reps");
});

test("Tier 5 custom workout exercises validate and score", () => {
  const normalized = normalizeEntry("upperBody", {
    exercises: [
      {
        exercise: "Custom Press",
        source: "custom",
        exerciseDefinition: {
          name: "Custom Press",
          category: "upperBody",
          exerciseType: "repetition",
          proposedTier: 5,
          equipment: "Bodyweight",
          primaryMuscles: ["Chest"],
        },
        sets: [{ reps: 20, weight: "" }],
      },
    ],
  });

  assert.deepEqual(validateEntry(getCategory("upperBody"), normalized), []);
  assert.ok(
    calculateEntryPoints({ category: "upperBody", data: normalized }) > 0,
  );
});

test("Custom Cardio requires complete scoring metadata", () => {
  const valid = normalizeEntry("cardio", {
    activity: "Hill Sprints",
    source: "custom",
    activityDefinition: {
      name: "Hill Sprints",
      group: "Running",
      cardioType: "Intervals",
      environment: "Outdoor",
      equipment: "None",
      proposedTier: 5,
    },
    minutes: 30,
  });

  assert.deepEqual(validateEntry(getCategory("cardio"), valid), []);

  const invalid = normalizeEntry("cardio", {
    activity: "Incomplete Activity",
    source: "custom",
    activityDefinition: {},
    minutes: 30,
  });

  const errors = validateEntry(getCategory("cardio"), invalid);
  assert.ok(errors.some((error) => error.includes("group")));
  assert.ok(errors.some((error) => error.includes("difficulty")));
});

test("Date input parsing remains on the selected local calendar day", () => {
  const date = parseDateInputValue("2026-07-30");

  assert.equal(formatDateInputValue(date), "2026-07-30");
  assert.ok(isSameDay(date, new Date(2026, 6, 30, 23, 59)));
});
