import { CATEGORY_SCORING } from "../../constants/categoryScoring";
import { getScoreFromTable } from "./utils";

const FRUIT_POINTS_PER_SERVING = 5;

export function calculateCategoryPoints(
  category,
  data = {},
) {
  if (category === "fruit") {
    const servings = Number(
      data.servings ??
      data.quantity ??
      0,
    );

    if (
      !Number.isFinite(servings) ||
      servings <= 0
    ) {
      return 0;
    }

    return servings * FRUIT_POINTS_PER_SERVING;
  }

  const config = CATEGORY_SCORING[category];

  if (!config) {
    return 0;
  }

  const value = Number(
    data[config.field] ?? 0,
  );

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return 0;
  }

  return getScoreFromTable(
    value,
    config.table,
  );
}