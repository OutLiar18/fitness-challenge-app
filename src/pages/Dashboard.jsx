import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [entries, setEntries] = useState([]);

  const [category, setCategory] = useState("water");
  const [value, setValue] = useState("");

  // -----------------------
  // Automatic units
  // -----------------------
  const getUnit = (category) => {
    switch (category) {
      case "water":
        return "ml";

      case "fruit":
        return "fruit";

      case "upper_body":
      case "lower_body":
      case "core":
        return "reps";

      case "running":
        return "km";

      case "steps":
        return "steps";

      case "reading":
      case "cardio":
      case "skill":
        return "minutes";

      default:
        return "";
    }
  };

  // -----------------------
  // Logout
  // -----------------------
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // -----------------------
  // Save Entry
  // -----------------------
  const saveEntry = async () => {
    if (!user) {
      alert("Please log in.");
      return;
    }

    if (value.trim() === "") {
      alert("🤨 You forgot to enter a value.");
      return;
    }

    if (isNaN(value)) {
      alert(
        "😂 Unfortunately that is not a decimal value known to mankind."
      );
      return;
    }

    try {
      await addDoc(collection(db, "challengeEntries"), {
        userId: user.uid,

        category,

        value: Number(value),

        unit: getUnit(category),

        createdAt: serverTimestamp(),
      });

      setValue("");

      alert("✅ Entry saved!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // -----------------------
  // Delete Entry
  // -----------------------
  const deleteEntry = async (id) => {
    try {
      await deleteDoc(doc(db, "challengeEntries", id));
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------
  // Load Entries
  // -----------------------
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "challengeEntries"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEntries(data);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
      }}
    >
      <h1>🏆 Champions Legacy Challenge</h1>

      <p>
        Logged in as <strong>{user?.email}</strong>
      </p>

      <hr />

      <h2>➕ Log Challenge Entry</h2>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="water">💧 Water</option>

        <option value="fruit">🍎 Fruit</option>

        <option value="upper_body">💪 Upper Body Workout</option>

        <option value="lower_body">🦵 Lower Body Workout</option>

        <option value="core">🔥 Core Workout</option>

        <option value="cardio">🚴 Cardio</option>

        <option value="running">🏃 Running</option>

        <option value="reading">📚 Reading</option>

        <option value="skill">🎯 Skill</option>

        <option value="steps">👣 Steps</option>
      </select>

      <br />
      <br />

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Enter ${getUnit(category)}`}
      />

      <br />
      <br />

      <button onClick={saveEntry}>Save Entry</button>

      <hr />

      <h2>Your Entries</h2>

      {entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        entries.map((entry) => (
          <div
            key={entry.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <strong>{entry.category}</strong>

            <p>
              {entry.value} {entry.unit}
            </p>

            <small>
              {entry.createdAt?.toDate
                ? entry.createdAt.toDate().toLocaleString()
                : ""}
            </small>

            <br />
            <br />

            <button
              onClick={() => deleteEntry(entry.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}

      <hr />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}