import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "../firebase";

import {
  cleanLibraryText,
  createLibraryItemId,
  normalizeLibraryText,
} from "../utils/libraryTextUtils";

function getLibraryCollection(userId) {
  return collection(db, "users", userId, "library");
}

function getLibraryQuery(userId, itemType) {
  return query(getLibraryCollection(userId), where("itemType", "==", itemType));
}

function parsePositiveInteger(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function normalizeBook(data = {}) {
  const title = cleanLibraryText(data.title);

  return {
    title,
    normalizedTitle: normalizeLibraryText(title),
    author: cleanLibraryText(data.author),
    totalPages: parsePositiveInteger(data.totalPages),
  };
}

function normalizeGeneric(data = {}) {
  const name = cleanLibraryText(data.name ?? data.title ?? "");

  return {
    name,
    normalizedName: normalizeLibraryText(name),
  };
}

function normalizeItem(itemType, data = {}) {
  return itemType === "books" ? normalizeBook(data) : normalizeGeneric(data);
}

function getPrimaryValue(itemType, item) {
  return itemType === "books" ? item.title : item.name;
}

function sortLibrary(items) {
  return [...items].sort((a, b) => {
    const usageDifference =
      Number(b.usageCount ?? 0) - Number(a.usageCount ?? 0);

    if (usageDifference !== 0) {
      return usageDifference;
    }

    const aTime = a.lastUsedAt?.toMillis?.() ?? 0;

    const bTime = b.lastUsedAt?.toMillis?.() ?? 0;

    return bTime - aTime;
  });
}

export async function getLibraryItems(userId, itemType) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!itemType) {
    throw new Error("Item type is required.");
  }

  const snapshot = await getDocs(getLibraryQuery(userId, itemType));

  return sortLibrary(
    snapshot.docs.map((docSnapshot) => ({
      id: docSnapshot.id,
      ...docSnapshot.data(),
    })),
  );
}

export function subscribeToLibraryItems(userId, itemType, onUpdate, onError) {
  if (!userId || !itemType) {
    onUpdate([]);
    return () => {};
  }

  return onSnapshot(
    getLibraryQuery(userId, itemType),
    (snapshot) => {
      const items = snapshot.docs.map((docSnapshot) => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      }));

      onUpdate(sortLibrary(items));
    },
    onError,
  );
}

export async function saveLibraryItem({
  userId,
  itemType,
  data,
  incrementUsage = true,
}) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!itemType) {
    throw new Error("Item type is required.");
  }

  const normalizedItem = normalizeItem(itemType, data);

  const primaryValue = getPrimaryValue(itemType, normalizedItem);

  if (!primaryValue) {
    throw new Error("A title or name is required.");
  }

  const documentId = createLibraryItemId(itemType, primaryValue);

  const reference = doc(db, "users", userId, "library", documentId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);

    if (snapshot.exists()) {
      const existing = snapshot.data();

      transaction.update(reference, {
        ...normalizedItem,

        usageCount: incrementUsage
          ? Number(existing.usageCount ?? 0) + 1
          : Number(existing.usageCount ?? 0),

        updatedAt: serverTimestamp(),

        ...(incrementUsage && {
          lastUsedAt: serverTimestamp(),
        }),
      });

      return;
    }

    transaction.set(reference, {
      itemType,

      ...normalizedItem,

      usageCount: incrementUsage ? 1 : 0,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),

      ...(incrementUsage && {
        lastUsedAt: serverTimestamp(),
      }),
    });
  });

  return {
    id: documentId,
    itemType,
    ...normalizedItem,
  };
}
