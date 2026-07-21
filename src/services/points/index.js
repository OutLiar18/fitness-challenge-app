import { calculateCategoryPoints } from "./categoryPoints";
import { calculateWorkoutPoints } from "./workoutPoints";

const WORKOUT_CATEGORIES = new Set([
  "upperBody",
  "lowerBody",
  "core",
]);

export function calculateEntryPoints(entry) {
  if (!entry) return 0;

  if (WORKOUT_CATEGORIES.has(entry.category)) {
    return calculateWorkoutPoints(entry.data);
  }

  return calculateCategoryPoints(
    entry.category,
    entry.data,
  );
}