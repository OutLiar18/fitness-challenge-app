import { WORKOUT_CATEGORIES } from "../../constants/categories";
import { getCategory } from "../../utils/categoryHelpers";
import { calculateCategoryPointBreakdown } from "./categoryPoints";
import { calculateWorkoutPointBreakdown } from "./workoutPoints";

function createBreakdownItem({
  categoryId,
  points,
  type = "main",
  sourceCategoryId = "",
  label,
  id,
  detail = "",
}) {
  const category = getCategory(categoryId);

  return {
    id: id ?? `${sourceCategoryId || categoryId}-${categoryId}-${type}`,
    categoryId,
    type,
    emoji: category?.emoji ?? "⭐",
    label: label ?? category?.name ?? "Points",
    points: Number.isFinite(Number(points)) ? Number(points) : 0,
    detail,
  };
}

function getWorkoutBreakdown(entry) {
  const result = calculateWorkoutPointBreakdown(entry.data);

  return {
    total: result.points,
    breakdown: [
      createBreakdownItem({
        categoryId: entry.category,
        points: result.points,
        detail:
          result.effectiveReps > 0
            ? `${result.effectiveReps} Effective Repetitions`
            : "",
      }),
    ],
  };
}

function getCategoryBreakdown(entry) {
  const result = calculateCategoryPointBreakdown(entry.category, entry.data);
  const breakdown = [createBreakdownItem(result.main)];

  result.bonuses.forEach((bonus) => {
    const bonusCategory = getCategory(bonus.categoryId);

    breakdown.push(
      createBreakdownItem({
        ...bonus,
        id: `${entry.category}-${bonus.categoryId}-bonus`,
        label: `${bonusCategory?.name ?? "Category"} Bonus`,
      }),
    );
  });

  return {
    total: result.total,
    breakdown,
  };
}

export function getEntryPointBreakdown(entry) {
  if (!entry?.category) {
    return { total: 0, breakdown: [] };
  }

  return WORKOUT_CATEGORIES.has(entry.category)
    ? getWorkoutBreakdown(entry)
    : getCategoryBreakdown(entry);
}
