export { calculateBaseCategoryPoints, calculateCategoryPointBreakdown } from "./categoryPoints";
export { getEntryPointBreakdown } from "./pointBreakdown";
export {
  calculateEffectiveReps,
  calculateWorkoutPointBreakdown,
  calculateWorkoutPoints,
} from "./workoutPoints";

import { getEntryPointBreakdown } from "./pointBreakdown";

export function calculateEntryPoints(entry) {
  return getEntryPointBreakdown(entry).total;
}
