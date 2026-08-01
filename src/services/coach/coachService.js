import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

import { DEFAULT_COACH_PREFERENCES } from "../../constants/coach";
import { db } from "../../firebase";
import { normalizeCoachPreferences } from "./coachModel";

export function subscribeToCoachPreferences(userId, onUpdate, onError) {
  if (!userId) {
    onUpdate?.(DEFAULT_COACH_PREFERENCES);
    return () => {};
  }

  return onSnapshot(
    doc(db, "users", userId, "coach", "preferences"),
    (snapshot) => {
      onUpdate?.(
        snapshot.exists()
          ? normalizeCoachPreferences(snapshot.data())
          : DEFAULT_COACH_PREFERENCES,
      );
    },
    onError,
  );
}

export async function saveCoachPreferences(userId, input) {
  if (!userId) {
    throw new Error("Sign in before changing Legacy Coach preferences.");
  }

  const preferences = normalizeCoachPreferences(input);
  await setDoc(
    doc(db, "users", userId, "coach", "preferences"),
    {
      ...preferences,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return preferences;
}
