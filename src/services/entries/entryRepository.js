import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

export async function createEntry(userId, category, data, selectedDate) {
  if (!userId) {
    throw new Error("A user is required to save an entry.");
  }

  if (!category) {
    throw new Error("A category is required to save an entry.");
  }

  if (!(selectedDate instanceof Date)) {
    throw new Error("A valid challenge date is required.");
  }

  return addDoc(collection(db, "challengeEntries"), {
    userId,
    category,
    data,
    createdAt: serverTimestamp(),
    challengeDate: Timestamp.fromDate(selectedDate),
  });
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
