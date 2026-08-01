import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export async function getUserProfile(userId) {
  if (!userId) {
    return null;
  }

  const snapshot = await getDoc(doc(db, "users", userId));

  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}
