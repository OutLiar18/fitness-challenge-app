export const CATEGORIES = [
  {
    id: "water",
    name: "Water",
    emoji: "💧",

    fields: [
      {
        id: "amount",
        label: "Amount",
        type: "number",
        placeholder: "Amount (ml)",
      },
    ],

    scoreField: "amount",
    unit: "ml",
    dailyGoal: 2000,
    goalType: "higher",
  },

  {
    id: "fruit",
    name: "Fruit",
    emoji: "🍎",

    fields: [
      {
        id: "fruit",
        label: "Fruit",
        type: "select",
      },
      {
        id: "quantity",
        label: "Quantity",
        type: "number",
        placeholder: "Number eaten",
      },
    ],

    scoreField: "quantity",
    unit: "",
    dailyGoal: 3,
    goalType: "higher",
  },

  {
    id: "reading",
    name: "Reading",
    emoji: "📚",

    fields: [
      {
        id: "minutes",
        label: "Minutes",
        type: "number",
        placeholder: "Minutes read",
      },
      {
        id: "book",
        label: "Book",
        type: "text",
        placeholder: "Book title",
      },
    ],

    scoreField: "minutes",
    unit: "min",
    dailyGoal: 30,
    goalType: "higher",
  },

  {
    id: "running",
    name: "Running",
    emoji: "🏃",

    fields: [
      {
        id: "distance",
        label: "Distance",
        type: "number",
        placeholder: "Distance (km)",
      },
      {
        id: "time",
        label: "Time",
        type: "number",
        placeholder: "Time (minutes)",
      },
    ],

    scoreField: "distance",
    unit: "km",
    dailyGoal: 5,
    goalType: "higher",
  },

  {
    id: "upperBody",
    name: "Upper Body",
    emoji: "💪",

    fields: [
      {
        id: "exercise",
        label: "Exercise",
        type: "select",
      },
      {
        id: "sets",
        label: "Sets",
        type: "number",
      },
      {
        id: "reps",
        label: "Reps",
        type: "number",
      },
      {
        id: "weight",
        label: "Weight",
        type: "number",
      },
    ],

    unit: "workout",
    dailyGoal: 1,
    goalType: "higher",
  },

  {
    id: "lowerBody",
    name: "Lower Body",
    emoji: "🦵",

    fields: [
      {
        id: "exercise",
        label: "Exercise",
        type: "select",
      },
      {
        id: "sets",
        label: "Sets",
        type: "number",
      },
      {
        id: "reps",
        label: "Reps",
        type: "number",
      },
      {
        id: "weight",
        label: "Weight",
        type: "number",
      },
    ],

    unit: "workout",
    dailyGoal: 1,
    goalType: "higher",
  },

  {
    id: "core",
    name: "Core",
    emoji: "🔥",

    fields: [
      {
        id: "exercise",
        label: "Exercise",
        type: "select",
      },
      {
        id: "sets",
        label: "Sets",
        type: "number",
      },
      {
        id: "reps",
        label: "Reps",
        type: "number",
      },
    ],

    unit: "workout",
    dailyGoal: 1,
    goalType: "higher",
  },

  {
    id: "cardio",
    name: "Cardio",
    emoji: "🚴",

    fields: [
      {
        id: "activity",
        label: "Activity",
        type: "select",
      },
      {
        id: "duration",
        label: "Duration",
        type: "number",
        placeholder: "Minutes",
      },
    ],

    scoreField: "duration",
    unit: "min",
    dailyGoal: 30,
    goalType: "higher",
  },

  {
    id: "skill",
    name: "Skill Development",
    emoji: "🎯",

    fields: [
      {
        id: "skill",
        label: "Skill",
        type: "text",
        placeholder: "What did you practice?",
      },
      {
        id: "duration",
        label: "Duration",
        type: "number",
        placeholder: "Minutes",
      },
    ],

    scoreField: "duration",
    unit: "min",
    dailyGoal: 30,
    goalType: "higher",
  },

  {
    id: "steps",
    name: "Steps",
    emoji: "👣",

    fields: [
      {
        id: "steps",
        label: "Steps",
        type: "number",
        placeholder: "Number of steps",
      },
    ],

    scoreField: "steps",
    unit: "steps",
    dailyGoal: 10000,
    goalType: "higher",
  },
];
