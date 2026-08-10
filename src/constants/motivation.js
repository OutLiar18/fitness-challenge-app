const MOTIVATION_LIBRARY = Object.freeze([
  {
    quote: "You do not need a perfect day. You need an honest next action.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Drink a glass of water before your next scroll.",
    coachNote: "Your future self has submitted a polite complaint about procrastination.",
  },
  {
    quote: "Consistency is ordinary effort refusing to disappear.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Complete the smallest goal currently within reach.",
    coachNote: "Tiny progress is still progress wearing comfortable shoes.",
  },
  {
    quote: "Record the truth. Improvement needs an honest starting point.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Log one activity you would normally forget to count.",
    coachNote: "The journal cannot judge you. It is literally a database.",
  },
  {
    quote: "Momentum begins when the argument with yourself finally ends.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Start for five minutes. You may negotiate again afterwards.",
    coachNote: "Motivation is late again. Discipline has agreed to cover the shift.",
  },
  {
    quote: "The person you are becoming is built from decisions nobody applauds.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Do one useful thing without announcing it first.",
    coachNote: "Invisible effort has entered the chat.",
  },
  {
    quote: "A missed day is not a broken identity. Return tomorrow.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Choose the easiest meaningful goal and rebuild from there.",
    coachNote: "Plot twist: champions are allowed to be human.",
  },
  {
    quote: "Your strongest competition is yesterday’s excuse.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Replace one ‘later’ with a two-minute start.",
    coachNote: "Yesterday’s excuse has requested a rematch. Decline politely.",
  },
  {
    quote: "Progress becomes powerful when it becomes repeatable.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Make today’s win easy enough to repeat tomorrow.",
    coachNote: "Heroic chaos is optional. Sustainable systems are undefeated.",
  },
  {
    quote: "You are not behind. You are at the next available starting line.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Take one action that makes tonight easier than this morning.",
    coachNote: "The starting line has no late fee.",
  },
  {
    quote: "Effort counts most when nobody is keeping score—so keep showing up.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Complete one goal for yourself, not for the points.",
    coachNote: "The points are impressed anyway. They are trying to act casual.",
  },
  {
    quote: "The days that feel ordinary are often the days your future is being built.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Do one small thing today that tomorrow-you will notice.",
    coachNote: "Legacy rarely arrives with dramatic background music.",
  },
  {
    quote: "Discipline is a promise kept after the mood that made it has disappeared.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Finish one task you already told yourself you would do.",
    coachNote: "Past-you left a note. It says: please follow through.",
  },
  {
    quote: "Strength is not only what you can carry. It is what you choose to continue.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Return to one habit that has slipped recently.",
    coachNote: "A comeback still counts even without a montage.",
  },
  {
    quote: "Your direction matters more than the speed of this particular day.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Choose one action that points in the right direction.",
    coachNote: "Slow progress has excellent navigation skills.",
  },
  {
    quote: "Confidence grows quietly from evidence that you can rely on yourself.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Keep one small promise to yourself before the day ends.",
    coachNote: "Self-trust accepts very small deposits.",
  },
  {
    quote: "A difficult season can still produce a stronger person.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Name one thing you are handling better than you used to.",
    coachNote: "Growth sometimes wears terrible camouflage.",
  },
  {
    quote: "You become dependable by doing ordinary things when nobody is checking.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Complete one useful action without needing recognition for it.",
    coachNote: "The invisible reps are still on the scoreboard that matters.",
  },
  {
    quote: "The goal is not to feel motivated every day. The goal is to keep a path back.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Make your next healthy action easier to begin.",
    coachNote: "Leave breadcrumbs for tomorrow-you.",
  },
  {
    quote: "Better is built from enough small choices that eventually stop feeling small.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Improve one familiar action by one deliberate step.",
    coachNote: "One percent is tiny until it keeps showing up.",
  },
  {
    quote: "There is courage in beginning again without pretending you never stopped.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Restart one habit without trying to make up for lost time.",
    coachNote: "No penalties for re-entering the arena.",
  },
  {
    quote: "What you repeat becomes easier to believe about yourself.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Choose one action that supports the identity you want to build.",
    coachNote: "Your habits are writing a very persuasive biography.",
  },
  {
    quote: "A strong life is assembled more often than it is discovered.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Improve one piece of your routine instead of waiting for a perfect plan.",
    coachNote: "Assembly instructions: begin anywhere useful.",
  },
  {
    quote: "Rest can protect progress. Quitting is not the only alternative to pushing harder.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "If you need recovery, choose it deliberately rather than disappearing from your goals.",
    coachNote: "Even champions occasionally require horizontal maintenance.",
  },
  {
    quote: "The person you admire is usually the result of thousands of unremarkable decisions.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Make one unremarkable decision that your future self would respect.",
    coachNote: "Legendary paperwork is still paperwork.",
  },
  {
    quote: "You do not have to win today. You only have to avoid abandoning yourself.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Do the smallest version of one goal you are tempted to skip completely.",
    coachNote: "Minimum viable champion mode activated.",
  },
  {
    quote: "Progress becomes a legacy when you keep it long enough to change who you are.",
    attribution: "Champions Legacy Challenge",
    sideQuest: "Repeat one habit that has already begun changing you.",
    coachNote: "Identity updates install slowly, but they do install.",
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
