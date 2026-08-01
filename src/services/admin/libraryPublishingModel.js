import { DIFFICULTY } from "../../constants/libraries/difficulty";
import {
  MAX_LIBRARY_ITEMS_PER_RELEASE,
  isGlobalLibraryItemType,
} from "../../constants/libraryPublishing";
import { getCardioActivity } from "../libraries/cardioLibraryService";
import { getExercise } from "../libraries/exerciseLibraryService";
import { getSkill } from "../libraries/skillLibraryService";
import {
  cleanLibraryText,
  createLibraryItemId,
  normalizeLibraryText,
} from "../../utils/libraryTextUtils";

export function getSuggestionLibraryType(suggestion = {}) {
  if (suggestion.kind === "exercise") {
    return "exercise";
  }

  return suggestion.itemType === "cardio" ? "cardio" : "skill";
}

export function validateLibraryVersion(value) {
  const version = cleanLibraryText(value);
  const valid = /^\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/i.test(version);

  return {
    valid,
    value: version,
    error: valid
      ? ""
      : "Use a semantic version such as 0.10.0 or 0.10.0-preview.1.",
  };
}

export function createLibraryReleaseId(version) {
  const validation = validateLibraryVersion(version);

  if (!validation.valid) {
    throw new Error(validation.error);
  }

  return `release_${validation.value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

export function validateLibraryReleaseDraft({
  version,
  notes,
  suggestions,
} = {}) {
  const versionValidation = validateLibraryVersion(version);
  const normalizedNotes = cleanLibraryText(notes).slice(0, 1000);
  const selectedSuggestions = Array.isArray(suggestions) ? suggestions : [];
  const errors = [];

  if (!versionValidation.valid) {
    errors.push(versionValidation.error);
  }

  if (normalizedNotes.length < 10) {
    errors.push(
      "Add release notes explaining what is being published and why.",
    );
  }

  if (selectedSuggestions.length === 0) {
    errors.push("Select at least one approved suggestion to publish.");
  } else if (selectedSuggestions.length > MAX_LIBRARY_ITEMS_PER_RELEASE) {
    errors.push(
      `Publish no more than ${MAX_LIBRARY_ITEMS_PER_RELEASE} library items at once.`,
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    version: versionValidation.value,
    notes: normalizedNotes,
    suggestions: selectedSuggestions,
  };
}

function resolveDifficulty(definition = {}) {
  const tier = Number(
    definition.tier ||
      definition.proposedTier ||
      definition.difficulty?.tier,
  );

  return DIFFICULTY[`TIER_${tier}`] ?? null;
}

function normalizeExerciseDefinition(definition = {}) {
  const difficulty = resolveDifficulty(definition);
  const exerciseType =
    definition.exerciseType === "hold" || definition.type === "hold"
      ? "hold"
      : "repetition";

  return {
    name: cleanLibraryText(definition.name),
    aliases: Array.isArray(definition.aliases)
      ? definition.aliases.map(cleanLibraryText).filter(Boolean)
      : [],
    category: cleanLibraryText(definition.category),
    type: exerciseType === "hold" ? "hold" : "dynamic",
    exerciseType,
    tier: difficulty?.tier ?? 1,
    difficulty: difficulty ?? DIFFICULTY.TIER_1,
    secondsPerRep:
      exerciseType === "hold" && Number(definition.secondsPerRep) > 0
        ? Number(definition.secondsPerRep)
        : 10,
    equipment: cleanLibraryText(definition.equipment),
    movementPattern: cleanLibraryText(definition.movementPattern),
    primaryMuscles: Array.isArray(definition.primaryMuscles)
      ? definition.primaryMuscles.map(cleanLibraryText).filter(Boolean)
      : [],
    secondaryMuscles: Array.isArray(definition.secondaryMuscles)
      ? definition.secondaryMuscles.map(cleanLibraryText).filter(Boolean)
      : [],
    analyticsName: cleanLibraryText(definition.name),
  };
}

function normalizeCardioDefinition(definition = {}) {
  const difficulty = resolveDifficulty(definition);

  return {
    name: cleanLibraryText(definition.name),
    group: cleanLibraryText(definition.group) || "Other",
    cardioType: cleanLibraryText(definition.cardioType),
    environment: cleanLibraryText(definition.environment),
    equipment: cleanLibraryText(definition.equipment),
    tier: difficulty?.tier ?? 1,
    difficulty: difficulty ?? DIFFICULTY.TIER_1,
  };
}

function normalizeSkillDefinition(definition = {}) {
  return {
    name: cleanLibraryText(definition.name),
    area: cleanLibraryText(definition.area),
    tags: Array.isArray(definition.tags)
      ? definition.tags.map(cleanLibraryText).filter(Boolean)
      : [],
  };
}

export function buildPublishedLibraryItem(suggestion = {}, version) {
  const itemType = getSuggestionLibraryType(suggestion);
  const versionValidation = validateLibraryVersion(version);

  if (!isGlobalLibraryItemType(itemType)) {
    throw new Error("The suggestion type cannot be published.");
  }

  if (suggestion.status !== "approved") {
    throw new Error("Only approved suggestions can be published.");
  }

  if (suggestion.publicationStatus === "published") {
    throw new Error("This suggestion is already published.");
  }

  if (!versionValidation.valid) {
    throw new Error(versionValidation.error);
  }

  const rawDefinition = suggestion.definition ?? {};
  const definition =
    itemType === "exercise"
      ? normalizeExerciseDefinition(rawDefinition)
      : itemType === "cardio"
        ? normalizeCardioDefinition(rawDefinition)
        : normalizeSkillDefinition(rawDefinition);

  if (!definition.name) {
    throw new Error("The approved suggestion needs a valid name.");
  }

  const conflictsWithBuiltIn =
    itemType === "exercise"
      ? Boolean(getExercise(definition.name))
      : itemType === "cardio"
        ? Boolean(getCardioActivity(definition.name))
        : Boolean(getSkill(definition.name));

  if (conflictsWithBuiltIn) {
    throw new Error(
      `${definition.name} already exists in the built-in ${itemType} library.`,
    );
  }

  const itemId = createLibraryItemId(itemType, definition.name);

  if (!itemId) {
    throw new Error("A stable library identifier could not be created.");
  }

  return {
    itemId,
    itemType,
    name: definition.name,
    normalizedName: normalizeLibraryText(definition.name),
    definition,
    libraryVersion: versionValidation.value,
    sourceSuggestionId: suggestion.id,
    sourceCollection: suggestion.collectionName,
  };
}

export function getPublishableSuggestions(suggestions = []) {
  return suggestions.filter(
    (suggestion) =>
      suggestion.status === "approved" &&
      suggestion.publicationStatus !== "published",
  );
}
