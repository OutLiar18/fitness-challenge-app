import { CATEGORIES } from "../../constants/categories";

import { calculateEffectiveReps } from "../points/workoutPoints";

import { getCategoryEntries, getTodayEntries } from "./filters";

import { getCategoryTotal } from "./totals";

function getDailyGoalCurrent(entries, category) {
  if (category.dailyGoalMetric === "effectiveReps") {
    return getCategoryEntries(entries, category.id).reduce(
      (total, entry) =>
        total + calculateEffectiveReps(entry.data?.exercises ?? []),
      0,
    );
  }

  if (category.scoreField) {
    return getCategoryTotal(entries, category.id);
  }

  return getCategoryEntries(entries, category.id).length;
}

export function getDailyGoals(entries = []) {
  const todayEntries = getTodayEntries(entries);

  return CATEGORIES.map((category) => {
    const current = getDailyGoalCurrent(todayEntries, category);
    const goal = Number(category.dailyGoal ?? 0);

    const percentage =
      goal <= 0 ? 0 : Math.min(100, Math.round((current / goal) * 100));

    return {
      id: category.id,
      emoji: category.emoji,
      name: category.name,
      current,
      goal,
      percentage,
      unit: category.unit ?? "",
      completed: goal > 0 && current >= goal,
    };
  });
}
