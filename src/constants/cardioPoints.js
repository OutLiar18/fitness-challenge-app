import { POINTS } from "../../constants/points";
import { DIFFICULTY } from "../../constants/libraries/difficulty";

import { getCardioActivity } from "../cardioLibraryService";
import { getScoreFromTable } from "./utils";

function getTotalMinutes(data = {}) {
  const storedTotalMinutes = Number(data.totalMinutes);

  if (Number.isFinite(storedTotalMinutes) && storedTotalMinutes > 0) {
    return storedTotalMinutes;
  }

  const hours = Number(data.hours || 0);
  const minutes = Number(data.minutes || 0);
  const seconds = Number(data.seconds || 0);

  return hours * 60 + minutes + seconds / 60;
}

function getCardioDifficulty(data = {}) {
  /*
   * Running entries receive Cardio points automatically.
   * They do not need to exist inside cardioLibrary.js.
   */
  if (data.isRunningBonus === true || data.activity === "Running") {
    return DIFFICULTY.TIER_3;
  }

  /*
   * Prefer the saved activity definition.
   * This keeps historical entries stable if the library changes later.
   */
  const savedDifficulty = data.activityDefinition?.difficulty;

  if (savedDifficulty && Number.isFinite(Number(savedDifficulty.multiplier))) {
    return savedDifficulty;
  }

  /*
   * Fall back to the current Cardio library.
   */
  const libraryActivity = getCardioActivity(data.activity);

  if (libraryActivity?.difficulty) {
    return libraryActivity.difficulty;
  }

  /*
   * Custom activities may temporarily store only
   * a proposed tier before admin approval.
   */
  const proposedTier = Number(
    data.activityDefinition?.proposedTier || data.proposedTier,
  );

  if (Number.isInteger(proposedTier) && DIFFICULTY[`TIER_${proposedTier}`]) {
    return DIFFICULTY[`TIER_${proposedTier}`];
  }

  /*
   * Safe fallback so old Cardio entries still score.
   */
  return DIFFICULTY.TIER_1;
}

export function calculateCardioPoints(data = {}) {
  const totalMinutes = getTotalMinutes(data);

  if (totalMinutes <= 0) {
    return 0;
  }

  const basePoints = getScoreFromTable(totalMinutes, POINTS.cardio);

  if (basePoints <= 0) {
    return 0;
  }

  const difficulty = getCardioDifficulty(data);

  const multiplier = Number(difficulty.multiplier || 1);

  return Math.round(basePoints * multiplier);
}
