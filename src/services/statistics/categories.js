import { CATEGORIES } from "../../constants/categories";
import { calculateEntryPoints } from "../points";

import { getCategoryEntries } from "./filters";

export function getTopCategories(entries = []) {
  return CATEGORIES.map((category) => {
    const categoryEntries = getCategoryEntries(
      entries,
      category.id,
    );

    const points = categoryEntries.reduce(
      (total, entry) =>
        total + calculateEntryPoints(entry),
      0,
    );

    return {
      ...category,
      points,
    };
  })
    .filter((category) => category.points > 0)
    .sort((first, second) => second.points - first.points)
    .slice(0, 3);
}