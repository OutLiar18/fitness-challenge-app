import { CATEGORIES } from "../../constants/categories";

import {
  getCategoryEntries,
  getTodayEntries,
} from "./filters";

import { getCategoryTotal } from "./totals";

export function getDailyGoals(entries = []) {
  const todayEntries = getTodayEntries(entries);

  return CATEGORIES.map((category) => {
    const current = category.scoreField
      ? getCategoryTotal(
          todayEntries,
          category.id,
        )
      : getCategoryEntries(
          todayEntries,
          category.id,
        ).length;

    const goal = Number(category.dailyGoal ?? 0);

    const percentage =
      goal <= 0
        ? 0
        : Math.min(
            100,
            Math.round((current / goal) * 100),
          );

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