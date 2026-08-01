export function getScoreFromTable(value, table) {
  let score = 0;

  for (const bracket of table) {
    if (value >= bracket.min) {
      score = bracket.points;
    } else {
      break;
    }
  }

  return score;
}