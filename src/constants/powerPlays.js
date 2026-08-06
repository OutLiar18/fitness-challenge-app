export const POWER_PLAY_POLICY_VERSION = "power-play-v1";

export const POWER_PLAY_MULTIPLIERS = Object.freeze([2, 3]);

export const POWER_PLAY_CATEGORY_TEMPLATES = Object.freeze([
  { id: "water", label: "Water", icon: "💧", fallbackTitle: "Water Surge" },
  { id: "fruit", label: "Fruit", icon: "🍎", fallbackTitle: "Fruit Harvest" },
  { id: "reading", label: "Reading", icon: "📚", fallbackTitle: "Reading Rush" },
  { id: "running", label: "Running", icon: "🏃", fallbackTitle: "Running Charge" },
  { id: "upperBody", label: "Upper Body", icon: "💪", fallbackTitle: "Upper Body Uprising" },
  { id: "lowerBody", label: "Lower Body", icon: "🦵", fallbackTitle: "Lower Body Drive" },
  { id: "core", label: "Core", icon: "🛡️", fallbackTitle: "Core Fortress" },
  { id: "cardio", label: "Cardio", icon: "❤️", fallbackTitle: "Cardio Storm" },
  { id: "skill", label: "Skill Development", icon: "🧠", fallbackTitle: "Skill Awakening" },
  { id: "steps", label: "Steps", icon: "👟", fallbackTitle: "Step Stampede" },
]);

export const POWER_PLAY_CATEGORY_IDS = Object.freeze(
  POWER_PLAY_CATEGORY_TEMPLATES.map((item) => item.id),
);

export const POWER_PLAY_MAX_POOL_SIZE = 40;
export const POWER_PLAY_MIN_NAME_LENGTH = 4;
export const POWER_PLAY_MAX_NAME_LENGTH = 80;
export const POWER_PLAY_MIN_DESCRIPTION_LENGTH = 10;
export const POWER_PLAY_MAX_DESCRIPTION_LENGTH = 260;
