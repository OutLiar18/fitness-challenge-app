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
} from "firebase/firestore";

import { getUnit } from "../utils/units";
import { getCategory } from "../utils/categoryHelpers";
import CategoryGrid from "../components/categories/CategoryGrid";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsCard from "../components/dashboard/StatsCard";
import EntryForm from "../components/entries/EntryForm";
import EntryCard from "../components/entries/EntryCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [entries, setEntries] = useState([]);

  const [type, setType] = useState("water");
  const [formData, setFormData] = useState({});

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const saveEntry = async () => {
    if (!user) return;

    try {
      await addDoc(collection(db, "challengeEntries"), {
        userId: user.uid,

        category: type,

        ...formData,

        createdAt: serverTimestamp(),
      });

      setFormData({});
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const deleteEntry = async (id) => {
    await deleteDoc(doc(db, "challengeEntries", id));
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "challengeEntries"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data();

        const category = getCategory(d.category);

        return {
          id: doc.id,
          ...d,
          name: category?.name || d.category,
          emoji: category?.emoji || "🏆",
        };
      });

      data.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;

        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });

      setEntries(data);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
      }}
    >
      <WelcomeCard />

      <StatsCard totalEntries={entries.length} />

      <CategoryGrid selected={type} onSelect={setType} />

      <EntryForm
        type={type}
        formData={formData}
        setFormData={setFormData}
        onSave={saveEntry}
      />

      <hr />

      <h2>Your Entries</h2>

      {entries.length === 0 ? (
        <p>No entries yet.</p>
      ) : (
        entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} onDelete={deleteEntry} />
        ))
      )}

      <hr />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
