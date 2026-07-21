import { CATEGORY_SCORING } from "../../constants/categoryScoring";
import { getScoreFromTable } from "./utils";

export function calculateCategoryPoints(category, data = {}) {
  const config = CATEGORY_SCORING[category];

  if (!config) {
    return 0;
  }

  const value = Number(data[config.field] || 0);

  if (category === "fruit") {
    return Math.min(value, 3);
  }

  return getScoreFromTable(value, config.table);
}