export const SEASON_HOUSE_LIMITS = Object.freeze({
  minimum: 2,
  maximum: 8,
});

export const HOUSE_VICE_CAPTAIN_LIMIT = 2;
export const LEADERSHIP_ELECTION_DURATION_HOURS = 24;
export const POCKET_WINDOW_DAYS = 7;
export const HOUSE_ROSTER_MOVES_PER_WEEK = 1;

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
  { id: "springbok", symbol: "🦌", name: "Springbok", family: "South African Animals" },
  { id: "lion", symbol: "🦁", name: "Lion", family: "Predators" },
  { id: "leopard", symbol: "🐆", name: "Leopard", family: "Predators" },
  { id: "rhino", symbol: "🦏", name: "Rhinoceros", family: "South African Animals" },
  { id: "elephant", symbol: "🐘", name: "Elephant", family: "South African Animals" },
  { id: "buffalo", symbol: "🐃", name: "Buffalo", family: "South African Animals" },
  { id: "eagle", symbol: "🦅", name: "Eagle", family: "Sky Hunters" },
  { id: "wolf", symbol: "🐺", name: "Wolf", family: "Predators" },
  { id: "shark", symbol: "🦈", name: "Shark", family: "Ocean" },
  { id: "phoenix", symbol: "🔥", name: "Phoenix", family: "Mythic" },
  { id: "dragon", symbol: "🐉", name: "Dragon", family: "Mythic" },
  { id: "storm", symbol: "⚡", name: "Storm", family: "Elements" },
  { id: "mountain", symbol: "⛰️", name: "Mountain", family: "Elements" },
  { id: "shield", symbol: "🛡️", name: "Shield", family: "Legacy" },
  { id: "crown", symbol: "👑", name: "Crown", family: "Legacy" },
  { id: "compass", symbol: "🧭", name: "Compass", family: "Legacy" },
  { id: "cobra", symbol: "🐍", name: "Cobra", family: "Predators" },
  { id: "tiger", symbol: "🐅", name: "Tiger", family: "Predators" },
  { id: "scorpion", symbol: "🦂", name: "Scorpion", family: "Desert" },
  { id: "bear", symbol: "🐻", name: "Bear", family: "Wildlands" },
  { id: "orca", symbol: "🐋", name: "Orca", family: "Ocean" },
  { id: "wave", symbol: "🌊", name: "Wave", family: "Elements" },
  { id: "volcano", symbol: "🌋", name: "Volcano", family: "Elements" },
  { id: "moon", symbol: "🌙", name: "Moon", family: "Cosmic" },
  { id: "planet", symbol: "🪐", name: "Planet", family: "Cosmic" },
  { id: "comet", symbol: "☄️", name: "Comet", family: "Cosmic" },
  { id: "rocket", symbol: "🚀", name: "Rocket", family: "Future" },
  { id: "diamond", symbol: "💎", name: "Diamond", family: "Legacy" },
  { id: "anchor", symbol: "⚓", name: "Anchor", family: "Voyagers" },
  { id: "swords", symbol: "⚔️", name: "Crossed Swords", family: "Warriors" },
  { id: "oak", symbol: "🌳", name: "Ancient Tree", family: "Nature" },
  { id: "mask", symbol: "🎭", name: "Mask", family: "Legends" },
]);

export const HOUSE_ACCENTS = Object.freeze([
  { id: "emerald", label: "Emerald", value: "#15996a" },
  { id: "sapphire", label: "Sapphire", value: "#2877c8" },
  { id: "sunstone", label: "Sunstone", value: "#d78417" },
  { id: "amethyst", label: "Amethyst", value: "#7a52bf" },
  { id: "crimson", label: "Crimson", value: "#be4056" },
  { id: "teal", label: "Teal", value: "#168a91" },
  { id: "slate", label: "Slate", value: "#526278" },
  { id: "rose", label: "Rose", value: "#b75b88" },
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
