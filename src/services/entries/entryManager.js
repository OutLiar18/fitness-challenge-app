import { saveLibraryItem } from "../libraryService";
import { getNextCategory } from "../challengeService";
import { validateEntry } from "../validation";

import { createEntry } from "./entryRepository";
import { normalizeEntry } from "./normalizer";

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

  return {
    success: true,
    entry: temporaryEntry,
    normalizedData,
    nextCategory,
  };
}
