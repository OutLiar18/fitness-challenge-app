export const CATEGORIES = [
  {
    id: "water",
    name: "Water",
    emoji: "💧",
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
    unit: "reps",
    fields: [
      {
        id: "exercise",
        label: "Exercise",
        type: "select",
        required: true,
      },
      {
        id: "reps",
        label: "Repetitions",
        type: "number",
        placeholder: "20",
        required: true,
      },
    ],
  },

  {
    id: "lower_body",
    name: "Lower Body",
    emoji: "🦵",
    unit: "reps",
    fields: [
      {
        id: "exercise",
        label: "Exercise",
        type: "select",
        required: true,
      },
      {
        id: "reps",
        label: "Repetitions",
        type: "number",
        placeholder: "20",
        required: true,
      },
    ],
  },

  {
    id: "core",
    name: "Core",
    emoji: "🔥",
    unit: "reps",
    fields: [
      {
        id: "exercise",
        label: "Exercise",
        type: "select",
        required: true,
      },
      {
        id: "reps",
        label: "Repetitions",
        type: "number",
        placeholder: "20",
        required: true,
      },
    ],
  },

  {
    id: "cardio",
    name: "Cardio",
    emoji: "🚴",
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
