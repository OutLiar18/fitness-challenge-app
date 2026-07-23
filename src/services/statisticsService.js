import { CATEGORIES } from "../constants/categories";
import { calculateEntryPoints } from "../../services/points";

const WORKOUT_CATEGORIES = new Set(["upperBody", "lowerBody", "core"]);

function getEntryDate(entry) {
  const challengeDate = entry?.challengeDate;

  if (!challengeDate) {
    return null;
  }

  if (typeof challengeDate.toDate === "function") {
    return challengeDate.toDate();
  }

  const date = new Date(challengeDate);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getSetRepetitions(set = {}) {
  const repetitions = Number(set.reps ?? 0);

  if (!Number.isFinite(repetitions) || repetitions < 0) {
    return 0;
  }

  return repetitions;
}

function getExerciseRawRepetitions(exercise = {}) {
  /*
   * New workout structure:
   *
   * {
   *   exercise: "Push-ups",
   *   sets: [
   *     { reps: 20 },
   *     { reps: 15 },
   *   ]
   * }
   */
  if (Array.isArray(exercise.sets)) {
    return exercise.sets.reduce(
      (total, set) => total + getSetRepetitions(set),
      0,
    );
  }

  /*
   * Backward compatibility for old entries:
   *
   * {
   *   exercise: "Push-ups",
   *   sets: 3,
   *   reps: 20
   * }
   *
   * This represents 3 sets of 20 repetitions.
   */
  const setCount = Number(exercise.sets ?? 1);
  const repsPerSet = Number(exercise.reps ?? 0);

  const safeSetCount = Number.isFinite(setCount) && setCount > 0 ? setCount : 1;

  const safeReps =
    Number.isFinite(repsPerSet) && repsPerSet > 0 ? repsPerSet : 0;

  return safeSetCount * safeReps;
}

export function getWorkoutRawRepetitions(entry = {}) {
  const exercises = entry.data?.exercises;

  if (!Array.isArray(exercises)) {
    return 0;
  }

  return exercises.reduce(
    (total, exercise) => total + getExerciseRawRepetitions(exercise),
    0,
  );
}

export function getEntriesForDate(entries = [], selectedDate) {
  if (!(selectedDate instanceof Date)) {
    return [];
  }

  return entries.filter((entry) => {
    const date = getEntryDate(entry);

    if (!date) {
      return false;
    }

    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  });
}

export function getTodayEntries(entries = []) {
  return getEntriesForDate(entries, new Date());
}

export function getTotalEntries(entries = []) {
  return entries.length;
}

export function getTodayEntryCount(entries = []) {
  return getTodayEntries(entries).length;
}

export function getCategoryEntries(entries = [], categoryId) {
  return entries.filter((entry) => entry.category === categoryId);
}

export function getTotalPoints(entries = []) {
  return entries.reduce(
    (total, entry) => total + Number(calculateEntryPoints(entry) || 0),
    0,
  );
}

export function getTodayPoints(entries = []) {
  return getTodayEntries(entries).reduce(
    (total, entry) => total + Number(calculateEntryPoints(entry) || 0),
    0,
  );
}

export function getCategoryTotal(entries = [], categoryId) {
  const category = CATEGORIES.find((item) => item.id === categoryId);

  if (!category) {
    return 0;
  }

  const categoryEntries = getCategoryEntries(entries, categoryId);

  if (WORKOUT_CATEGORIES.has(categoryId)) {
    return categoryEntries.reduce(
      (total, entry) => total + getWorkoutRawRepetitions(entry),
      0,
    );
  }

  if (!category.scoreField) {
    return 0;
  }

  return categoryEntries.reduce((total, entry) => {
    const value = Number(entry.data?.[category.scoreField] ?? 0);

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

export function getTopCategories(entries = []) {
  return CATEGORIES.map((category) => ({
    ...category,

    points: getCategoryEntries(entries, category.id).reduce(
      (total, entry) => total + Number(calculateEntryPoints(entry) || 0),
      0,
    ),
  }))
    .filter((category) => category.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);
}

export function getDailyGoals(entries = []) {
  const today = getTodayEntries(entries);

  return CATEGORIES.map((category) => {
    const current =
      WORKOUT_CATEGORIES.has(category.id) || category.scoreField
        ? getCategoryTotal(today, category.id)
        : getCategoryEntries(today, category.id).length;

    const goal = Number(category.dailyGoal ?? 0);

    const percentage =
      goal <= 0 ? 0 : Math.min(100, Math.round((current / goal) * 100));

    return {
      id: category.id,
      emoji: category.emoji,
      name: category.name,
      current,
      goal,
      percentage,
      unit: category.unit || "",
      completed: goal > 0 && current >= goal,
    };
  });
}

export function getMissionProgress(goals = []) {
  const completed = goals.filter((goal) => goal.completed).length;

  const total = goals.length;

  return {
    completed,
    total,

    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getNextGoal(goals = []) {
  return (
    goals
      .filter((goal) => !goal.completed)
      .sort((first, second) => second.percentage - first.percentage)[0] || null
  );
}
