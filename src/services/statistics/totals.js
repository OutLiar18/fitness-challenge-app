import { CATEGORIES } from "../../constants/categories";
import { calculateEntryPoints } from "../points";

import {
  getCategoryEntries,
  getTodayEntries,
} from "./filters";

export function getTotalEntries(entries = []) {
  return entries.length;
}

export function getTodayEntryCount(entries = []) {
  return getTodayEntries(entries).length;
}

export function getTotalPoints(entries = []) {
  return entries.reduce(
    (total, entry) =>
      total + calculateEntryPoints(entry),
    0,
  );
}

export function getTodayPoints(entries = []) {
  return getTotalPoints(getTodayEntries(entries));
}

export function getCategoryTotal(
  entries = [],
  categoryId,
) {
  const category = CATEGORIES.find(
    (item) => item.id === categoryId,
  );

  if (!category?.scoreField) {
    return 0;
  }

  return getCategoryEntries(
    entries,
    categoryId,
  ).reduce((total, entry) => {
    const value = Number(
      entry.data?.[category.scoreField] ?? 0,
    );

    return total + (Number.isFinite(value) ? value : 0);
  }, 0);
}

export function getTotalWater(entries = []) {
  return getCategoryTotal(entries, "water");
}

export function getTotalReading(entries = []) {
  return getCategoryTotal(entries, "reading");
}

export function getTotalRunning(entries = []) {
  return getCategoryTotal(entries, "running");
}