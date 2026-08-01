import { CATEGORIES } from "../../constants/categories";
import { getEntryPointBreakdown } from "../points";

export function getTopCategories(entries = [], limit = 3) {
  const totals = new Map(CATEGORIES.map((category) => [category.id, 0]));

  entries.forEach((entry) => {
    getEntryPointBreakdown(entry).breakdown.forEach((item) => {
      if (!totals.has(item.categoryId)) {
        return;
      }

      totals.set(item.categoryId, totals.get(item.categoryId) + item.points);
    });
  });

  return CATEGORIES.map((category) => ({
    ...category,
    points: totals.get(category.id) ?? 0,
  }))
    .filter((category) => category.points > 0)
    .sort((first, second) => second.points - first.points)
    .slice(0, Math.max(0, limit));
}
