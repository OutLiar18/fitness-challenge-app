import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { db } from "../../firebase";
import { getOnboardingCompletionValues } from "./accountModel";

export async function completeOnboarding(userId) {
  if (!userId) {
    throw new Error("A signed-in player is required to complete onboarding.");
  }

  await updateDoc(doc(db, "users", userId), {
    ...getOnboardingCompletionValues(),
    onboardingCompletedAt: serverTimestamp(),
    onboardingUpdatedAt: serverTimestamp(),
    profileUpdatedAt: serverTimestamp(),
  });
}

export async function restartOnboarding(userId) {
  if (!userId) {
    throw new Error("A signed-in player is required to restart onboarding.");
  }

  await updateDoc(doc(db, "users", userId), {
    onboardingVersion: 0,
    onboardingCompletedAt: null,
    onboardingUpdatedAt: serverTimestamp(),
    profileUpdatedAt: serverTimestamp(),
  });
}
