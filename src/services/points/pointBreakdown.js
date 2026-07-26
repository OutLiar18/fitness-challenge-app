import { calculateCategoryPoints } from "./categoryPoints";
import { calculateWorkoutPoints } from "./workoutPoints";

const WORKOUT_CATEGORIES = new Set(["upperBody", "lowerBody", "core"]);

function getRunningBreakdown(data = {}) {
  const runningPoints = calculateCategoryPoints("running", data);

  const cardioBonus = calculateCategoryPoints("cardio", {
    activity: "Running",
    isRunningBonus: true,
    totalMinutes: Number(data.totalMinutes ?? 0),

    activityDefinition: {
      name: "Running",
      difficulty: {
        tier: 3,
        multiplier: 1.5,
      },
    },
  });

  const breakdown = [];

  if (runningPoints > 0) {
    breakdown.push({
      id: "running",
      emoji: "🏃",
      label: "Running",
      points: runningPoints,
    });
  }

  if (cardioBonus > 0) {
    breakdown.push({
      id: "cardioBonus",
      emoji: "❤️",
      label: "Cardio Bonus",
      points: cardioBonus,
    });
  }

  return {
    total: runningPoints + cardioBonus,
    breakdown,
  };
}

export function getEntryPointBreakdown(entry) {
  if (!entry) {
    return {
      total: 0,
      breakdown: [],
    };
  }

  if (WORKOUT_CATEGORIES.has(entry.category)) {
    const points = calculateWorkoutPoints(entry.data);

    return {
      total: points,
      breakdown: [
        {
          id: entry.category,
          emoji: "💪",
          label: "Workout",
          points,
        },
      ],
    };
  }

  if (entry.category === "running") {
    return getRunningBreakdown(entry.data);
  }

  const points = calculateCategoryPoints(entry.category, entry.data);

  return {
    total: points,
    breakdown: [
      {
        id: entry.category,
        emoji: "⭐",
        label: "Points",
        points,
      },
    ],
  };
}
