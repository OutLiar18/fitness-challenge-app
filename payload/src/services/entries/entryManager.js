import { WORKOUT_CATEGORIES } from "../../constants/categories";
import { getNextCategory } from "../challengeService";
import { isToday } from "../dateService";
import { saveLibraryItem } from "../libraries/libraryService";
import { validateEntry } from "../validation";
import {
  createEntry,
  createExerciseSuggestion,
  createLibrarySuggestion,
} from "./entryRepository";
import { normalizeEntry } from "./normalizer";

function getUniqueCustomExercises(exercises = []) {
  const uniqueExercises = new Map();

  exercises.forEach((exercise) => {
    const definition = exercise?.exerciseDefinition;

    if (exercise?.source !== "custom" || !definition?.name) {
      return;
    }

    const key = definition.name.trim().toLocaleLowerCase();

    if (key && !uniqueExercises.has(key)) {
      uniqueExercises.set(key, definition);
    }
  });

  return [...uniqueExercises.values()];
}

function createPostSaveTasks({ userId, category, entryId, normalizedData }) {
  const tasks = [];

  if (WORKOUT_CATEGORIES.has(category)) {
    getUniqueCustomExercises(normalizedData.exercises).forEach(
      (exerciseDefinition) => {
        tasks.push({
          label: `exercise suggestion: ${exerciseDefinition.name}`,
          promise: createExerciseSuggestion({
            userId,
            challengeEntryId: entryId,
            exerciseDefinition,
          }),
        });
      },
    );
  }

  if (category === "cardio" && normalizedData.source === "custom") {
    tasks.push({
      label: `cardio suggestion: ${normalizedData.activity}`,
      promise: createLibrarySuggestion({
        userId,
        challengeEntryId: entryId,
        itemType: "cardio",
        definition: normalizedData.activityDefinition,
      }),
    });
  }

  if (category === "skill" && normalizedData.source === "custom") {
    tasks.push({
      label: `skill suggestion: ${normalizedData.skill}`,
      promise: createLibrarySuggestion({
        userId,
        challengeEntryId: entryId,
        itemType: "skill",
        definition: normalizedData.skillDefinition,
      }),
    });
  }

  if (category === "reading") {
    tasks.push({
      label: "reading library update",
      promise: saveLibraryItem({
        userId,
        itemType: "books",
        data: {
          title: normalizedData.title ?? "",
          author: normalizedData.author ?? "",
          totalPages: normalizedData.totalPages ?? "",
        },
      }),
    });
  }

  return tasks;
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
    return { success: false, errors: ["A user is required to save an entry."] };
  }

  if (!category || !categoryConfig) {
    return { success: false, errors: ["A valid category is required."] };
  }

  if (!(selectedDate instanceof Date) || Number.isNaN(selectedDate.getTime())) {
    return {
      success: false,
      errors: ["A valid challenge date is required."],
    };
  }

  const normalizedData = normalizeEntry(category, data);
  const errors = validateEntry(categoryConfig, normalizedData);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  const documentReference = await createEntry(
    userId,
    category,
    normalizedData,
    selectedDate,
  );

  const postSaveTasks = createPostSaveTasks({
    userId,
    category,
    entryId: documentReference.id,
    normalizedData,
  });

  const postSaveResults = await Promise.allSettled(
    postSaveTasks.map((task) => task.promise),
  );

  const failedTasks = postSaveResults
    .map((result, index) => ({ result, label: postSaveTasks[index]?.label }))
    .filter(({ result }) => result.status === "rejected");

  failedTasks.forEach(({ result, label }) => {
    console.error(`Post-save task failed (${label}):`, result.reason);
  });

  const temporaryEntry = {
    id: documentReference.id,
    userId,
    category,
    data: normalizedData,
    challengeDate: {
      toDate: () => new Date(selectedDate),
    },
  };

  const nextCategory = isToday(selectedDate)
    ? getNextCategory([...currentEntries, temporaryEntry])
    : null;

  return {
    success: true,
    entry: temporaryEntry,
    normalizedData,
    nextCategory,
    warning:
      failedTasks.length > 0
        ? "Your entry was saved, but one background update could not be completed."
        : "",
  };
}
