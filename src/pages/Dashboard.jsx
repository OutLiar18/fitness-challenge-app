import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase";

import {
  getDailyGoals,
  getEntriesForDate,
  getTodayEntryCount,
  getTodayPoints,
  getTopCategories,
  getTotalEntries,
  getTotalPoints,
} from "../services/statistics";

import { isEditableDate } from "../services/dateService";
import { saveChallengeEntry } from "../services/entries";
import { getValidationMessage } from "../services/messageService";

import { getCategory } from "../utils/categoryHelpers";

import CategoryGrid from "../components/categories/CategoryGrid";
import Toast from "../components/common/Toast/Toast";
import DailyGoals from "../components/dashboard/DailyGoals";
import DailyProgress from "../components/dashboard/DailyProgress";
import StatsCard from "../components/dashboard/StatsCard";
import TopCategories from "../components/dashboard/TopCategories";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import EntryForm from "../components/entries/EntryForm";
import Journal from "../components/journal/Journal";

function getInitialFormData(categoryType) {
  if (categoryType === "reading") {
    return {
      completed: false,
    };
  }

  return {};
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [type, setType] = useState("water");
  const [formData, setFormData] = useState(() => getInitialFormData("water"));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const readOnly = !isEditableDate(selectedDate);
  const dailyGoals = getDailyGoals(entries);

  const showToast = (message, toastType = "success") => {
    setToast({
      message,
      type: toastType,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleCategorySelect = (selectedType) => {
    setType(selectedType);
    setFormData(getInitialFormData(selectedType));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error(error);

      showToast(error.message || "You could not be logged out.", "error");
    }
  };

  const saveEntry = async () => {
    if (!user || saving || readOnly) {
      return;
    }

    const category = getCategory(type);

    if (!category) {
      showToast("The selected category could not be found.", "error");

      return;
    }

    setSaving(true);

    try {
      const result = await saveChallengeEntry({
        userId: user.uid,
        category: type,
        categoryConfig: category,
        data: formData,
        selectedDate,
        currentEntries: entries,
      });

      if (!result.success) {
        alert(
          `${getValidationMessage(type)}

Please fix the following:

• ${result.errors.join("\n• ")}`,
        );

        return;
      }

      if (result.nextCategory) {
        setType(result.nextCategory);
        setFormData(getInitialFormData(result.nextCategory));
      } else {
        setFormData(getInitialFormData(type));
      }

      showToast("Entry saved successfully!");
    } catch (error) {
      console.error(error);

      showToast(error.message || "The entry could not be saved.", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (id) => {
    if (readOnly || !id) {
      return;
    }

    try {
      await deleteDoc(doc(db, "challengeEntries", id));

      showToast("Entry deleted successfully.");
    } catch (error) {
      console.error(error);

      showToast(error.message || "The entry could not be deleted.", "error");
    }
  };

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const loadProfile = async () => {
      try {
        const profileSnapshot = await getDoc(doc(db, "users", user.uid));

        if (profileSnapshot.exists()) {
          setProfile(profileSnapshot.data());
        }
      } catch (error) {
        console.error(error);

        showToast(error.message || "The profile could not be loaded.", "error");
      }
    };

    loadProfile();

    const entriesQuery = query(
      collection(db, "challengeEntries"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(
      entriesQuery,
      (snapshot) => {
        const loadedEntries = snapshot.docs.map((documentSnapshot) => {
          const entry = documentSnapshot.data();
          const category = getCategory(entry.category);

          return {
            id: documentSnapshot.id,
            ...entry,
            name: category?.name || entry.category,
            emoji: category?.emoji || "🏆",
          };
        });

        loadedEntries.sort((firstEntry, secondEntry) => {
          const firstCreatedAt = firstEntry.createdAt;
          const secondCreatedAt = secondEntry.createdAt;

          if (!firstCreatedAt && !secondCreatedAt) {
            return 0;
          }

          if (!firstCreatedAt) {
            return 1;
          }

          if (!secondCreatedAt) {
            return -1;
          }

          return secondCreatedAt.toMillis() - firstCreatedAt.toMillis();
        });

        setEntries(loadedEntries);
      },
      (error) => {
        console.error(error);

        showToast(error.message || "Entries could not be loaded.", "error");
      },
    );

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

      <DailyGoals goals={dailyGoals} onSelect={handleCategorySelect} />

      <TopCategories categories={getTopCategories(entries)} />

      <CategoryGrid selected={type} onSelect={handleCategorySelect} />

      <EntryForm
        userId={user.uid}
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

      <Toast message={toast?.message} type={toast?.type} />

      <hr />

      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
