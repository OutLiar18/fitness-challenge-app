export const SEASON_HOUSE_LIMITS = Object.freeze({
  minimum: 2,
  maximum: 8,
});

export const HOUSE_VICE_CAPTAIN_LIMIT = 2;
export const LEADERSHIP_ELECTION_DURATION_HOURS = 24;
export const POCKET_WINDOW_DAYS = 7;
export const HOUSE_ROSTER_MOVES_PER_WEEK = 1;
export const HOUSE_ROSTER_PLAYER_REST_WEEKS = 1;
export const HOUSE_MOVEMENT_POLICY_VERSION = "house-movement-v1";
export const HOUSE_COMPOSITION_PROFILE_VERSION = "season-composition-v1";
export const HOUSE_COMPOSITION_DISCLOSURE_MINIMUM = 3;
export const HOUSE_BALANCE_CALCULATION_VERSION = "house-balance-v1";

export const HOUSE_COMPOSITION_OPTIONS = Object.freeze([
  { id: "woman", label: "Woman" },
  { id: "man", label: "Man" },
  { id: "non-binary-or-another", label: "Non-binary or another identity" },
  { id: "prefer-not-to-say", label: "Prefer not to say" },
]);

export const HOUSE_COMPOSITION_VALUES = Object.freeze(
  HOUSE_COMPOSITION_OPTIONS.map((option) => option.id),
);

export const SEASON_PHASES = Object.freeze({
  DRAFT: "draft",
  REGISTRATION: "registration",
  POCKET: "pocket",
  ACTIVE: "active",
  COMPLETED: "completed",
  ARCHIVED: "archived",
});

export const SEASON_MODULES_V2 = Object.freeze({
  houses: true,
  chaosAssignment: true,
  leadershipElections: true,
  rosterSwaps: true,
  pocketWeek: true,
  powerPlay: false,
  transferMarket: false,
  buddyBonus: false,
  fiveFires: false,
});

export const SEASON_MODULES = Object.freeze({
  ...SEASON_MODULES_V2,
  powerPlay: true,
});

