export const CATEGORIES = [
  {
    id: "water",
    name: "Water",
    emoji: "💧",

    fields: [
      {
        id: "amount",
        label: "Water",
        type: "number",
        placeholder: "500",
        required: true,
        min: 1,
        step: 1,
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
        id: "fruitType",
        label: "Fruit",
        type: "select",
        required: true,
      },
      {
        id: "servings",
        label: "Servings",
        type: "number",
        placeholder: "Number of servings",
        required: true,
        min: 1,
        step: 1,
      },
    ],

    scoreField: "servings",
    unit: "servings",
    dailyGoal: 3,
    goalType: "higher",
  },

  {
    id: "reading",
    name: "Reading",
    emoji: "📚",

    fields: [
      {
        id: "hours",
        label: "Hours",
        type: "number",
        required: false,
        min: 0,
        step: 1,
      },
      {
        id: "minutes",
        label: "Minutes",
        type: "number",
        required: false,
        min: 0,
        max: 59,
        step: 1,
      },
      {
        id: "seconds",
        label: "Seconds",
        type: "number",
        required: false,
        min: 0,
        max: 59,
        step: 1,
      },
      {
        id: "book",
        label: "Book Name",
        type: "text",
        placeholder: "What book did you read?",
        required: true,
      },
      {
        id: "completedBook",
        label: "Book Completed",
        type: "select",
        required: true,
      },
      {
        id: "reflection",
        label: "Reflection",
        type: "text",
        placeholder: "Optional: What did you learn?",
        required: false,
      },
    ],

    scoreField: "totalMinutes",
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
        placeholder: "Distance in kilometres",
        required: true,
        min: 0.01,
        step: 0.01,
      },
      {
        id: "hours",
        label: "Hours",
        type: "number",
        required: false,
        min: 0,
        step: 1,
      },
      {
        id: "minutes",
        label: "Minutes",
        type: "number",
        required: false,
        min: 0,
        max: 59,
        step: 1,
      },
      {
        id: "seconds",
        label: "Seconds",
        type: "number",
        required: false,
        min: 0,
        max: 59,
        step: 1,
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

    unit: "workout",
    dailyGoal: 1,
    goalType: "higher",
  },

  {
    id: "lowerBody",
    name: "Lower Body",
    emoji: "🦵",

    unit: "workout",
    dailyGoal: 1,
    goalType: "higher",
  },

  {
    id: "core",
    name: "Core",
    emoji: "🔥",

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
        required: true,
      },
      {
        id: "hours",
        label: "Hours",
        type: "number",
        required: false,
        min: 0,
        step: 1,
      },
      {
        id: "minutes",
        label: "Minutes",
        type: "number",
        required: false,
        min: 0,
        max: 59,
        step: 1,
      },
      {
        id: "seconds",
        label: "Seconds",
        type: "number",
        required: false,
        min: 0,
        max: 59,
        step: 1,
      },
    ],

    scoreField: "totalMinutes",
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
        type: "select",
        required: true,
      },
      {
        id: "hours",
        label: "Hours",
        type: "number",
        required: false,
        min: 0,
        step: 1,
      },
      {
        id: "minutes",
        label: "Minutes",
        type: "number",
        required: false,
        min: 0,
        max: 59,
        step: 1,
      },
      {
        id: "seconds",
        label: "Seconds",
        type: "number",
        required: false,
        min: 0,
        max: 59,
        step: 1,
      },
    ],

    scoreField: "totalMinutes",
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
        required: true,
        min: 1,
        step: 1,
      },
    ],

    scoreField: "steps",
    unit: "steps",
    dailyGoal: 10000,
    goalType: "higher",
  },
];
