import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function createEntry(userId, category, data) {
  return await addDoc(collection(db, "challengeEntries"), {
    userId,
    category,
    data,
    createdAt: serverTimestamp(),
  });
}