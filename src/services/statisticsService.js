import { CATEGORIES } from "../constants/categories";

export function getTotalEntries(entries) {
  return entries.length;
}

export function getCategoryEntries(entries, categoryId) {
  return entries.filter(
    (entry) => entry.category === categoryId
  );
}

export function getTotalPoints(entries) {
  return entries.reduce(
    (total, entry) => total + (entry.points || 0),
    0
  );
}

export function getCategoryTotal(entries, categoryId) {
  const category = CATEGORIES.find(
    (c) => c.id === categoryId
  );

  if (!category || !category.scoreField) return 0;

  return getCategoryEntries(entries, categoryId).reduce(
    (total, entry) =>
      total + Number(entry.data?.[category.scoreField] || 0),
    0
  );
}

export function getTotalWater(entries) {
  return getCategoryTotal(entries, "water");
}

export function getTotalReading(entries) {
  return getCategoryTotal(entries, "reading");
}

export function getTotalRunning(entries) {
  return getCategoryTotal(entries, "running");
}

export function getTodaysEntries(entries) {
  const today = new Date();

  return entries.filter((entry) => {
    if (!entry.createdAt) return false;

    const date = entry.createdAt.toDate();

    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  });
}

export function getTodaysCategoryTotal(entries, categoryId) {
  return getCategoryTotal(
    getTodaysEntries(entries),
    categoryId
  );
}