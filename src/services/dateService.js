export function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isToday(date) {
  return isSameDay(date, new Date());
}

export function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return isSameDay(date, yesterday);
}

export function isEditableDate(date) {
  return isToday(date) || isYesterday(date);
}