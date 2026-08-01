import {
  getWeekEnd,
  getWeekStart,
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
  const start = getWeekStart(referenceDate);
  const end = getWeekEnd(referenceDate);

  if (!start || !end) {
    return [];
  }

  return entries.filter((entry) => {
    const entryDate = normalizeChallengeDate(entry.challengeDate);

    return Boolean(entryDate && entryDate >= start && entryDate <= end);
  });
}

export function getEntriesOnOrBefore(entries = [], referenceDate = new Date()) {
  const end = normalizeChallengeDate(referenceDate);

  if (!end) {
    return [];
  }

  return entries.filter((entry) => {
    const entryDate = normalizeChallengeDate(entry.challengeDate);
    return Boolean(entryDate && entryDate <= end);
  });
}

export function getCategoryEntries(entries = [], categoryId) {
  return entries.filter((entry) => entry.category === categoryId);
}
