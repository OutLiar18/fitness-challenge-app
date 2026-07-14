import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  addDoc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { getCategory } from "../utils/categoryHelpers";

import CategoryGrid from "../components/categories/CategoryGrid";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsCard from "../components/dashboard/StatsCard";
import EntryForm from "../components/entries/EntryForm";
import EntryCard from "../components/entries/EntryCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);

  const [type, setType] = useState("water");
  const [formData, setFormData] = useState({});

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
  // Load Profile + Entries
  // -----------------------

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          setProfile(snap.data());
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadProfile();

    const q = query(
      collection(db, "challengeEntries"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();

        const category = getCategory(d.category);

        return {
          id: docSnap.id,
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
      <WelcomeCard profile={profile} user={user} />

      <StatsCard totalEntries={entries.length} />

      <CategoryGrid
        selected={type}
        onSelect={setType}
      />

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
          <EntryCard
            key={entry.id}
            entry={entry}
            onDelete={deleteEntry}
          />
        ))
      )}

      <hr />

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}