export const CATEGORIES = [
  {
    id: "water",
    name: "Water",
    emoji: "💧",
    scoreField: "amount",
    unit: "ml",
    fields: [
      {
        id: "amount",
        label: "Amount",
        type: "number",
        placeholder: "500",
        required: true,
      },
    ],
  },

  {
    id: "fruit",
    name: "Fruit",
    emoji: "🍎",
    scoreField: "quantity",
    unit: "fruit",
    fields: [
      {
        id: "fruitType",
        label: "Fruit",
        type: "select",
        required: true,
      },
      {
        id: "quantity",
        label: "Quantity",
        type: "number",
        placeholder: "1",
        required: true,
      },
    ],
  },

  {
    id: "reading",
    name: "Reading",
    emoji: "📚",
    scoreField: "minutes",
    unit: "minutes",
    fields: [
      {
        id: "book",
        label: "Book Title",
        type: "text",
        placeholder: "Atomic Habits",
        required: true,
      },
      {
        id: "minutes",
        label: "Minutes",
        type: "number",
        placeholder: "30",
        required: true,
      },
      {
        id: "reflection",
        label: "Reflection",
        type: "textarea",
        required: true,
      },
    ],
  },

  {
    id: "running",
    name: "Running",
    emoji: "🏃",
    scoreField: "distance",
    unit: "km",
    fields: [
      {
        id: "distance",
        label: "Distance (km)",
        type: "number",
        placeholder: "5",
        required: true,
      },
      {
        id: "time",
        label: "Time (minutes)",
        type: "number",
        placeholder: "30",
        required: true,
      },
    ],
  },

  {
    id: "upper_body",
    name: "Upper Body",
    emoji: "💪",
    scoreField: "null",
    unit: "reps",
    proof: "none",
    fields: [
      {
        id: "exercise",
        label: "Exercise",
        type: "select",
        required: true,
        allowCustomValues: true,
      },
      {
        id: "sets",
        label: "Sets",
        type: "number",
        required: true,
      },
      {
        id: "reps",
        label: "Reps",
        type: "number",
        required: true,
      },
      {
        id: "weight",
        label: "Weight (kg) (Optional)",
        type: "number",
        required: false,
      },
      {
        id: "duration",
        label: "Duration (minutes) (Optional)",
        type: "number",
        required: false,
      },
      {
        id: "notes",
        label: "Notes (Optional)",
        type: "textarea",
        required: false,
      },
    ],
  },

  {
    id: "lower_body",
    name: "Lower Body",
    emoji: "🦵",
    scoreField: "null",
    unit: "reps",
    proof: "none",
    fields: [
      {
        id: "exercise",
        label: "Exercise",
        type: "select",
        required: true,
        allowCustomValues: true,
      },
      {
        id: "sets",
        label: "Sets",
        type: "number",
        required: true,
      },
      {
        id: "reps",
        label: "Reps",
        type: "number",
        required: true,
      },
      {
        id: "weight",
        label: "Weight (kg) (Optional)",
        type: "number",
        required: false,
      },
      {
        id: "duration",
        label: "Duration (minutes) (Optional)",
        type: "number",
        required: false,
      },
      {
        id: "notes",
        label: "Notes (Optional)",
        type: "textarea",
        required: false,
      },
    ],
  },

  {
    id: "core",
    name: "Core",
    emoji: "🔥",
    scoreField: "null",
    unit: "reps",
    proof: "none",
    fields: [
      {
        id: "exercise",
        label: "Exercise",
        type: "select",
        required: true,
        allowCustomValues: true,
      },
      {
        id: "sets",
        label: "Sets",
        type: "number",
        required: true,
      },
      {
        id: "reps",
        label: "Reps",
        type: "number",
        required: true,
      },
      {
        id: "weight",
        label: "Weight (kg) (Optional)",
        type: "number",
        required: false,
      },
      {
        id: "duration",
        label: "Duration (minutes) (Optional)",
        type: "number",
        required: false,
      },
      {
        id: "notes",
        label: "Notes (Optional)",
        type: "textarea",
        required: false,
      },
    ],
  },

  {
    id: "cardio",
    name: "Cardio",
    emoji: "🚴",
    scoreField: "duration",
    unit: "minutes",
    fields: [
      {
        id: "activity",
        label: "Activity",
        type: "select",
        required: true,
      },
      {
        id: "minutes",
        label: "Minutes",
        type: "number",
        placeholder: "30",
        required: true,
      },
    ],
  },

  {
    id: "skill",
    name: "Skill",
    emoji: "🎯",
    scoreField: "duration",
    unit: "minutes",
    fields: [
      {
        id: "skill",
        label: "Skill",
        type: "select",
        placeholder: "Guitar",
        required: true,
      },
      {
        id: "minutes",
        label: "Minutes",
        type: "number",
        placeholder: "60",
        required: true,
      },
    ],
  },

  {
    id: "steps",
    name: "Steps",
    emoji: "👣",
    scoreField: "steps",
    unit: "steps",
    fields: [
      {
        id: "steps",
        label: "Steps",
        type: "number",
        placeholder: "10000",
        required: true,
      },
    ],
  },
];
