import { getExerciseNamesByCategory } from "../../services/exerciseLibraryService";

export const UPPER_BODY_OPTIONS = getExerciseNamesByCategory("upperBody").map(
  (name) => ({
    name,
  }),
);