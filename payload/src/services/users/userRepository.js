import {
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

export function subscribeToUserProfile(userId, onProfile, onError) {
  if (!userId) {
    onProfile?.(null);
    return () => {};
  }

  return onSnapshot(
    doc(db, "users", userId),
    (snapshot) => {
      onProfile?.(
        snapshot.exists()
          ? { id: snapshot.id, ...snapshot.data() }
          : null,
      );
    },
    onError,
  );
}

export async function updateUserProfile(userId, profileUpdate) {
  if (!userId) {
    throw new Error("A signed-in player is required to update a profile.");
  }

  await updateDoc(doc(db, "users", userId), {
    ...profileUpdate,
    profileUpdatedAt: serverTimestamp(),
  });
}
