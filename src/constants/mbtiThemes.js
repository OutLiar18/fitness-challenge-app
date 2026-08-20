const palettes = [
  {
    type: "ISTJ",
    label: "Ironbound Navy",
    primaryControl: "#334155",
    primaryBright: "#94a3b8",
    secondary: "#1d4ed8",
    secondaryBright: "#60a5fa",
  },
  {
    type: "ISFJ",
    label: "Amber Bastion",
    primaryControl: "#92400e",
    primaryBright: "#f59e0b",
    secondary: "#7f1d1d",
    secondaryBright: "#f87171",
  },
  {
    type: "INFJ",
    label: "Eclipsed Indigo",
    primaryControl: "#3730a3",
    primaryBright: "#818cf8",
    secondary: "#8a6b22",
    secondaryBright: "#e5c56f",
  },
  {
    type: "INTJ",
    label: "Obsidian Violet",
    primaryControl: "#5b21b6",
    primaryBright: "#a78bfa",
    secondary: "#111827",
    secondaryBright: "#c4b5fd",
  },
  {
    type: "ISTP",
    label: "Runeforged Ember",
    primaryControl: "#9a3412",
    primaryBright: "#fb923c",
    secondary: "#57534e",
    secondaryBright: "#a8a29e",
  },
  {
    type: "ISFP",
    label: "Moonveil Teal",
    primaryControl: "#0f766e",
    primaryBright: "#5eead4",
    secondary: "#64748b",
    secondaryBright: "#cbd5e1",
  },
  {
    type: "INFP",
    label: "Ethereal Grove",
    primaryControl: "#166534",
    primaryBright: "#4ade80",
    secondary: "#7c3aed",
    secondaryBright: "#c4b5fd",
  },
  {
    type: "INTP",
    label: "Astral Indigo",
    primaryControl: "#4338ca",
    primaryBright: "#818cf8",
    secondary: "#64748b",
    secondaryBright: "#cbd5e1",
  },
  {
    type: "ESTP",
    label: "Stormforged Blue",
    primaryControl: "#1d4ed8",
    primaryBright: "#60a5fa",
    secondary: "#475569",
    secondaryBright: "#94a3b8",
  },
  {
    type: "ESFP",
    label: "Carnival Royal",
    primaryControl: "#7e22ce",
    primaryBright: "#c084fc",
    secondary: "#a16207",
    secondaryBright: "#facc15",
  },
  {
    type: "ENFP",
    label: "Aurora Teal",
    primaryControl: "#0f766e",
    primaryBright: "#2dd4bf",
    secondary: "#be185d",
    secondaryBright: "#f472b6",
  },
  {
    type: "ENTP",
    label: "Prismatic Violet",
    primaryControl: "#6d28d9",
    primaryBright: "#a78bfa",
    secondary: "#0e7490",
    secondaryBright: "#22d3ee",
  },
  {
    type: "ESTJ",
    label: "Marshal Scarlet",
    primaryControl: "#b91c1c",
    primaryBright: "#f87171",
    secondary: "#475569",
    secondaryBright: "#cbd5e1",
  },
  {
    type: "ESFJ",
    label: "Harvest Gold",
    primaryControl: "#a16207",
    primaryBright: "#fbbf24",
    secondary: "#be123c",
    secondaryBright: "#fb7185",
  },
  {
    type: "ENFJ",
    label: "Solar Gold",
    primaryControl: "#a16207",
    primaryBright: "#facc15",
    secondary: "#b91c1c",
    secondaryBright: "#f87171",
  },
  {
    type: "ENTJ",
    label: "Griffin Crimson",
    primaryControl: "#991b1b",
    primaryBright: "#ef4444",
    secondary: "#a16207",
    secondaryBright: "#facc15",
  },
];

export const MBTI_THEME_PALETTES = Object.freeze(
  palettes.map((palette) => Object.freeze(palette)),
);

const PALETTE_BY_TYPE = new Map(
  MBTI_THEME_PALETTES.map((palette) => [palette.type, palette]),
);

export function getMbtiThemeByType(type) {
  const normalized = String(type ?? "").trim().toUpperCase();
  return PALETTE_BY_TYPE.get(normalized) ?? null;
}
