export function calculateTotalSeconds({
  hours = 0,
  minutes = 0,
  seconds = 0,
}) {
  return hours * 3600 + minutes * 60 + seconds;
}

export function calculateTotalMinutes(time) {
  return Math.round(calculateTotalSeconds(time) / 60);
}