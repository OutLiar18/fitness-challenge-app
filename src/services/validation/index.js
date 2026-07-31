import { WORKOUT_CATEGORIES } from "../../constants/categories";
import { validateSimpleEntry } from "./simpleValidation";
import { validateWorkoutEntry } from "./workoutValidation";

export function validateEntry(category, data = {}) {
  if (!category) {
    return ["Unknown category."];
  }

  return WORKOUT_CATEGORIES.has(category.id)
    ? validateWorkoutEntry(data)
    : validateSimpleEntry(category, data);
}
