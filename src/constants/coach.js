export const COACH_TONES = Object.freeze([
  { id: "gentle", label: "Gentle encouragement" },
  { id: "balanced", label: "Balanced guidance" },
  { id: "direct", label: "Direct and practical" },
]);

export const COACH_FOCUSES = Object.freeze([
  { id: "balanced", label: "Balanced growth" },
  { id: "consistency", label: "Consistency" },
  { id: "fitness", label: "Fitness" },
  { id: "learning", label: "Learning" },
]);

export const DEFAULT_COACH_PREFERENCES = Object.freeze({
  enabled: true,
  tone: "balanced",
  focus: "balanced",
});
