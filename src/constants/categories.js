export const CATEGORIES = [
  {
    id: "water",
    name: "Water",
    emoji: "💧",
    unit: "ml",
    proof: "optional",
    fields: [
      {
        id: "amount",
        label: "Amount",
        type: "number",
        placeholder: "500",
      },
      {
        id: "photo",
        label: "Photo",
        type: "image",
        required: false,
      },
    ],
  },

  {
    id: "fruit",
    name: "Fruit",
    emoji: "🍎",
    unit: "fruit",
    proof: "optional",
    fields: [
      {
        id: "fruitType",
        label: "Fruit",
        type: "select",
      },
      {
        id: "quantity",
        label: "Quantity",
        type: "number",
      },
      {
        id: "photo",
        label: "Photo",
        type: "image",
        required: false,
      },
    ],
  },

  {
    id: "reading",
    name: "Reading",
    emoji: "📚",
    unit: "minutes",
    proof: "none",
    fields: [
      {
        id: "book",
        label: "Book Title",
        type: "text",
      },
      {
        id: "minutes",
        label: "Minutes",
        type: "number",
      },
      {
        id: "reflection",
        label: "Reflection",
        type: "textarea",
      },
    ],
  },

  {
    id: "running",
    name: "Running",
    emoji: "🏃",
    unit: "km",
    proof: "required",
    fields: [
      {
        id: "distance",
        label: "Distance (km)",
        type: "number",
      },
      {
        id: "time",
        label: "Time (minutes)",
        type: "number",
      },
      {
        id: "proof",
        label: "Run Screenshot",
        type: "image",
        required: true,
      },
    ],
  },

  {
    id: "upper_body",
    name: "Upper Body",
    emoji: "💪",
    unit: "reps",
    proof: "none",
    fields: [],
  },

  {
    id: "lower_body",
    name: "Lower Body",
    emoji: "🦵",
    unit: "reps",
    proof: "none",
    fields: [],
  },

  {
    id: "core",
    name: "Core",
    emoji: "🔥",
    unit: "reps",
    proof: "none",
    fields: [],
  },

  {
    id: "cardio",
    name: "Cardio",
    emoji: "🚴",
    unit: "minutes",
    proof: "optional",
    fields: [],
  },

  {
    id: "skill",
    name: "Skill",
    emoji: "🎯",
    unit: "minutes",
    proof: "optional",
    fields: [],
  },

  {
    id: "steps",
    name: "Steps",
    emoji: "👣",
    unit: "steps",
    proof: "required",
    fields: [],
  },
];