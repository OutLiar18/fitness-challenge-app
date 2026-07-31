const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function toDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  }

  if (typeof value?.toDate === "function") {
    return toDate(value.toDate());
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function normalizeChallengeDate(value) {
  const date = toDate(value);

  if (!date) {
    return null;
  }

  date.setHours(12, 0, 0, 0);
  return date;
}

export function isSameDay(firstValue, secondValue) {
  const first = toDate(firstValue);
  const second = toDate(secondValue);

  return Boolean(
    first &&
      second &&
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate(),
  );
}

export function isToday(value) {
  return isSameDay(value, new Date());
}

export function isYesterday(value) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return isSameDay(value, yesterday);
}

export function isEditableDate(value) {
  return isToday(value) || isYesterday(value);
}

export function addDays(value, amount) {
  const date = normalizeChallengeDate(value);

  if (!date || !Number.isFinite(Number(amount))) {
    return null;
  }

  date.setDate(date.getDate() + Number(amount));
  return date;
}

export function formatDateInputValue(value) {
  const date = toDate(value);

  if (!date) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDateInputValue(value) {
  const match = DATE_INPUT_PATTERN.exec(String(value ?? ""));

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day), 12);

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return date;
}

export function isFutureDate(value) {
  const date = normalizeChallengeDate(value);
  const today = normalizeChallengeDate(new Date());

  return Boolean(date && today && date > today);
}
