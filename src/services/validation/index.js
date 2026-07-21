import { validateSimpleEntry } from "./simpleValidation";
import { validateWorkoutEntry } from "./workoutValidation";

const WORKOUT_CATEGORIES = new Set([
  "upperBody",
  "lowerBody",
  "core",
]);

export function validateEntry(category, data = {}) {
  if (!category) {
    return ["Unknown category."];
  }

  if (WORKOUT_CATEGORIES.has(category.id)) {
    return validateWorkoutEntry(data);
  }

  return validateSimpleEntry(category, data);
}