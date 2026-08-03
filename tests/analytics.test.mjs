import assert from "node:assert/strict";
import test from "node:test";

import { getPersonalAnalytics } from "../src/services/analytics/analyticsModel.js";

function entry(id, category, date, data) {
  return { id, category, challengeDate: date, data };
}

const referenceDate = new Date(2026, 7, 3, 12);
const entries = [
  entry("water-1", "water", new Date(2026, 7, 3, 12), { amount: 2000 }),
  entry("run-1", "running", new Date(2026, 7, 2, 12), {
    distance: 5,
    totalMinutes: 30,
    totalSeconds: 1800,
  }),
  entry("read-1", "reading", new Date(2026, 6, 27, 12), { totalMinutes: 60 }),
  entry("old", "water", new Date(2026, 5, 1, 12), { amount: 5000 }),
];

test("Personal analytics groups local calendar dates into weekly ranges", () => {
  const result = getPersonalAnalytics(entries, { rangeWeeks: 4, referenceDate });

  assert.equal(result.rangeWeeks, 4);
  assert.equal(result.weeklyTrend.length, 4);
  assert.equal(result.summary.entries, 3);
  assert.equal(result.summary.activeDays, 3);
  assert.equal(result.startDate.getDay(), 1);
  assert.equal(result.endDate.getDate(), 3);
});

test("Analytics reuse cross-category Running point breakdowns", () => {
  const result = getPersonalAnalytics(entries, { rangeWeeks: 4, referenceDate });
  const running = result.categoryBalance.find((item) => item.id === "running");
  const cardio = result.categoryBalance.find((item) => item.id === "cardio");

  assert.equal(running.points, 18);
  assert.equal(running.entries, 1);
  assert.equal(cardio.points, 7);
  assert.equal(cardio.entries, 0);
  assert.equal(cardio.activeDays, 1);
});

test("Analytics expose a fixed 28-day consistency window and transparent insights", () => {
  const result = getPersonalAnalytics(entries, { rangeWeeks: 4, referenceDate });

  assert.equal(result.dailyConsistency.length, 28);
  assert.ok(result.insights.some((item) => item.id === "best-week"));
  assert.ok(result.insights.some((item) => item.id === "consistency-window"));
  assert.equal(result.momentum.currentPoints > 0, true);
});

test("Unsupported analytics ranges fall back safely", () => {
  const result = getPersonalAnalytics([], { rangeWeeks: 99, referenceDate });
  assert.equal(result.rangeWeeks, 8);
  assert.equal(result.summary.activityPoints, 0);
  assert.equal(result.summary.bestDay, null);
});
