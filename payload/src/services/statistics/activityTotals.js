import { CATEGORIES } from "../../constants/categories";
import { getCategory } from "../../utils/categoryHelpers";
import { calculateEntryPoints } from "../points";
import { getCategoryEntries, getTodayEntries } from "./filters";

function getEntryContribution(entry, targetCategoryId) {
  const sourceCategory = getCategory(entry.category);

  if (!sourceCategory) {
    return 0;
  }

  if (entry.category === targetCategoryId) {
    const targetField = sourceCategory.scoreField;
    const value = Number(entry.data?.[targetField] ?? 0);

    return Number.isFinite(value) ? value : 0;
  }

  const contribution = sourceCategory.statisticsContributions?.find(
    (item) => item.categoryId === targetCategoryId,
  );

  if (!contribution) {
    return 0;
  }

  const value = Number(entry.data?.[contribution.field] ?? 0);
  return Number.isFinite(value) ? value : 0;
}

export function getTotalEntries(entries = []) {
  return entries.length;
}

export function getTodayEntryCount(entries = [], referenceDate = new Date()) {
  return getTodayEntries(entries, referenceDate).length;
}

export function getActivityPoints(entries = []) {
  return entries.reduce(
    (total, entry) => total + calculateEntryPoints(entry),
    0,
  );
}

export function getTodayActivityPoints(
  entries = [],
  referenceDate = new Date(),
) {
  return getActivityPoints(getTodayEntries(entries, referenceDate));
}

export function getCategoryTotal(entries = [], categoryId) {
  const category = CATEGORIES.find((item) => item.id === categoryId);

  if (!category?.scoreField) {
    return 0;
  }

  return entries.reduce(
    (total, entry) => total + getEntryContribution(entry, categoryId),
    0,
  );
}

export function getCategoryEntryCount(entries = [], categoryId) {
  return getCategoryEntries(entries, categoryId).length;
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
