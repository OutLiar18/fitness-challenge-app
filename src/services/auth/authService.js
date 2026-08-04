import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { DEFAULT_AVATAR_ID } from "../../constants/avatars";
import { auth, db } from "../../firebase";

const AUTH_ERROR_MESSAGES = {
  "auth/email-already-in-use": "An account already exists for that email address.",
  "auth/invalid-credential": "The email address or password is incorrect.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/missing-password": "Enter your password.",
  "auth/network-request-failed": "A network error occurred. Check your connection and try again.",
  "auth/too-many-requests": "Too many attempts were made. Wait a moment and try again.",
  "auth/weak-password": "Use a password with at least six characters.",
};

export function getAuthErrorMessage(error, fallback) {
  return AUTH_ERROR_MESSAGES[error?.code] ?? error?.message ?? fallback;
}

export async function loginUser({ email, password }) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export async function registerUser({ firstName, lastName, email, password }) {
  const cleanFirstName = firstName.trim();
  const cleanLastName = lastName.trim();
  const displayName = [cleanFirstName, cleanLastName].filter(Boolean).join(" ");

  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  try {
    await setDoc(doc(db, "users", credential.user.uid), {
      uid: credential.user.uid,
      firstName: cleanFirstName,
      lastName: cleanLastName,
      fullName: displayName,
      displayName,
      email: credential.user.email,
      role: "user",
      team: "",
      avatarId: DEFAULT_AVATAR_ID,
      joinedAt: serverTimestamp(),
      onboardingVersion: 0,
      onboardingCompletedAt: null,
      onboardingUpdatedAt: serverTimestamp(),
      profileUpdatedAt: serverTimestamp(),
    });
  } catch (error) {
    try {
      await deleteUser(credential.user);
    } catch (cleanupError) {
      console.error("Could not clean up incomplete account:", cleanupError);
    }

    throw error;
  }

  return credential;
}

export async function logoutUser() {
  await signOut(auth);
}
