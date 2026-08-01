import { DIFFICULTY } from "../../constants/libraries/difficulty";
import { normalizeLibraryText } from "../../utils/libraryTextUtils";

function normalizeDifficulty(definition = {}) {
  const tierValue = Number(
    definition.tier ||
      definition.proposedTier ||
      definition.difficulty?.tier,
  );

  const tier =
    Number.isInteger(tierValue) && tierValue >= 1 && tierValue <= 5
      ? tierValue
      : 1;

  return DIFFICULTY[`TIER_${tier}`] ?? DIFFICULTY.TIER_1;
}

function normalizeExerciseDefinition(definition = {}) {
  const difficulty = normalizeDifficulty(definition);
  const exerciseType =
    definition.exerciseType === "hold" || definition.type === "hold"
      ? "hold"
      : "repetition";

  return {
    ...definition,
    name: String(definition.name ?? "").trim(),
    category: String(definition.category ?? "").trim(),
    exerciseType,
    type: exerciseType === "hold" ? "hold" : "dynamic",
    tier: difficulty.tier,
    difficulty,
    secondsPerRep:
      exerciseType === "hold" && Number(definition.secondsPerRep) > 0
        ? Number(definition.secondsPerRep)
        : 10,
    aliases: Array.isArray(definition.aliases) ? definition.aliases : [],
    primaryMuscles: Array.isArray(definition.primaryMuscles)
      ? definition.primaryMuscles
      : [],
    secondaryMuscles: Array.isArray(definition.secondaryMuscles)
      ? definition.secondaryMuscles
      : [],
  };
}

function normalizeCardioDefinition(definition = {}) {
  const difficulty = normalizeDifficulty(definition);

  return {
    ...definition,
    name: String(definition.name ?? "").trim(),
    group: String(definition.group ?? "Other").trim() || "Other",
    cardioType: String(definition.cardioType ?? "").trim(),
    environment: String(definition.environment ?? "").trim(),
    equipment: String(definition.equipment ?? "").trim(),
    tier: difficulty.tier,
    difficulty,
  };
}

function normalizeSkillDefinition(definition = {}) {
  return {
    ...definition,
    name: String(definition.name ?? "").trim(),
    area: String(definition.area ?? "").trim(),
    tags: Array.isArray(definition.tags)
      ? definition.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [],
  };
}

export function normalizePublishedLibraryItem(item = {}) {
  const itemType = item.itemType ?? "";
  const rawDefinition = item.definition ?? {};

  const definition =
    itemType === "exercise"
      ? normalizeExerciseDefinition(rawDefinition)
      : itemType === "cardio"
        ? normalizeCardioDefinition(rawDefinition)
        : normalizeSkillDefinition(rawDefinition);

  return {
    ...item,
    itemType,
    name: definition.name,
    normalizedName:
      item.normalizedName || normalizeLibraryText(definition.name),
    definition,
  };
}

export function sortPublishedLibraryItems(items = []) {
  return [...items].sort((first, second) => {
    const typeDifference = first.itemType.localeCompare(second.itemType);

    if (typeDifference !== 0) {
      return typeDifference;
    }

    return first.name.localeCompare(second.name);
  });
}

export function getPublishedItemsByType(items = [], itemType) {
  return items.filter((item) => item.itemType === itemType);
}

export function findPublishedLibraryItem(items = [], itemType, name) {
  const normalizedName = normalizeLibraryText(name);

  return (
    items.find(
      (item) =>
        item.itemType === itemType &&
        item.normalizedName === normalizedName,
    ) ?? null
  );
}

export function mergeLibraryNames(staticNames = [], publishedItems = []) {
  return [...new Set([
    ...staticNames,
    ...publishedItems.map((item) => item.name).filter(Boolean),
  ])].sort((first, second) => first.localeCompare(second));
}

export function groupCardioLibraryItems(
  staticGroups = [],
  publishedItems = [],
) {
  const groups = new Map(
    staticGroups.map((group) => [group.group, new Set(group.options)]),
  );

  publishedItems.forEach((item) => {
    const groupName = item.definition?.group || "Other";

    if (!groups.has(groupName)) {
      groups.set(groupName, new Set());
    }

    groups.get(groupName).add(item.name);
  });

  return [...groups.entries()]
    .map(([group, options]) => ({
      group,
      options: [...options].sort((first, second) =>
        first.localeCompare(second),
      ),
    }))
    .sort((first, second) => {
      if (first.group === "Other") {
        return 1;
      }

      if (second.group === "Other") {
        return -1;
      }

      return first.group.localeCompare(second.group);
    });
}
