export const TEAM_EMBLEMS = Object.freeze([
  { id: "legacy-banner", symbol: "⚑", name: "Legacy Banner" },
  { id: "iron-shield", symbol: "🛡️", name: "Iron Shield" },
  { id: "rising-phoenix", symbol: "🔥", name: "Rising Phoenix" },
  { id: "summit", symbol: "⛰️", name: "Summit" },
  { id: "lion-heart", symbol: "🦁", name: "Lion Heart" },
  { id: "storm", symbol: "⚡", name: "Storm" },
  { id: "oak", symbol: "🌳", name: "Steady Oak" },
  { id: "compass", symbol: "🧭", name: "True North" },
]);

export const DEFAULT_TEAM_EMBLEM_ID = "legacy-banner";
export const TEAM_MEMBER_LIMIT = 25;

export function getTeamEmblem(emblemId) {
  return (
    TEAM_EMBLEMS.find((emblem) => emblem.id === emblemId) ??
    TEAM_EMBLEMS[0]
  );
}

export function isValidTeamEmblemId(emblemId) {
  return TEAM_EMBLEMS.some((emblem) => emblem.id === emblemId);
}
