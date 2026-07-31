import { isSameDay, toDate } from "../dateService";

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

export function getTodayEntries(entries = []) {
  return getEntriesForDate(entries, new Date());
}

export function getCategoryEntries(entries = [], categoryId) {
  return entries.filter((entry) => entry.category === categoryId);
}
