import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CategoryGrid from "../components/categories/CategoryGrid";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Toast from "../components/common/Toast/Toast";
import WorkspaceTabs, {
  WorkspacePanel,
} from "../components/common/WorkspaceTabs";
import EntryForm from "../components/entries/EntryForm";
import Journal from "../components/journal/Journal";
import PageHeader from "../components/layout/PageHeader";
import usePlayerData from "../hooks/usePlayerData";
import useToast from "../hooks/useToast";
import {
  addDays,
  getLocalDateKey,
  isEditableDate,
  isToday,
  isYesterday,
  normalizeChallengeDate,
} from "../services/dateService";
import { deleteEntry, saveChallengeEntry } from "../services/entries";
import { getValidationMessage } from "../services/messageService";
import { getCategory } from "../utils/categoryHelpers";
import "./ActivityLog.css";

function getInitialFormData(categoryId) {
  return categoryId === "reading" ? { completed: false } : {};
}

function getSafeCategoryId(value) {
  return getCategory(value)?.id ?? "water";
}

const ACTIVITY_TABS = Object.freeze([
  {
    id: "log",
    label: "Log activity",
    icon: "✍️",
    description: "Choose a category and record the facts",
  },
  {
    id: "journal",
    label: "Journal",
    icon: "📖",
    description: "Review and manage entries by date",
  },
]);

function ActivityLogWorkspace({
  categoryId,
  onCategoryChange,
  activeTab,
  onTabChange,
  selectedDate,
  setSelectedDate,
}) {
  const {
    user,
    entries,
    entryHistoryDateIndex,
    journalDateSummaries,
    evidenceClaims,
    loading,
  } = usePlayerData();
  const { toast, showToast, dismissToast } = useToast();
  const [formData, setFormData] = useState(() =>
    getInitialFormData(categoryId),
  );
  const [formErrors, setFormErrors] = useState([]);
  const [saving, setSaving] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState("");
  const [deleting, setDeleting] = useState(false);
  const readOnly = !isEditableDate(selectedDate);
  const selectedEntries = useMemo(
    () => entryHistoryDateIndex.get(getLocalDateKey(selectedDate)) ?? [],
    [entryHistoryDateIndex, selectedDate],
  );

  function resetForm(nextCategoryId) {
    setFormData(getInitialFormData(nextCategoryId));
    setFormErrors([]);
  }

  function handleLogDateChange(day) {
    const today = normalizeChallengeDate(new Date());
    setSelectedDate(day === "yesterday" ? addDays(today, -1) : today);
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

      const evidenceCodes = (result.evidenceClaims ?? [])
        .map((claim) => claim.verificationCode)
        .filter(Boolean);
      const successMessage = evidenceCodes.length > 0
        ? `Entry saved. Send WhatsApp proof with ID ${evidenceCodes.join(" or ")}.`
        : "Entry saved successfully.";

      showToast(
        result.warning || successMessage,
        result.warning ? "warning" : "success",
        result.warning || evidenceCodes.length > 0 ? 6500 : undefined,
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

  function handleDeleteEntry(entryId) {
    if (readOnly || !entryId || deleting) {
      return;
    }

    setPendingDeleteId(entryId);
  }

  function handleCancelDelete() {
    if (!deleting) setPendingDeleteId("");
  }

  async function handleConfirmDelete() {
    if (!pendingDeleteId || deleting) {
      return;
    }

    setDeleting(true);

    try {
      await deleteEntry(pendingDeleteId, user?.uid);
      setPendingDeleteId("");
      showToast("Entry deleted successfully.");
    } catch (error) {
      console.error(error);
      showToast(
        error.message || "The entry could not be deleted.",
        "error",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="activity-page page-stack">
      <PageHeader
        eyebrow="Action centre"
        title="Log activity & review your journal"
        description="You do the work. Log it accurately. Champions Legacy handles the maths."
        icon="✍️"
        actions={
          <ol className="activity-page__guide" aria-label="Activity logging steps">
            <li>
              <strong>1</strong>
              <span>Choose</span>
            </li>
            <li>
              <strong>2</strong>
              <span>Record</span>
            </li>
            <li>
              <strong>3</strong>
              <span>Review</span>
            </li>
          </ol>
        }
      />

      <WorkspaceTabs
        idPrefix="activity"
        label="Activity log sections"
        tabs={ACTIVITY_TABS}
        activeId={activeTab}
        onChange={onTabChange}
      />

      <WorkspacePanel id="log" activeId={activeTab} idPrefix="activity">
        <div className="activity-log-toolbar card">
          <div className="activity-log-toolbar__date">
            <span>Logging for</span>
            <div
              className="activity-log-date-tabs"
              role="group"
              aria-label="Choose activity date"
            >
              <button
                type="button"
                className={
                  isToday(selectedDate)
                    ? "activity-log-date-tab activity-log-date-tab--active"
                    : "activity-log-date-tab"
                }
                aria-pressed={isToday(selectedDate)}
                onClick={() => handleLogDateChange("today")}
              >
                Today
              </button>
              <button
                type="button"
                className={
                  isYesterday(selectedDate)
                    ? "activity-log-date-tab activity-log-date-tab--active"
                    : "activity-log-date-tab"
                }
                aria-pressed={isYesterday(selectedDate)}
                onClick={() => handleLogDateChange("yesterday")}
              >
                Yesterday
              </button>
            </div>
          </div>

          <p className="activity-log-toolbar__honesty">
            <strong>Keep the legend real.</strong>{" "}
            Log what actually happened — creative accounting belongs in fantasy
            leagues. If you are unsure what counts, check with an administrator
            before saving.
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
      </WorkspacePanel>

      <WorkspacePanel id="journal" activeId={activeTab} idPrefix="activity">
        <Journal
          entries={selectedEntries}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onDelete={handleDeleteEntry}
          readOnly={readOnly}
          loading={loading}
          evidenceClaims={evidenceClaims}
          allEntries={entries}
          dateSummaries={journalDateSummaries}
          onLogActivity={() => onTabChange("log")}
        />
      </WorkspacePanel>

      <ConfirmDialog
        open={Boolean(pendingDeleteId)}
        title="Delete this entry?"
        description="This removes the editable entry permanently. This action cannot be undone."
        confirmLabel="Delete entry"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
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
  const [selectedDate, setSelectedDate] = useState(() =>
    normalizeChallengeDate(new Date()),
  );
  const categoryId = getSafeCategoryId(searchParams.get("category"));
  const activeTab = searchParams.get("tab") === "journal" ? "journal" : "log";

  function handleCategoryChange(nextCategoryId) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("category", getSafeCategoryId(nextCategoryId));
    setSearchParams(nextSearchParams, { replace: true });
  }

  function handleTabChange(nextTabId) {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextTabId === "journal") {
      nextSearchParams.set("tab", "journal");
    } else {
      nextSearchParams.delete("tab");
    }

    setSearchParams(nextSearchParams, { replace: true });
  }

  return (
    <ActivityLogWorkspace
      key={categoryId}
      categoryId={categoryId}
      onCategoryChange={handleCategoryChange}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
    />
  );
}
