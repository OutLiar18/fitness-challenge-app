import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        displayName: `${firstName} ${lastName}`,
        email: user.email,
        role: "user",
        team: "",
        totalPoints: 0,
        bonusPoints: 0,
        currentStreak: 0,
        joinedAt: serverTimestamp(),
      });

      alert("🎉 Welcome to Champions Legacy Challenge!");

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h1>Signup</h1>

      <input
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Sign Up</button>
    </form>
  );
}