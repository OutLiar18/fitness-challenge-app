const WORKOUT_CATEGORIES = new Set([
  "upperBody",
  "lowerBody",
  "core",
]);

export function normalizeEntry(category, data = {}) {
  if (WORKOUT_CATEGORIES.has(category)) {
    return {
      exercises: Array.isArray(data.exercises)
        ? data.exercises
        : [],
    };
  }

  return { ...data };
}