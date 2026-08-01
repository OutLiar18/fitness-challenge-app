import { getPointBonusSummary } from "../progression/pointBonusService";
import {
  getActivityPoints,
  getCategoryEntryCount,
  getCategoryTotal,
  getTodayActivityPoints,
  getTodayEntryCount,
  getTotalEntries,
  getTotalReading,
  getTotalRunning,
  getTotalWater,
} from "./activityTotals";

export {
  getActivityPoints,
  getCategoryEntryCount,
  getCategoryTotal,
  getTodayActivityPoints,
  getTodayEntryCount,
  getTotalEntries,
  getTotalReading,
  getTotalRunning,
  getTotalWater,
};

export function getTotalPoints(entries = [], referenceDate = new Date()) {
  return (
    getActivityPoints(entries) +
    getPointBonusSummary(entries, referenceDate).totalPoints
  );
}

export function getTodayPoints(entries = [], referenceDate = new Date()) {
  return (
    getTodayActivityPoints(entries, referenceDate) +
    getPointBonusSummary(entries, referenceDate).todayPoints
  );
}
