export const DEFAULT_AVATAR_ID = "legacy-trophy";

export const LEGACY_AVATARS = Object.freeze([
  {
    id: "legacy-trophy",
    name: "Legacy Trophy",
    symbol: "🏆",
    primary: "#f2b84b",
    secondary: "#fff4cf",
    description: "For players who suspect every ordinary day is secretly a final.",
  },
  {
    id: "phoenix-rise",
    name: "Phoenix Rise",
    symbol: "🦅",
    primary: "#f26b4b",
    secondary: "#ffe0d7",
    description: "For impressive comebacks and suspicious amounts of determination.",
  },
  {
    id: "iron-shield",
    name: "Iron Shield",
    symbol: "🛡️",
    primary: "#496789",
    secondary: "#dfeaf5",
    description: "Steady, dependable and unlikely to skip leg day on purpose.",
  },
  {
    id: "storm-runner",
    name: "Storm Runner",
    symbol: "⚡",
    primary: "#3157d5",
    secondary: "#dce5ff",
    description: "Fast enough to outrun one bad excuse, perhaps two.",
  },
  {
    id: "wild-lion",
    name: "Wild Lion",
    symbol: "🦁",
    primary: "#c47a22",
    secondary: "#ffebca",
    description: "Confident, courageous and legally required to have excellent posture.",
  },
  {
    id: "night-wolf",
    name: "Night Wolf",
    symbol: "🐺",
    primary: "#4d4d74",
    secondary: "#e2e2f1",
    description: "Quiet consistency with a completely reasonable amount of moonlight.",
  },
  {
    id: "wisdom-keeper",
    name: "Wisdom Keeper",
    symbol: "📚",
    primary: "#7650a8",
    secondary: "#eadffc",
    description: "For readers who collect lessons faster than bookmarks.",
  },
  {
    id: "water-guardian",
    name: "Water Guardian",
    symbol: "💧",
    primary: "#2789bd",
    secondary: "#d9f2ff",
    description: "Hydrated, vigilant and emotionally invested in refillable bottles.",
  },
  {
    id: "forge-master",
    name: "Forge Master",
    symbol: "🔨",
    primary: "#8f4a38",
    secondary: "#f4ddd7",
    description: "Built one honest repetition at a time.",
  },
  {
    id: "summit-falcon",
    name: "Summit Falcon",
    symbol: "🦅",
    primary: "#18885b",
    secondary: "#dff5ea",
    description: "Focused on the next height, not the dramatic weather report.",
  },
  {
    id: "ember-heart",
    name: "Ember Heart",
    symbol: "🔥",
    primary: "#d0444f",
    secondary: "#ffe0e3",
    description: "Small flame, remarkable persistence, zero interest in giving up quietly.",
  },
  {
    id: "crowned-champion",
    name: "Crowned Champion",
    symbol: "👑",
    primary: "#9a6410",
    secondary: "#fff0c8",
    description: "A royal reminder that consistency still outranks natural talent.",
  },
]);

const AVATAR_MAP = new Map(
  LEGACY_AVATARS.map((avatar) => [avatar.id, avatar]),
);

export function getAvatarById(avatarId) {
  return AVATAR_MAP.get(avatarId) ?? AVATAR_MAP.get(DEFAULT_AVATAR_ID);
}

export function isValidAvatarId(avatarId) {
  return AVATAR_MAP.has(avatarId);
}
