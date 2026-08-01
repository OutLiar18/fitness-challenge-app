import { WORKOUT_CATEGORY_IDS } from "../../constants/categories";
import { getLocalDateKey } from "../dateService";
import { calculateEntryPoints } from "../points";
import { getRunningPointEligibility } from "../points/categoryPoints";
import { calculateEffectiveReps } from "../points/workoutPoints";
import { getEntryDate, getSortedDateKeys, groupEntriesByDate } from "./helpers";

function toPositiveNumber(value) {
  const number = Number(value);

  return Number.isFinite(number) && number > 0 ? number : 0;
}

function createRecord({
  id,
  name,
  value,
  unit,
  date,
  entry = null,
  metadata = {},
}) {
  if (!Number.isFinite(Number(value)) || Number(value) <= 0) {
    return null;
  }

  return {
    id,
    name,
    value: Number(value),
    unit,
    date,
    dateKey: getLocalDateKey(date),
    entryId: entry?.id ?? "",
    categoryId: entry?.category ?? "",
    metadata,
  };
}

function selectHighest(current, candidate) {
  if (!candidate) {
    return current;
  }

  if (!current || candidate.value > current.value) {
    return candidate;
  }

  return current;
}

function selectLowest(current, candidate) {
  if (!candidate) {
    return current;
  }

  if (!current || candidate.value < current.value) {
    return candidate;
  }

  return current;
}

function getBonusPointsByDate(events = []) {
  const totals = new Map();

  events.forEach((event) => {
    if (!event?.earnedDateKey) {
      return;
    }

    const points = Number(event.points ?? 0);

    if (!Number.isFinite(points) || points <= 0) {
      return;
    }

    totals.set(
      event.earnedDateKey,
      (totals.get(event.earnedDateKey) ?? 0) + points,
    );
  });

  return totals;
}

function getDailyRecords(entries = [], bonusEvents = []) {
  const groups = groupEntriesByDate(entries);
  const bonusPointsByDate = getBonusPointsByDate(bonusEvents);

  let highestDailyPoints = null;
  let mostActiveDay = null;
  let highestWaterDay = null;
  let highestStepsDay = null;

  getSortedDateKeys(groups).forEach((dateKey) => {
    const dateEntries = groups.get(dateKey) ?? [];
    const date = getEntryDate(dateEntries[0]);

    const activityPoints = dateEntries.reduce(
      (total, entry) => total + calculateEntryPoints(entry),
      0,
    );

    const bonusPoints = bonusPointsByDate.get(dateKey) ?? 0;

    highestDailyPoints = selectHighest(
      highestDailyPoints,
      createRecord({
        id: "highest-daily-points",
        name: "Highest Daily Score",
        value: activityPoints + bonusPoints,
        unit: "points",
        date,
        metadata: {
          activityPoints,
          bonusPoints,
        },
      }),
    );

    const categoryIds = new Set(
      dateEntries.map((entry) => entry.category).filter(Boolean),
    );

    mostActiveDay = selectHighest(
      mostActiveDay,
      createRecord({
        id: "most-active-day",
        name: "Most Active Day",
        value: categoryIds.size,
        unit: categoryIds.size === 1 ? "category" : "categories",
        date,
        metadata: {
          entryCount: dateEntries.length,
          categoryIds: [...categoryIds],
        },
      }),
    );

    const water = dateEntries
      .filter((entry) => entry.category === "water")
      .reduce(
        (total, entry) => total + toPositiveNumber(entry.data?.amount),
        0,
      );

    highestWaterDay = selectHighest(
      highestWaterDay,
      createRecord({
        id: "highest-water-day",
        name: "Most Water in One Day",
        value: water,
        unit: "ml",
        date,
      }),
    );

    const steps = dateEntries
      .filter((entry) => entry.category === "steps")
      .reduce((total, entry) => total + toPositiveNumber(entry.data?.steps), 0);

    highestStepsDay = selectHighest(
      highestStepsDay,
      createRecord({
        id: "highest-steps-day",
        name: "Most Steps in One Day",
        value: steps,
        unit: "steps",
        date,
      }),
    );
  });

  return {
    highestDailyPoints,
    mostActiveDay,
    highestWaterDay,
    highestStepsDay,
  };
}

