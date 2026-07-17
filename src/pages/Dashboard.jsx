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

import {
  getTotalEntries,
  getTodayEntryCount,
  getTotalPoints,
  getTodayPoints,
  getEntriesForDate,
  getDailyGoals,
  getTopCategories,
} from "../services/statisticsService";

import { isEditableDate } from "../services/dateService";
import { getNextCategory } from "../services/challengeService";
import { getCategory } from "../utils/categoryHelpers";
import { createEntry } from "../services/entryService";
import { validateEntry } from "../services/validationService";
import { getValidationMessage } from "../services/messageService";

import CategoryGrid from "../components/categories/CategoryGrid";
import TopCategories from "../components/dashboard/TopCategories";
import DailyGoals from "../components/dashboard/DailyGoals";
import DailyProgress from "../components/dashboard/DailyProgress";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import StatsCard from "../components/dashboard/StatsCard";
import EntryForm from "../components/entries/EntryForm";
import Journal from "../components/journal/Journal";

export default function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [type, setType] = useState("water");
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  const user = auth.currentUser;

  const readOnly = !isEditableDate(selectedDate);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const dailyGoals = getDailyGoals(entries);

  const saveEntry = async () => {
    if (!user || saving || readOnly) return;

    const category = getCategory(type);

    const errors = validateEntry(category, formData);

    if (errors.length > 0) {
      alert(
        `${getValidationMessage(type)}

Please fix the following:

• ${errors.join("\n• ")}`,
      );
      return;
    }

    setSaving(true);

    try {
      await createEntry(user.uid, type, formData, selectedDate);

      // Build a temporary updated list so we don't have to wait
      // for Firestore to refresh before choosing the next goal.
      const updatedEntries = [
        ...entries,
        {
          category: type,
          data: formData,
          challengeDate: {
            toDate: () => selectedDate,
          },
        },
      ];

      if (selectedDate.toDateString() === new Date().toDateString()) {
        const nextCategory = getNextCategory(updatedEntries);

        if (nextCategory) {
          setType(nextCategory);
        }
      }

      setFormData({});

      alert("✅ Entry saved successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (id) => {
    if (readOnly) return;

    try {
      await deleteDoc(doc(db, "challengeEntries", id));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

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
      where("userId", "==", user.uid),
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

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
      }}
    >
      <WelcomeCard profile={profile} user={user} />

      <StatsCard
        stats={{
          points: getTotalPoints(entries),
          todayPoints: getTodayPoints(entries),

          entries: getTotalEntries(entries),
          todayEntries: getTodayEntryCount(entries),
        }}
      />

      <DailyProgress goals={dailyGoals} />

      <DailyGoals goals={dailyGoals} onSelect={setType} />

      <TopCategories categories={getTopCategories(entries)} />

      <CategoryGrid selected={type} onSelect={setType} />

      <EntryForm
        type={type}
        formData={formData}
        setFormData={setFormData}
        onSave={saveEntry}
        saving={saving}
        readOnly={readOnly}
      />

      <Journal
        entries={getEntriesForDate(entries, selectedDate)}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onDelete={deleteEntry}
        readOnly={readOnly}
      />

      <hr />

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
