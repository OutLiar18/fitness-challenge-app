import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { normalizeChallengeDate } from "../dateService";

function getCreatedAtMillis(entry) {
  if (typeof entry.createdAt?.toMillis === "function") {
    return entry.createdAt.toMillis();
  }

  const parsed = new Date(entry.createdAt ?? 0).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortEntriesNewestFirst(entries) {
  return [...entries].sort(
    (first, second) => getCreatedAtMillis(second) - getCreatedAtMillis(first),
  );
}

export async function createEntry(userId, category, data, selectedDate) {
  if (!userId) {
    throw new Error("A user is required to save an entry.");
  }

  if (!category) {
    throw new Error("A category is required to save an entry.");
  }

  const challengeDate = normalizeChallengeDate(selectedDate);

  if (!challengeDate) {
    throw new Error("A valid challenge date is required.");
  }

  return addDoc(collection(db, "challengeEntries"), {
    userId,
    category,
    data,
    createdAt: serverTimestamp(),
    challengeDate: Timestamp.fromDate(challengeDate),
  });
}

export function subscribeToEntries(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate([]);
    return () => {};
  }

  const entriesQuery = query(
    collection(db, "challengeEntries"),
    where("userId", "==", userId),
  );

  return onSnapshot(
    entriesQuery,
    (snapshot) => {
      const entries = snapshot.docs.map((entryDocument) => ({
        id: entryDocument.id,
        ...entryDocument.data(),
      }));

      onUpdate(sortEntriesNewestFirst(entries));
    },
    onError,
  );
}

export async function deleteEntry(entryId) {
  if (!entryId) {
    throw new Error("An entry ID is required.");
  }

  await deleteDoc(doc(db, "challengeEntries", entryId));
}

export async function createExerciseSuggestion({
  userId,
  challengeEntryId,
  exerciseDefinition,
}) {
  if (!userId) {
    throw new Error("A user is required to suggest an exercise.");
  }

  if (!exerciseDefinition?.name) {
    throw new Error("An exercise name is required.");
  }

  return addDoc(collection(db, "exerciseSuggestions"), {
    submittedBy: userId,
    challengeEntryId,
    exerciseDefinition,
    status: "pending",
    createdAt: serverTimestamp(),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: "",
  });
}

export async function createLibrarySuggestion({
  userId,
  challengeEntryId,
  itemType,
  definition,
}) {
  if (!userId) {
    throw new Error("A user is required to create a library suggestion.");
  }

  if (!itemType || !definition?.name) {
    throw new Error("A valid library suggestion is required.");
  }

  return addDoc(collection(db, "librarySuggestions"), {
    submittedBy: userId,
    challengeEntryId,
    itemType,
    definition,
    status: "pending",
    createdAt: serverTimestamp(),
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: "",
  });
}
