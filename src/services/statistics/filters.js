export function getEntriesForDate(
  entries = [],
  selectedDate,
) {
  if (!(selectedDate instanceof Date)) {
    return [];
  }

  return entries.filter((entry) => {
    if (!entry.challengeDate) {
      return false;
    }

    const entryDate =
      typeof entry.challengeDate.toDate === "function"
        ? entry.challengeDate.toDate()
        : new Date(entry.challengeDate);

    if (Number.isNaN(entryDate.getTime())) {
      return false;
    }

    return (
      entryDate.getFullYear() === selectedDate.getFullYear() &&
      entryDate.getMonth() === selectedDate.getMonth() &&
      entryDate.getDate() === selectedDate.getDate()
    );
  });
}

export function getTodayEntries(entries = []) {
  return getEntriesForDate(entries, new Date());
}

export function getCategoryEntries(
  entries = [],
  categoryId,
) {
  return entries.filter(
    (entry) => entry.category === categoryId,
  );
}