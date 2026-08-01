import assert from "node:assert/strict";
import test from "node:test";

import { PROGRESSION_ACHIEVEMENTS } from "../src/constants/progression.js";
import { getProgressTimeline } from "../src/services/progression/timelineService.js";

function createEvent({
  id,
  type,
  label,
  points = 0,
  xp = 0,
  date,
  metadata = {},
}) {
  return {
    id,
    type,
    label,
    points,
    xp,
    earnedDate: date,
    earnedDateKey: [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-"),
    metadata,
  };
}

test("Timeline groups goal completions and sorts newest first", () => {
  const firstDay = new Date(2026, 6, 27, 12);
  const secondDay = new Date(2026, 6, 28, 12);

  const goalEvents = [
    createEvent({
      id: "water-goal",
      type: "daily-goal",
      label: "Water daily goal",
      points: 1,
      xp: 5,
      date: firstDay,
      metadata: { goalId: "water" },
    }),
    createEvent({
      id: "fruit-goal",
      type: "daily-goal",
      label: "Fruit daily goal",
      points: 1,
      xp: 5,
      date: firstDay,
      metadata: { goalId: "fruit" },
    }),
    createEvent({
      id: "perfect-day",
      type: "daily-mission",
      label: "Perfect day",
      points: 3,
      xp: 10,
      date: secondDay,
    }),
  ];

  const timeline = getProgressTimeline({
    goalBonusEvents: goalEvents,
    achievements: { unlocked: [] },
  });

  const groupedGoals = timeline.events.find(
    (event) => event.type === "daily-goals",
  );

  assert.equal(groupedGoals.points, 2);
  assert.equal(groupedGoals.xp, 10);
  assert.match(groupedGoals.label, /2 daily goals/i);
  assert.equal(timeline.events[0].earnedDateKey, "2026-07-28");
});

test("Timeline derives level and achievement events", () => {
  const date = new Date(2026, 6, 27, 12);
  const entry = {
    category: "water",
    challengeDate: { toDate: () => date },
  };

  const xpEvents = [
    createEvent({
      id: "large-xp-event",
      type: "participation",
      label: "Participation",
      xp: 600,
      date,
    }),
  ];

  const achievements = {
    unlocked: PROGRESSION_ACHIEVEMENTS.filter((achievement) =>
      ["first-entry", "level-5"].includes(achievement.id),
    ),
  };

  const timeline = getProgressTimeline({
    entries: [entry],
    xpEvents,
    achievements,
  });

  assert.ok(timeline.events.some((event) => event.id === "level-up:5"));
  assert.ok(
    timeline.events.some((event) => event.id === "achievement:first-entry"),
  );
  assert.ok(
    timeline.events.some((event) => event.id === "achievement:level-5"),
  );
});
