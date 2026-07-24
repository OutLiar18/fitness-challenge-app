import { saveLibraryItem } from "../libraries/libraryService";
import { getNextCategory } from "../challengeService";
import { validateEntry } from "../validation";

import { createEntry, createExerciseSuggestion } from "./entryRepository";

import { normalizeEntry } from "./normalizer";

function getUniqueCustomExercises(exercises = []) {
  const customExercises = exercises.filter(
    (exercise) =>
      exercise?.source === "custom" && exercise?.exerciseDefinition?.name,
  );

  const uniqueExercises = new Map();

  customExercises.forEach((exercise) => {
    const key = exercise.exerciseDefinition.name.trim().toLowerCase();

    if (!uniqueExercises.has(key)) {
      uniqueExercises.set(key, exercise.exerciseDefinition);
    }
  });

  return [...uniqueExercises.values()];
}

async function saveExerciseSuggestions({
  userId,
  challengeEntryId,
  normalizedData,
}) {
  const customExerciseDefinitions = getUniqueCustomExercises(
    normalizedData.exercises,
  );

  const results = await Promise.allSettled(
    customExerciseDefinitions.map((exerciseDefinition) =>
      createExerciseSuggestion({
        userId,
        challengeEntryId,
        exerciseDefinition,
      }),
    ),
  );

  return results;
}

export async function saveChallengeEntry({
  userId,
  category,
  categoryConfig,
  data,
  selectedDate,
  currentEntries = [],
}) {
  if (!userId) {
    return {
      success: false,
      errors: ["A user is required to save an entry."],
    };
  }

  if (!category || !categoryConfig) {
    return {
      success: false,
      errors: ["A valid category is required."],
    };
  }

  if (!(selectedDate instanceof Date)) {
    return {
      success: false,
      errors: ["A valid challenge date is required."],
    };
  }

  const normalizedData = normalizeEntry(category, data);

  const errors = validateEntry(categoryConfig, normalizedData);

  if (errors.length > 0) {
    return {
      success: false,
      errors,
    };
  }

  const documentReference = await createEntry(
    userId,
    category,
    normalizedData,
    selectedDate,
  );

  let suggestionResults = [];

  if (["upperBody", "lowerBody", "core"].includes(category)) {
    suggestionResults = await saveExerciseSuggestions({
      userId,
      challengeEntryId: documentReference.id,
      normalizedData,
    });
  }

  if (category === "reading") {
    await saveLibraryItem({
      userId,
      itemType: "books",

      data: {
        title: normalizedData.title ?? normalizedData.book ?? "",

        author: normalizedData.author ?? "",

        totalPages: normalizedData.totalPages ?? "",
      },
    });
  }

  const temporaryEntry = {
    id: documentReference.id,
    userId,
    category,
    data: normalizedData,

    challengeDate: {
      toDate: () => selectedDate,
    },
  };

  const updatedEntries = [...currentEntries, temporaryEntry];

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const nextCategory = isToday ? getNextCategory(updatedEntries) : null;

  const failedSuggestions = suggestionResults.filter(
    (result) => result.status === "rejected",
  );

  return {
    success: true,
    entry: temporaryEntry,
    normalizedData,
    nextCategory,

    suggestionWarning:
      failedSuggestions.length > 0
        ? "The workout was saved, but one or more exercise suggestions could not be submitted."
        : "",
  };
}
