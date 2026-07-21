import { getExerciseNamesByCategory } from "../../services/exerciseLibraryService";

export const CORE_OPTIONS = getExerciseNamesByCategory("core").map(
  (name) => ({
    name,
  }),
);