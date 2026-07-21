import {
  collection,
  doc,
  getDocs,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  cleanLibraryText,
  createLibraryItemId,
  normalizeLibraryText,
} from "../utils/libraryTextUtils";

function getLibraryCollection(userId) {
  return collection(
    db,
    "users",
    userId,
    "library",
  );
}

function parsePositiveInteger(value) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const parsedValue = Number(value);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue <= 0
  ) {
    return null;
  }

  return parsedValue;
}

function normalizeBookData(data = {}) {
  const title = cleanLibraryText(data.title);

  return {
    title,
    normalizedTitle: normalizeLibraryText(title),
    author: cleanLibraryText(data.author),
    totalPages: parsePositiveInteger(data.totalPages),
  };
}

function normalizeLibraryItem(itemType, data = {}) {
  if (itemType === "books") {
    return normalizeBookData(data);
  }

  const name = cleanLibraryText(
    data.name ?? data.title ?? "",
  );

  return {
    name,
    normalizedName: normalizeLibraryText(name),
  };
}

function getPrimaryText(itemType, itemData) {
  if (itemType === "books") {
    return itemData.title;
  }

  return itemData.name;
}

export async function getLibraryItems(
  userId,
  itemType,
) {
  if (!userId) {
    throw new Error(
      "A user ID is required to load library items.",
    );
  }

  if (!itemType) {
    throw new Error(
      "A library item type is required.",
    );
  }

  const snapshot = await getDocs(
    getLibraryCollection(userId),
  );

  return snapshot.docs
    .map((libraryDocument) => ({
      id: libraryDocument.id,
      ...libraryDocument.data(),
    }))
    .filter(
      (libraryItem) =>
        libraryItem.itemType === itemType,
    )
    .sort((firstItem, secondItem) => {
      const usageDifference =
        Number(secondItem.usageCount ?? 0) -
        Number(firstItem.usageCount ?? 0);

      if (usageDifference !== 0) {
        return usageDifference;
      }

      const firstTime =
        firstItem.lastUsedAt?.toMillis?.() ?? 0;

      const secondTime =
        secondItem.lastUsedAt?.toMillis?.() ?? 0;

      return secondTime - firstTime;
    });
}

export async function saveLibraryItem({
  userId,
  itemType,
  data,
  incrementUsage = true,
}) {
  if (!userId) {
    throw new Error(
      "A user ID is required to save a library item.",
    );
  }

  if (!itemType) {
    throw new Error(
      "A library item type is required.",
    );
  }

  const normalizedData = normalizeLibraryItem(
    itemType,
    data,
  );

  const primaryText = getPrimaryText(
    itemType,
    normalizedData,
  );

  if (!primaryText) {
    throw new Error(
      "A name or title is required.",
    );
  }

  const documentId = createLibraryItemId(
    itemType,
    primaryText,
  );

  if (!documentId) {
    throw new Error(
      "A valid library item name is required.",
    );
  }

  const libraryReference = doc(
    db,
    "users",
    userId,
    "library",
    documentId,
  );

  await runTransaction(
    db,
    async (transaction) => {
      const existingSnapshot =
        await transaction.get(libraryReference);

      if (existingSnapshot.exists()) {
        const existingData =
          existingSnapshot.data();

        const currentUsageCount = Number(
          existingData.usageCount ?? 0,
        );

        transaction.update(libraryReference, {
          ...normalizedData,

          usageCount: incrementUsage
            ? currentUsageCount + 1
            : currentUsageCount,

          updatedAt: serverTimestamp(),

          ...(incrementUsage
            ? {
                lastUsedAt: serverTimestamp(),
              }
            : {}),
        });

        return;
      }

      transaction.set(libraryReference, {
        itemType,
        ...normalizedData,

        usageCount: incrementUsage ? 1 : 0,

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        ...(incrementUsage
          ? {
              lastUsedAt: serverTimestamp(),
            }
          : {}),
      });
    },
  );

  return {
    id: documentId,
    itemType,
    ...normalizedData,
  };
}