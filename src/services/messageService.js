const categoryMessages = {
  water: [
    "💧 Your water bottle can't be imaginary.",
    "🥤 Even camels have to start somewhere.",
  ],

  fruit: [
    "🍎 Invisible fruit has zero vitamins.",
    "🍌 Bananas don't peel themselves.",
  ],

  reading: [
    "📚 Reading through osmosis doesn't count.",
    "🤓 Even speed readers need a few minutes.",
  ],

  running: [
    "🏃 Unless you ran in another dimension...",
    "👟 Running in your imagination doesn't count.",
  ],

  upper_body: ["💪 Your muscles know what happened."],

  lower_body: ["🦵 Leg day skipped itself again?"],

  core: ["🔥 Your abs are waiting..."],

  cardio: ["❤️ Your heart wants some attention."],

  skill: ["🎯 Greatness starts with one session."],

  steps: ["👣 Standing still is an interesting strategy."],
};

const legendaryMessages = [
  "🏆 Achievement Unlocked: Professional Button Clicker.",
  "🤖 The validation goblins found something missing.",
  "🦖 Even dinosaurs filled in their forms... probably.",
];

export function getValidationMessage(categoryId) {
  // 1% chance of a legendary message
  if (Math.random() < 0.01) {
    return legendaryMessages[
      Math.floor(Math.random() * legendaryMessages.length)
    ];
  }

  const messages = categoryMessages[categoryId] ?? [
    "Please complete the required fields.",
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}
