const MOTIVATION_LIBRARY = Object.freeze([
  {
    quote: "You do not need a perfect day. You need an honest next action.",
    attribution: "Champions Legacy",
    sideQuest: "Drink a glass of water before your next scroll.",
    coachNote: "Your future self has submitted a polite complaint about procrastination.",
  },
  {
    quote: "Consistency is ordinary effort refusing to disappear.",
    attribution: "Champions Legacy",
    sideQuest: "Complete the smallest goal currently within reach.",
    coachNote: "Tiny progress is still progress wearing comfortable shoes.",
  },
  {
    quote: "Record the truth. Improvement needs an honest starting point.",
    attribution: "Champions Legacy",
    sideQuest: "Log one activity you would normally forget to count.",
    coachNote: "The journal cannot judge you. It is literally a database.",
  },
  {
    quote: "Momentum begins when the argument with yourself finally ends.",
    attribution: "Champions Legacy",
    sideQuest: "Start for five minutes. You may negotiate again afterwards.",
    coachNote: "Motivation is late again. Discipline has agreed to cover the shift.",
  },
  {
    quote: "The person you are becoming is built from decisions nobody applauds.",
    attribution: "Champions Legacy",
    sideQuest: "Do one useful thing without announcing it first.",
    coachNote: "Invisible effort has entered the chat.",
  },
  {
    quote: "A missed day is not a broken identity. Return tomorrow.",
    attribution: "Champions Legacy",
    sideQuest: "Choose the easiest meaningful goal and rebuild from there.",
    coachNote: "Plot twist: champions are allowed to be human.",
  },
  {
    quote: "Your strongest competition is yesterday’s excuse.",
    attribution: "Champions Legacy",
    sideQuest: "Replace one ‘later’ with a two-minute start.",
    coachNote: "Yesterday’s excuse has requested a rematch. Decline politely.",
  },
  {
    quote: "Progress becomes powerful when it becomes repeatable.",
    attribution: "Champions Legacy",
    sideQuest: "Make today’s win easy enough to repeat tomorrow.",
    coachNote: "Heroic chaos is optional. Sustainable systems are undefeated.",
  },
  {
    quote: "You are not behind. You are at the next available starting line.",
    attribution: "Champions Legacy",
    sideQuest: "Take one action that makes tonight easier than this morning.",
    coachNote: "The starting line has no late fee.",
  },
  {
    quote: "Effort counts most when nobody is keeping score—so keep showing up.",
    attribution: "Champions Legacy",
    sideQuest: "Complete one goal for yourself, not for the points.",
    coachNote: "The points are impressed anyway. They are trying to act casual.",
  },
]);

function getLocalDateKey(date) {
  const value = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "champions-legacy";
  }

  return [
    value.getFullYear(),
    String(value.getMonth() + 1).padStart(2, "0"),
    String(value.getDate()).padStart(2, "0"),
  ].join("-");
}

function stableHash(value) {
  return [...String(value)].reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    2166136261,
  );
}

export function getDailyMotivation(
  date = new Date(),
  playerSeed = "champion",
  offset = 0,
) {
  const hash = stableHash(`${getLocalDateKey(date)}:${playerSeed}`);
  const safeOffset = Number.isFinite(Number(offset)) ? Number(offset) : 0;
  const index = Math.abs(hash + safeOffset) % MOTIVATION_LIBRARY.length;

  return {
    ...MOTIVATION_LIBRARY[index],
    index,
    total: MOTIVATION_LIBRARY.length,
  };
}

export function getMotivationCount() {
  return MOTIVATION_LIBRARY.length;
}
