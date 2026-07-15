import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { getCategory } from "../utils/categoryHelpers";
import { createEntry } from "../services/entryService";
import { validateEntry } from "../services/validationService";

import CategoryGrid from "../components/categories/CategoryGrid";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsCard from "../components/dashboard/StatsCard";
import EntryForm from "../components/entries/EntryForm";
import EntryCard from "../components/entries/EntryCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  if (!user) return null;

  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);

  const [type, setType] = useState("water");
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

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
    if (!user || saving) return;

    const category = getCategory(type);

    const errors = validateEntry(category, formData);

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    setSaving(true);

    try {
      await createEntry(
        user.uid,
        type,
        formData
      );

      setFormData({});

      alert("✅ Entry saved successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
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
      alert(err.message);
    }
  };

  // -----------------------
  // Load Profile + Entries
  // -----------------------

  useEffect(() => {
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

        return (
          b.createdAt.toMillis() -
          a.createdAt.toMillis()
        );
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