import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import CategoryGrid from "../components/categories/CategoryGrid";
import Toast from "../components/common/Toast/Toast";
import EntryForm from "../components/entries/EntryForm";
import Journal from "../components/journal/Journal";
import PageHeader from "../components/layout/PageHeader";
import usePlayerData from "../hooks/usePlayerData";
import useToast from "../hooks/useToast";
import {
  isEditableDate,
  normalizeChallengeDate,
} from "../services/dateService";
import { deleteEntry, saveChallengeEntry } from "../services/entries";
import { getValidationMessage } from "../services/messageService";
import { getEntriesForDate } from "../services/statistics";
import { getCategory } from "../utils/categoryHelpers";
import "./ActivityLog.css";

function getInitialFormData(categoryId) {
  return categoryId === "reading" ? { completed: false } : {};
}

function getSafeCategoryId(value) {
  return getCategory(value)?.id ?? "water";
}

function ActivityLogWorkspace({ categoryId, onCategoryChange }) {
  const { user, entries, loading } = usePlayerData();
  const { toast, showToast, dismissToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(() =>
    normalizeChallengeDate(new Date()),
  );
  const [formData, setFormData] = useState(() =>
    getInitialFormData(categoryId),
  );
  const [formErrors, setFormErrors] = useState([]);
  const [saving, setSaving] = useState(false);

  const readOnly = !isEditableDate(selectedDate);

  const selectedEntries = useMemo(
    () => getEntriesForDate(entries, selectedDate),
    [entries, selectedDate],
  );

  function resetForm(nextCategoryId) {
    setFormData(getInitialFormData(nextCategoryId));
    setFormErrors([]);
  }

  function handleCategorySelect(nextCategoryId) {
    const safeCategoryId = getSafeCategoryId(nextCategoryId);

    if (safeCategoryId === categoryId) {
      resetForm(safeCategoryId);
      return;
    }

    onCategoryChange(safeCategoryId);
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

      const nextCategory = getSafeCategoryId(
        result.nextCategory ?? categoryId,
      );

      if (nextCategory === categoryId) {
        resetForm(nextCategory);
      } else {
        onCategoryChange(nextCategory);
      }

      showToast(
        result.warning || "Entry saved. The journal has receipts.",
        result.warning ? "warning" : "success",
        result.warning ? 5000 : undefined,
      );
    } catch (error) {
      console.error(error);
      showToast(
        error.message || "The entry could not be saved.",
        "error",
      );
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
      showToast("Entry deleted. The database has agreed to forget.");
    } catch (error) {
      console.error(error);
      showToast(
        error.message || "The entry could not be deleted.",
        "error",
      );
    }
  }

  return (
    <div className="activity-page page-stack">
      <PageHeader
        eyebrow="Action centre"
        title="Log activity & review your journal"
        description="Record the facts once, then let Champions Legacy Challenge calculate points, goals, XP and progress centrally."
        icon="✍️"
      />

      <div className="activity-page__hint card">
        <span aria-hidden="true">🧠</span>
        <p>
          <strong>Honesty bonus:</strong> not an actual bonus—just the reason
          your progress remains useful.
        </p>
      </div>

      <div className="activity-workspace">
        <CategoryGrid
          selected={categoryId}
          onSelect={handleCategorySelect}
        />

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

      <Toast
        message={toast?.message}
        type={toast?.type}
        onDismiss={dismissToast}
      />
    </div>
  );
}

export default function ActivityLog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = getSafeCategoryId(searchParams.get("category"));

  function handleCategoryChange(nextCategoryId) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("category", getSafeCategoryId(nextCategoryId));
    setSearchParams(nextSearchParams, { replace: true });
  }

  return (
    <ActivityLogWorkspace
      key={categoryId}
      categoryId={categoryId}
      onCategoryChange={handleCategoryChange}
    />
  );
}