function getRunningRecords(entries = []) {
  let longestRun = null;
  let fastestQualifyingRun = null;

  entries
    .filter((entry) => entry.category === "running")
    .forEach((entry) => {
      const date = getEntryDate(entry);
      const distance = toPositiveNumber(entry.data?.distance);

      longestRun = selectHighest(
        longestRun,
        createRecord({
          id: "longest-run",
          name: "Longest Run",
          value: distance,
          unit: "km",
          date,
          entry,
          metadata: {
            totalSeconds: toPositiveNumber(entry.data?.totalSeconds),
            totalMinutes: toPositiveNumber(entry.data?.totalMinutes),
          },
        }),
      );

      const eligibility = getRunningPointEligibility(entry.data);

      if (!eligibility.eligible) {
        return;
      }

      fastestQualifyingRun = selectLowest(
        fastestQualifyingRun,
        createRecord({
          id: "fastest-qualifying-run",
          name: "Fastest Qualifying Run",
          value: eligibility.paceSecondsPerKm,
          unit: "seconds per km",
          date,
          entry,
          metadata: {
            distance: eligibility.distance,
            totalSeconds: toPositiveNumber(entry.data?.totalSeconds),
          },
        }),
      );
    });

  return {
    longestRun,
    fastestQualifyingRun,
  };
}

function getReadingRecord(entries = []) {
  return entries
    .filter((entry) => entry.category === "reading")
    .reduce((record, entry) => {
      const minutes = toPositiveNumber(entry.data?.totalMinutes);

      return selectHighest(
        record,
        createRecord({
          id: "longest-reading-session",
          name: "Longest Reading Session",
          value: minutes,
          unit: "minutes",
          date: getEntryDate(entry),
          entry,
          metadata: {
            title: entry.data?.title ?? "",
            completed: entry.data?.completed === true,
          },
        }),
      );
    }, null);
}

function getWorkoutRecords(entries = []) {
  const categoryRecords = {
    upperBody: null,
    lowerBody: null,
    core: null,
  };

  let largestWorkout = null;

  entries
    .filter((entry) => WORKOUT_CATEGORY_IDS.includes(entry.category))
    .forEach((entry) => {
      const effectiveReps = calculateEffectiveReps(entry.data?.exercises ?? []);

      const categoryNames = {
        upperBody: "Largest Upper Body Session",
        lowerBody: "Largest Lower Body Session",
        core: "Largest Core Session",
      };

      const candidate = createRecord({
        id: `largest-${entry.category}-session`,
        name: categoryNames[entry.category],
        value: effectiveReps,
        unit: "effective reps",
        date: getEntryDate(entry),
        entry,
        metadata: {
          exerciseCount: Array.isArray(entry.data?.exercises)
            ? entry.data.exercises.length
            : 0,
        },
      });

      categoryRecords[entry.category] = selectHighest(
        categoryRecords[entry.category],
        candidate,
      );

      largestWorkout = selectHighest(
        largestWorkout,
        candidate
          ? {
              ...candidate,
              id: "largest-workout-session",
              name: "Largest Workout Session",
            }
          : null,
      );
    });

  return {
    largestWorkout,
    categoryRecords,
  };
}

export function getPersonalRecordSummary(entries = [], bonusEvents = []) {
  const daily = getDailyRecords(entries, bonusEvents);
  const running = getRunningRecords(entries);
  const workouts = getWorkoutRecords(entries);

  const records = [
    daily.highestDailyPoints,
    daily.mostActiveDay,
    daily.highestWaterDay,
    daily.highestStepsDay,
    running.longestRun,
    running.fastestQualifyingRun,
    getReadingRecord(entries),
    workouts.largestWorkout,
    workouts.categoryRecords.upperBody,
    workouts.categoryRecords.lowerBody,
    workouts.categoryRecords.core,
  ].filter(Boolean);

  return {
    records,
    count: records.length,
    daily,
    running,
    reading: {
      longestSession:
        records.find((record) => record.id === "longest-reading-session") ??
        null,
    },
    workouts,
  };
}
