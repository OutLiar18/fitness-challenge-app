import { useMemo, useState } from "react";

import {
  ANNOUNCEMENT_STATUSES,
  ANNOUNCEMENT_TYPES,
} from "../../constants/admin";
import {
  createAnnouncement,
  importBundledAnnouncements,
  updateAnnouncement,
} from "../../services/admin/announcementAdminService";
import { getAnnouncementType } from "../../constants/admin";

const EMPTY_FORM = Object.freeze({
  title: "",
  summary: "",
  body: "",
  type: "release",
  icon: "🚀",
  status: "draft",
  featured: false,
  version: "",
});

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function toFormValue(announcement) {
  if (!announcement) {
    return { ...EMPTY_FORM };
  }

  return {
    title: announcement.title,
    summary: announcement.summary,
    body: announcement.body,
    type: announcement.type,
    icon: announcement.icon,
    status: announcement.status,
    featured: announcement.featured,
    version: announcement.version,
  };
}

function formatDate(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return "Not published yet";
  }

  return dateFormatter.format(value);
}

export default function AnnouncementManager({
  announcements,
  actorId,
  notify,
}) {
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM }));
  const [saving, setSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const editingAnnouncement = announcements.find(
    (announcement) => announcement.id === editingId,
  );

  const filteredAnnouncements = useMemo(
    () =>
      announcements.filter(
        (announcement) =>
          statusFilter === "all" || announcement.status === statusFilter,
      ),
    [announcements, statusFilter],
  );

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function beginEditing(announcement) {
    setEditingId(announcement.id);
    setForm(toFormValue(announcement));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId("");
    setForm({ ...EMPTY_FORM });
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);

    try {
      if (editingAnnouncement) {
        await updateAnnouncement({
          announcement: editingAnnouncement,
          input: form,
          actorId,
        });
        notify("Announcement updated successfully.");
      } else {
        await createAnnouncement({ input: form, actorId });
        notify("Announcement created successfully.");
      }

      resetForm();
    } catch (error) {
      notify(error.message || "The announcement could not be saved.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleImport() {
    setSaving(true);

    try {
      const importedCount = await importBundledAnnouncements(actorId);
      notify(
        importedCount > 0
          ? `${importedCount} release-history announcement${
              importedCount === 1 ? " was" : "s were"
            } imported.`
          : "The bundled release history is already available in Firestore.",
      );
    } catch (error) {
      notify(error.message || "Release history could not be imported.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-announcements">
      <form className="admin-editor card" onSubmit={handleSave}>
        <div className="admin-editor__heading">
          <div>
            <p className="section-kicker">Announcement studio</p>
            <h2>{editingAnnouncement ? "Edit announcement" : "Create announcement"}</h2>
            <p>
              Draft carefully, publish deliberately and archive old messages instead
              of deleting platform history.
            </p>
          </div>
          <span aria-hidden="true">📣</span>
        </div>

        <div className="admin-form-grid">
          <label className="admin-field admin-field--wide">
            <span>Title</span>
            <input
              value={form.title}
              maxLength={90}
              required
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="A clear, useful announcement title"
            />
          </label>

          <label className="admin-field admin-field--wide">
            <span>Summary</span>
            <textarea
              value={form.summary}
              maxLength={220}
              required
              rows={3}
              onChange={(event) => updateField("summary", event.target.value)}
              placeholder="Explain the update in one concise paragraph."
            />
          </label>

          <label className="admin-field admin-field--wide">
            <span>Full message</span>
            <textarea
              value={form.body}
              maxLength={4000}
              required
              rows={8}
              onChange={(event) => updateField("body", event.target.value)}
              placeholder="Provide the context, player impact and any next steps."
            />
          </label>

          <label className="admin-field">
            <span>Type</span>
            <select
              value={form.type}
              onChange={(event) => {
                const type = event.target.value;
                updateField("type", type);
                updateField("icon", getAnnouncementType(type).icon);
              }}
            >
              {ANNOUNCEMENT_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>Status</span>
            <select
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              {ANNOUNCEMENT_STATUSES.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field">
            <span>Icon</span>
            <input
              value={form.icon}
              maxLength={8}
              onChange={(event) => updateField("icon", event.target.value)}
              placeholder="📣"
            />
          </label>

          <label className="admin-field">
            <span>Version label</span>
            <input
              value={form.version}
              maxLength={20}
              onChange={(event) => updateField("version", event.target.value)}
              placeholder="0.9.0"
            />
          </label>
        </div>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => updateField("featured", event.target.checked)}
          />
          <span>
            <strong>Feature this announcement</strong>
            <small>Only use this for the single most important current message.</small>
          </span>
        </label>

        <div className="admin-editor__actions">
          <button className="button button--primary" type="submit" disabled={saving}>
            {saving
              ? "Saving announcement…"
              : editingAnnouncement
                ? "Save changes"
                : "Create announcement"}
          </button>

          {editingAnnouncement && (
            <button className="button button--secondary" type="button" onClick={resetForm}>
              Cancel editing
            </button>
          )}

          <button
            className="button button--secondary"
            type="button"
            disabled={saving}
            onClick={handleImport}
          >
            Import release history
          </button>
        </div>
      </form>

      <section className="admin-list card" aria-labelledby="announcement-library-title">
        <div className="admin-list__header">
          <div>
            <p className="section-kicker">Publishing library</p>
            <h2 id="announcement-library-title">All announcements</h2>
          </div>

          <select
            aria-label="Filter announcements by status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">All statuses</option>
            {ANNOUNCEMENT_STATUSES.map((status) => (
              <option key={status.id} value={status.id}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {filteredAnnouncements.length === 0 ? (
          <div className="empty-state">No announcements match this filter.</div>
        ) : (
          <div className="admin-announcement-list">
            {filteredAnnouncements.map((announcement) => (
              <article className="admin-announcement-row" key={announcement.id}>
                <span className="admin-announcement-row__icon" aria-hidden="true">
                  {announcement.icon}
                </span>
                <div className="admin-announcement-row__content">
                  <div>
                    <strong>{announcement.title}</strong>
                    <span className={`status-pill status-pill--${announcement.status}`}>
                      {announcement.status}
                    </span>
                  </div>
                  <p>{announcement.summary}</p>
                  <small>
                    {announcement.type}
                    {announcement.version ? ` · Version ${announcement.version}` : ""}
                    {announcement.publishedAt
                      ? ` · Published ${formatDate(announcement.publishedAt)}`
                      : " · Not published"}
                  </small>
                </div>
                <button
                  className="button button--secondary"
                  type="button"
                  onClick={() => beginEditing(announcement)}
                >
                  Edit
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
