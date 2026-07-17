import { CATEGORIES } from "../constants/categories";
import { calculateEntryPoints } from "./pointsService";

export function getEntriesForDate(entries, selectedDate) {
  return entries.filter((entry) => {
    if (!entry.challengeDate) return false;

    const date = entry.challengeDate.toDate();

    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  });
}

export function getTodayEntries(entries) {
  return getEntriesForDate(entries, new Date());
}

export function getTotalEntries(entries) {
  return entries.length;
}

export function getTodayEntryCount(entries) {
  return getTodayEntries(entries).length;
}

export function getCategoryEntries(entries, categoryId) {
  return entries.filter((entry) => entry.category === categoryId);
}

export function getTotalPoints(entries) {
  return entries.reduce(
    (total, entry) => total + calculateEntryPoints(entry),
    0,
  );
}

export function getTodayPoints(entries) {
  return getTodayEntries(entries).reduce(
    (total, entry) => total + calculateEntryPoints(entry),
    0,
  );
}

export function getCategoryTotal(entries, categoryId) {
  const category = CATEGORIES.find((c) => c.id === categoryId);

  if (!category || !category.scoreField) return 0;

  return getCategoryEntries(entries, categoryId).reduce(
    (total, entry) => total + Number(entry.data?.[category.scoreField] || 0),
    0,
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

export function getTopCategories(entries) {
  return CATEGORIES.map((category) => ({
    ...category,
    points: getCategoryEntries(entries, category.id).reduce(
      (total, entry) => total + calculateEntryPoints(entry),
      0,
    ),
  }))
    .filter((category) => category.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);
}

export function getDailyGoals(entries) {
  const today = getTodayEntries(entries);

  return CATEGORIES.map((category) => {
    const current = category.scoreField
      ? getCategoryTotal(today, category.id)
      : getCategoryEntries(today, category.id).length;

    const goal = category.dailyGoal || 0;

    const percentage =
      goal === 0 ? 0 : Math.min(100, Math.round((current / goal) * 100));

    return {
      id: category.id,
      emoji: category.emoji,
      name: category.name,
      current,
      goal,
      percentage,
      unit: category.unit || "",
      completed: current >= goal,
    };
  });
}

export function getMissionProgress(goals) {
  const completed = goals.filter((goal) => goal.completed).length;

  const total = goals.length;

  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getNextGoal(goals) {
  return (
    goals
      .filter((goal) => !goal.completed)
      .sort((a, b) => b.percentage - a.percentage)[0] || null
  );
}
