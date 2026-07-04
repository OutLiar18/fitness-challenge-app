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
} from "firebase/firestore";

export default function Dashboard() {
  const [entries, setEntries] = useState([]);

  const [type, setType] = useState("water");
  const [value, setValue] = useState("");

  const navigate = useNavigate();
  const user = auth.currentUser;

  // -------------------------
  // AUTO UNIT SYSTEM
  // -------------------------
  const getUnitByType = (type) => {
    const map = {
      water: "ml",
      fruit: "servings",
      upper_body: "reps",
      lower_body: "reps",
      core: "reps",
      running: "km",
      steps: "steps",
      cardio: "mins",
      reading: "mins",
      skill: "mins",
    };

    return map[type] || "units";
  };

  // -------------------------
  // LOGOUT
  // -------------------------
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  // -------------------------
  // SAVE ENTRY
  // -------------------------
  const saveEntry = async () => {
    if (!value) return;

    await addDoc(collection(db, "entries"), {
      type,
      value: Number(value),
      unit: getUnitByType(type),
      userId: user.uid,
      createdAt: new Date().toISOString(),
    });

    setValue("");
  };

  // -------------------------
  // DELETE ENTRY
  // -------------------------
  const deleteEntry = async (id) => {
    await deleteDoc(doc(db, "entries", id));
  };

  // -------------------------
  // LOAD DATA (REAL-TIME)
  // -------------------------
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "entries"),
      where("userId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setEntries(data);
    });

    return () => unsub();
  }, [user]);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Challenge Dashboard</h1>
      <p>Logged in as: {user?.email}</p>

      <hr />

      {/* -------------------------
          INPUT SECTION
      ------------------------- */}
      <h2>➕ Log Entry</h2>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="water">Water</option>
        <option value="fruit">Fruits</option>
        <option value="upper_body">Upper Body Workout</option>
        <option value="lower_body">Lower Body Workout</option>
        <option value="core">Middle/Core Workout</option>
        <option value="cardio">Cardio</option>
        <option value="running">Running</option>
        <option value="reading">Reading</option>
        <option value="skill">Skill</option>
        <option value="steps">Steps</option>
      </select>

      <br /><br />

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter value (e.g. 500, 20, 3)"
      />

      <br /><br />

      <button onClick={saveEntry}>Save Entry</button>

      <hr />

      {/* -------------------------
          LIST SECTION
      ------------------------- */}
      <h2>📋 Your Entries</h2>

      {entries.length === 0 ? (
        <p>No entries yet</p>
      ) : (
        entries.map((e) => (
          <div
            key={e.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>{e.type}</strong> — {e.value} {e.unit}
            </p>

            <small>
              {new Date(e.createdAt).toLocaleString()}
            </small>

            <br /><br />

            <button onClick={() => deleteEntry(e.id)}>
              Delete
            </button>
          </div>
        ))
      )}

      <hr />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}