export const HOUSE_EMBLEMS = Object.freeze([
  { id: "springbok", symbol: "\ud83e\udd8c", name: "Springbok", family: "South African Animals" },
  { id: "lion", symbol: "\ud83e\udd81", name: "Lion", family: "Predators" },
  { id: "leopard", symbol: "\ud83d\udc06", name: "Leopard", family: "Predators" },
  { id: "rhino", symbol: "\ud83e\udd8f", name: "Rhinoceros", family: "South African Animals" },
  { id: "elephant", symbol: "\ud83d\udc18", name: "Elephant", family: "South African Animals" },
  { id: "buffalo", symbol: "\ud83d\udc03", name: "Buffalo", family: "South African Animals" },
  { id: "eagle", symbol: "\ud83e\udd85", name: "Eagle", family: "Sky Hunters" },
  { id: "wolf", symbol: "\ud83d\udc3a", name: "Wolf", family: "Predators" },
  { id: "shark", symbol: "\ud83e\udd88", name: "Shark", family: "Ocean" },
  { id: "phoenix", symbol: "\ud83d\udd25", name: "Phoenix", family: "Mythic" },
  { id: "dragon", symbol: "\ud83d\udc09", name: "Dragon", family: "Mythic" },
  { id: "storm", symbol: "\u26a1", name: "Storm", family: "Elements" },
  { id: "mountain", symbol: "\u26f0\ufe0f", name: "Mountain", family: "Elements" },
  { id: "shield", symbol: "\ud83d\udee1\ufe0f", name: "Shield", family: "Legacy" },
  { id: "crown", symbol: "\ud83d\udc51", name: "Crown", family: "Legacy" },
  { id: "compass", symbol: "\ud83e\udded", name: "Compass", family: "Legacy" },
  { id: "cobra", symbol: "\ud83d\udc0d", name: "Cobra", family: "Predators" },
  { id: "tiger", symbol: "\ud83d\udc05", name: "Tiger", family: "Predators" },
  { id: "scorpion", symbol: "\ud83e\udd82", name: "Scorpion", family: "Desert" },
  { id: "bear", symbol: "\ud83d\udc3b", name: "Bear", family: "Wildlands" },
  { id: "orca", symbol: "\ud83d\udc0b", name: "Orca", family: "Ocean" },
  { id: "wave", symbol: "\ud83c\udf0a", name: "Wave", family: "Elements" },
  { id: "volcano", symbol: "\ud83c\udf0b", name: "Volcano", family: "Elements" },
  { id: "moon", symbol: "\ud83c\udf19", name: "Moon", family: "Cosmic" },
  { id: "planet", symbol: "\ud83e\ude90", name: "Planet", family: "Cosmic" },
  { id: "comet", symbol: "\u2604\ufe0f", name: "Comet", family: "Cosmic" },
  { id: "rocket", symbol: "\ud83d\ude80", name: "Rocket", family: "Future" },
  { id: "diamond", symbol: "\ud83d\udc8e", name: "Diamond", family: "Legacy" },
  { id: "anchor", symbol: "\u2693", name: "Anchor", family: "Voyagers" },
  { id: "swords", symbol: "\u2694\ufe0f", name: "Crossed Swords", family: "Warriors" },
  { id: "oak", symbol: "\ud83c\udf33", name: "Ancient Tree", family: "Nature" },
  { id: "mask", symbol: "\ud83c\udfad", name: "Mask", family: "Legends" },
  { id: "raven", symbol: "\ud83d\udc26\u200d\u2b1b", name: "Raven", family: "Night Hunters" },
  { id: "owl", symbol: "\ud83e\udd89", name: "Owl", family: "Night Hunters" },
  { id: "fox", symbol: "\ud83e\udd8a", name: "Fox", family: "Wildlands" },
  { id: "boar", symbol: "\ud83d\udc17", name: "Boar", family: "Wildlands" },
  { id: "crocodile", symbol: "\ud83d\udc0a", name: "Crocodile", family: "Predators" },
  { id: "gorilla", symbol: "\ud83e\udd8d", name: "Gorilla", family: "Titans" },
  { id: "kraken", symbol: "\ud83d\udc19", name: "Kraken", family: "Ocean" },
  { id: "bat", symbol: "\ud83e\udd87", name: "Bat", family: "Night Hunters" },
  { id: "ram", symbol: "\ud83d\udc0f", name: "Ram", family: "Highlands" },
  { id: "bull", symbol: "\ud83d\udc02", name: "Bull", family: "Titans" },
  { id: "stallion", symbol: "\ud83d\udc0e", name: "Stallion", family: "Wildlands" },
  { id: "spider", symbol: "\ud83d\udd77\ufe0f", name: "Spider", family: "Night Hunters" },
  { id: "trident", symbol: "\ud83d\udd31", name: "Trident", family: "Warriors" },
  { id: "axe", symbol: "\ud83e\ude93", name: "War Axe", family: "Warriors" },
  { id: "hammer", symbol: "\ud83d\udd28", name: "War Hammer", family: "Warriors" },
  { id: "castle", symbol: "\ud83c\udff0", name: "Citadel", family: "Legacy" },
  { id: "fleur", symbol: "\u269c\ufe0f", name: "Fleur-de-lis", family: "Legacy" },
  { id: "sun", symbol: "\u2600\ufe0f", name: "Sun", family: "Cosmic" },
  { id: "star", symbol: "\u2b50", name: "Star", family: "Cosmic" },
  { id: "snowflake", symbol: "\u2744\ufe0f", name: "Frost", family: "Elements" },
  { id: "tornado", symbol: "\ud83c\udf2a\ufe0f", name: "Tempest", family: "Elements" },
  { id: "lotus", symbol: "\ud83e\udeb7", name: "Lotus", family: "Nature" },
  { id: "skull", symbol: "\ud83d\udc80", name: "Skull", family: "Legends" },
  { id: "feather", symbol: "\ud83e\udeb6", name: "Feather", family: "Voyagers" },
]);
export const HOUSE_ACCENTS = Object.freeze([
  { id: "emerald", label: "Emerald", value: "#15996a", secondary: "#6ee7b7" },
  { id: "jade", label: "Jade", value: "#0f9f7a", secondary: "#77e6c7" },
  { id: "viridian", label: "Viridian", value: "#0c8068", secondary: "#5fd2b0" },
  { id: "sapphire", label: "Sapphire", value: "#2877c8", secondary: "#80b9ff" },
  { id: "cobalt", label: "Cobalt", value: "#3b5fd4", secondary: "#92a7ff" },
  { id: "cerulean", label: "Cerulean", value: "#168fc8", secondary: "#74d0f5" },
  { id: "teal", label: "Teal", value: "#168a91", secondary: "#72d9de" },
  { id: "turquoise", label: "Turquoise", value: "#12a59d", secondary: "#77e8df" },
  { id: "amethyst", label: "Amethyst", value: "#7a52bf", secondary: "#c2a4ff" },
  { id: "violet", label: "Violet", value: "#6b4fd2", secondary: "#aa96ff" },
  { id: "indigo", label: "Indigo", value: "#4c5fb8", secondary: "#95a3ff" },
  { id: "crimson", label: "Crimson", value: "#be4056", secondary: "#ff8799" },
  { id: "scarlet", label: "Scarlet", value: "#c84638", secondary: "#ff9285" },
  { id: "ruby", label: "Ruby", value: "#b72d57", secondary: "#f47a9d" },
  { id: "rose", label: "Rose", value: "#b75b88", secondary: "#f0a2c9" },
  { id: "magenta", label: "Magenta", value: "#b143a8", secondary: "#ef8ee2" },
  { id: "sunstone", label: "Sunstone", value: "#d78417", secondary: "#ffc56b" },
  { id: "amber", label: "Amber", value: "#cf9012", secondary: "#ffd36a" },
  { id: "gold", label: "Gold", value: "#bd9a2f", secondary: "#ecd271" },
  { id: "copper", label: "Copper", value: "#b86c3d", secondary: "#e9a37b" },
  { id: "bronze", label: "Bronze", value: "#92703f", secondary: "#cfa975" },
  { id: "slate", label: "Slate", value: "#526278", secondary: "#a8b4c6" },
  { id: "obsidian", label: "Obsidian", value: "#4b4854", secondary: "#918a9e" },
  { id: "frost", label: "Frost", value: "#5f8fa4", secondary: "#a7d8e8" },
]);
export const DEFAULT_HOUSE_EMBLEM_ID = "springbok";
export const DEFAULT_HOUSE_ACCENT_ID = "emerald";

