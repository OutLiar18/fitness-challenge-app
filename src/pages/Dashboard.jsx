import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryGrid from "../components/categories/CategoryGrid";
import Toast from "../components/common/Toast/Toast";
import DailyGoals from "../components/dashboard/DailyGoals";
import DailyProgress from "../components/dashboard/DailyProgress";
import StatsCard from "../components/dashboard/StatsCard";
import TopCategories from "../components/dashboard/TopCategories";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import EntryForm from "../components/entries/EntryForm";
import Journal from "../components/journal/Journal";
import useAuth from "../hooks/useAuth";
import useDashboardData from "../hooks/useDashboardData";
import useToast from "../hooks/useToast";
import { logoutUser } from "../services/auth/authService";
import { isEditableDate, normalizeChallengeDate } from "../services/dateService";
import { deleteEntry, saveChallengeEntry } from "../services/entries";
import { getValidationMessage } from "../services/messageService";
import {
  getDailyGoals,
  getEntriesForDate,
  getTodayEntryCount,
  getTodayPoints,
  getTopCategories,
  getTotalEntries,
  getTotalPoints,
} from "../services/statistics";
import { getCategory } from "../utils/categoryHelpers";
import "./Dashboard.css";

function getInitialFormData(categoryId) {
  return categoryId === "reading" ? { completed: false } : {};
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, entries, loading, error: dataError } = useDashboardData(
    user?.uid,
  );
  const { toast, showToast, dismissToast } = useToast();

  const [selectedDate, setSelectedDate] = useState(() =>
    normalizeChallengeDate(new Date()),
  );
  const [categoryId, setCategoryId] = useState("water");
  const [formData, setFormData] = useState(() => getInitialFormData("water"));
  const [formErrors, setFormErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const readOnly = !isEditableDate(selectedDate);

  const dailyGoals = useMemo(() => getDailyGoals(entries), [entries]);
  const selectedEntries = useMemo(
    () => getEntriesForDate(entries, selectedDate),
    [entries, selectedDate],
  );
  const topCategories = useMemo(() => getTopCategories(entries), [entries]);
  const stats = useMemo(
    () => ({
      points: getTotalPoints(entries),
      todayPoints: getTodayPoints(entries),
      entries: getTotalEntries(entries),
      todayEntries: getTodayEntryCount(entries),
    }),
    [entries],
  );

  function handleCategorySelect(nextCategoryId) {
    setCategoryId(nextCategoryId);
    setFormData(getInitialFormData(nextCategoryId));
    setFormErrors([]);
  }

  async function handleLogout() {
    try {
      await logoutUser();
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      showToast(error.message || "You could not be logged out.", "error");
    }
  }

  async function handleSaveEntry() {
    if (!user || saving || readOnly) {
      return;
    }

    const category = getCategory(categoryId);

    if (!category) {
      showToast("The selected category could not be found.", "error");
      return;
    }

    setSaving(true);
    setFormErrors([]);

    try {
      const result = await saveChallengeEntry({
        userId: user.uid,
        category: categoryId,
        categoryConfig: category,
        data: formData,
        selectedDate,
        currentEntries: entries,
      });

      if (!result.success) {
        setFormErrors(result.errors);
        showToast(getValidationMessage(categoryId), "error");
        return;
      }

      const nextCategory = result.nextCategory ?? categoryId;
      setCategoryId(nextCategory);
      setFormData(getInitialFormData(nextCategory));

      if (result.warning) {
        showToast(result.warning, "warning", 5000);
      } else {
        showToast("Entry saved. Keep building momentum.");
      }
    } catch (error) {
      console.error(error);
      showToast(error.message || "The entry could not be saved.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteEntry(entryId) {
    if (readOnly || !entryId) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this entry? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteEntry(entryId);
      showToast("Entry deleted.");
    } catch (error) {
      console.error(error);
      showToast(error.message || "The entry could not be deleted.", "error");
    }
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <header className="dashboard-topbar">
          <div className="dashboard-brand">
            <span className="dashboard-brand__icon" aria-hidden="true">🏆</span>
            <span className="dashboard-brand__text">Champions Legacy</span>
          </div>

          <button className="button button--secondary" type="button" onClick={handleLogout}>
            Sign out
          </button>
        </header>

        {dataError && (
          <div className="inline-alert inline-alert--danger dashboard-data-error" role="alert">
            {dataError}
          </div>
        )}

        <WelcomeCard profile={profile} user={user} />
        <StatsCard stats={stats} />

        <div className="dashboard-insights">
          <DailyProgress goals={dailyGoals} />
          <TopCategories categories={topCategories} />
        </div>

        <section className="dashboard-section">
          <DailyGoals goals={dailyGoals} onSelect={handleCategorySelect} />
        </section>

        <div className="dashboard-workspace">
          <CategoryGrid selected={categoryId} onSelect={handleCategorySelect} />
          <EntryForm
            userId={user?.uid}
            type={categoryId}
            formData={formData}
            setFormData={setFormData}
            onSave={handleSaveEntry}
            saving={saving}
            readOnly={readOnly}
            errors={formErrors}
          />
        </div>

        <Journal
          entries={selectedEntries}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onDelete={handleDeleteEntry}
          readOnly={readOnly}
          loading={loading}
        />
      </div>

      <Toast
        message={toast?.message}
        type={toast?.type}
        onDismiss={dismissToast}
      />
    </main>
  );
}
