import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function createEntry(
  userId,
  category,
  data,
  challengeDate
) {
  return await addDoc(collection(db, "challengeEntries"), {
    userId,
    category,
    data,

    createdAt: serverTimestamp(),

    challengeDate: Timestamp.fromDate(
      new Date(
        challengeDate.getFullYear(),
        challengeDate.getMonth(),
        challengeDate.getDate()
      )
    ),
  });
}