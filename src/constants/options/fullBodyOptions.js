import { getExerciseNamesByCategory } from "../../services/exerciseLibraryService";

export const FULL_BODY_OPTIONS = getExerciseNamesByCategory("fullBody").map(
  (name) => ({
    name,
  }),
);