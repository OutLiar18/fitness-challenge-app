import { EXERCISE_LIBRARY } from "../constants/libraries/exerciseLibrary";

export function getExercisesByCategory(category) {
  return Object.values(EXERCISE_LIBRARY)
    .filter((exercise) => exercise.category === category)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((exercise) => exercise.name);
}