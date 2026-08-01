import {
  getLocalDateKey,
  getWeekStart,
  normalizeChallengeDate,
  parseDateInputValue,
} from "../dateService";

export function getEntryDate(entry) {
  return normalizeChallengeDate(entry?.challengeDate);
}

export function groupEntriesByDate(entries = []) {
  const groups = new Map();

  entries.forEach((entry) => {
    const date = getEntryDate(entry);
    const key = getLocalDateKey(date);

    if (!date || !key) {
      return;
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(entry);
  });

  return groups;
}

export function getSortedDateKeys(groups) {
  return [...groups.keys()].sort();
}

export function getUniqueWeekStarts(entries = []) {
  const starts = new Map();

  entries.forEach((entry) => {
    const start = getWeekStart(getEntryDate(entry));
    const key = getLocalDateKey(start);

    if (start && key) {
      starts.set(key, start);
    }
  });

  return [...starts.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([, date]) => date);
}

export function dateFromKey(key) {
  return parseDateInputValue(key);
}

export function createProgressionEvent({
  id,
  type,
  label,
  points = 0,
  xp = 0,
  earnedDate,
  metadata = {},
}) {
  const date = normalizeChallengeDate(earnedDate);

  return {
    id,
    type,
    label,
    points: Number(points) || 0,
    xp: Number(xp) || 0,
    earnedDate: date,
    earnedDateKey: getLocalDateKey(date),
    metadata,
  };
}
