import { getExerciseNamesByCategory } from "../../services/exerciseLibraryService";

export const LOWER_BODY_OPTIONS = getExerciseNamesByCategory("lowerBody").map(
  (name) => ({
    name,
  }),
);