import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

import { db } from "../firebase";

export async function migrateChallengeDates(userId) {
  const snapshot = await getDocs(
    collection(db, "challengeEntries")
  );

  let migrated = 0;

  for (const document of snapshot.docs) {
    const data = document.data();

    if (data.userId !== userId) continue;

    if (data.challengeDate) continue;

    if (!data.createdAt) continue;

    await updateDoc(
      doc(db, "challengeEntries", document.id),
      {
        challengeDate: Timestamp.fromDate(
          data.createdAt.toDate()
        ),
      }
    );

    migrated++;
  }

  return migrated;
}