export const POCKET_CATEGORY_CONFIG = Object.freeze({
  water: { label: "Water", unit: "millilitres", mode: "partial", field: "amount", step: 50 },
  fruit: { label: "Fruit", unit: "servings", mode: "partial", field: "servings", step: 1 },
  reading: { label: "Reading", unit: "minutes", mode: "partial", field: "totalMinutes", step: 1 },
  skill: { label: "Skill Development", unit: "minutes", mode: "partial", field: "totalMinutes", step: 1 },
  cardio: { label: "Cardio", unit: "minutes", mode: "partial", field: "totalMinutes", step: 1 },
  steps: { label: "Steps", unit: "steps", mode: "partial", field: "steps", step: 100 },
  running: { label: "Running", unit: "stored runs", mode: "whole", field: "distance", step: 1 },
  upperBody: { label: "Upper Body", unit: "stored sessions", mode: "whole", field: "exercises", step: 1 },
  core: { label: "Core", unit: "stored sessions", mode: "whole", field: "exercises", step: 1 },
  lowerBody: { label: "Lower Body", unit: "stored sessions", mode: "whole", field: "exercises", step: 1 },
});

export function getHouseEmblem(emblemId) {
  return HOUSE_EMBLEMS.find((item) => item.id === emblemId) ?? HOUSE_EMBLEMS[0];
}

export function getHouseAccent(accentId) {
  return HOUSE_ACCENTS.find((item) => item.id === accentId) ?? HOUSE_ACCENTS[0];
}

export function getHouseThemeStyle(houseOrAccentId) {
  const accentId = typeof houseOrAccentId === "string"
    ? houseOrAccentId
    : houseOrAccentId?.accentId;
  const accent = getHouseAccent(accentId);

  return {
    "--house-accent": accent.value,
    "--house-secondary": accent.secondary,
  };
}
