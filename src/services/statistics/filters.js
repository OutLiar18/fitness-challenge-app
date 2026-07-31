import {
  addDays,
  isSameDay,
  normalizeChallengeDate,
  toDate,
} from "../dateService";

export function getEntriesForDate(entries = [], selectedDate) {
  const validSelectedDate = toDate(selectedDate);

  if (!validSelectedDate) {
    return [];
  }

  return entries.filter((entry) => {
    const entryDate = toDate(entry.challengeDate);

    return entryDate ? isSameDay(entryDate, validSelectedDate) : false;
  });
}

export function getTodayEntries(entries = [], referenceDate = new Date()) {
  return getEntriesForDate(entries, referenceDate);
}

export function getEntriesForWeek(entries = [], referenceDate = new Date()) {
  const reference = normalizeChallengeDate(referenceDate);

  if (!reference) {
    return [];
  }

  // Monday = start of the local calendar week.
  const daysSinceMonday = (reference.getDay() + 6) % 7;
  const start = addDays(reference, -daysSinceMonday);
  const end = addDays(start, 6);

  if (!start || !end) {
    return [];
  }

  return entries.filter((entry) => {
    const entryDate = normalizeChallengeDate(entry.challengeDate);

    return Boolean(entryDate && entryDate >= start && entryDate <= end);
  });
}

export function getCategoryEntries(entries = [], categoryId) {
  return entries.filter((entry) => entry.category === categoryId);
}
