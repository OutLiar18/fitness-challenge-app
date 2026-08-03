import { useMemo, useState } from "react";

import {
  DEFAULT_LIBRARY_RELEASE_VERSION,
  MAX_LIBRARY_ITEMS_PER_RELEASE,
} from "../../constants/libraryPublishing";
import {
  archivePublishedLibraryItem,
  publishLibraryRelease,
} from "../../services/admin/libraryPublishingService";
import {
  getPublishableSuggestions,
  getSuggestionLibraryType,
} from "../../services/admin/libraryPublishingModel";
import { formatNumber, pluralize } from "../../utils/displayFormatters";

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(value) {
  const date = value?.toDate?.() ?? value;

  return date instanceof Date && !Number.isNaN(date.getTime())
    ? dateFormatter.format(date)
    : "Date unavailable";
}

function getSuggestionName(suggestion) {
  return suggestion.definition?.name || "Unnamed suggestion";
}

export default function LibraryPublisher({
  suggestions,
  libraryItems,
  releases,
  actorId,
  notify,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [version, setVersion] = useState(DEFAULT_LIBRARY_RELEASE_VERSION);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const publishableSuggestions = useMemo(
    () => getPublishableSuggestions(suggestions),
    [suggestions],
  );
  const selectedSuggestions = useMemo(
    () =>
      publishableSuggestions.filter((suggestion) =>
        selectedIds.includes(
          `${suggestion.collectionName}:${suggestion.id}`,
        ),
      ),
    [publishableSuggestions, selectedIds],
  );

  function toggleSuggestion(suggestion) {
    const key = `${suggestion.collectionName}:${suggestion.id}`;

    setSelectedIds((current) => {
      if (current.includes(key)) {
        return current.filter((item) => item !== key);
      }

      if (current.length >= MAX_LIBRARY_ITEMS_PER_RELEASE) {
        notify(
          `A library release can include no more than ${MAX_LIBRARY_ITEMS_PER_RELEASE} items.`,
          "warning",
        );
        return current;
      }

      return [...current, key];
    });
  }

  async function handlePublish(event) {
    event.preventDefault();
    setBusy(true);

    try {
      const result = await publishLibraryRelease({
        suggestions: selectedSuggestions,
        version,
        notes,
        actorId,
      });

      notify(
        `${result.itemCount} ${pluralize(
          result.itemCount,
          "library item was",
          "library items were",
        )} published in release ${result.version}.`,
      );
      setSelectedIds([]);
      setNotes("");
    } catch (error) {
      notify(
        error.message || "The library release could not be published.",
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleArchive(item) {
    const confirmed = window.confirm(
      `Archive ${item.name}? Players will no longer see it as a shared option, but historical entries will remain valid.`,
    );

    if (!confirmed) {
      return;
    }

    setBusy(true);

    try {
      await archivePublishedLibraryItem({ item, actorId });
      notify(`${item.name} was archived from the shared library.`);
    } catch (error) {
      notify(
        error.message || "The shared library item could not be archived.",
        "error",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-library">
      <section className="admin-editor card">
        <div className="admin-editor__heading">
          <div>
            <p className="section-kicker">Versioned publishing</p>
            <h2>Publish approved suggestions</h2>
            <p>
              Approval confirms that a suggestion is suitable. Publishing adds
              it to the shared player library under an explicit release version.
            </p>
          </div>
          <span aria-hidden="true">📚</span>
        </div>

        {publishableSuggestions.length === 0 ? (
          <div className="empty-state admin-library__empty">
            No approved suggestions are waiting for publication.
          </div>
        ) : (
          <form onSubmit={handlePublish}>
            <div className="library-candidate-list">
              {publishableSuggestions.map((suggestion) => {
                const key = `${suggestion.collectionName}:${suggestion.id}`;
                const selected = selectedIds.includes(key);

                return (
                  <label
                    className={`library-candidate${
                      selected ? " library-candidate--selected" : ""
                    }`}
                    key={key}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={
                        !selected &&
                        selectedIds.length >= MAX_LIBRARY_ITEMS_PER_RELEASE
                      }
                      onChange={() => toggleSuggestion(suggestion)}
                    />
                    <span aria-hidden="true">
                      {getSuggestionLibraryType(suggestion) === "exercise"
                        ? "🏋️"
                        : getSuggestionLibraryType(suggestion) === "cardio"
                          ? "❤️"
                          : "🎯"}
                    </span>
                    <span>
                      <strong>{getSuggestionName(suggestion)}</strong>
                      <small>
                        {getSuggestionLibraryType(suggestion)} · Approved{" "}
                        {formatDate(suggestion.reviewedAt)}
                      </small>
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="admin-form-grid">
              <label className="admin-field">
                <span>Library release version</span>
                <input
                  value={version}
                  required
                  maxLength={40}
                  placeholder="0.14.0"
                  onChange={(event) => setVersion(event.target.value)}
                />
              </label>

              <label className="admin-field admin-field--wide">
                <span>Release notes</span>
                <textarea
                  value={notes}
                  rows={4}
                  required
                  minLength={10}
                  maxLength={1000}
                  placeholder="Explain what was added and why it is ready for the shared library."
                  onChange={(event) => setNotes(event.target.value)}
                />
              </label>
            </div>

            <p className="admin-form-help">
              {formatNumber(selectedSuggestions.length, { whole: true })} of{" "}
              {MAX_LIBRARY_ITEMS_PER_RELEASE} release slots selected.
            </p>

            <div className="admin-editor__actions">
              <button
                className="button button--primary"
                type="submit"
                disabled={busy || selectedSuggestions.length === 0}
              >
                Publish {formatNumber(selectedSuggestions.length, { whole: true })}{" "}
                {pluralize(
                  selectedSuggestions.length,
                  "selected item",
                  "selected items",
                )}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="admin-list card">
        <div className="admin-list__header">
          <div>
            <p className="section-kicker">Shared activity library</p>
            <h2>Published items</h2>
          </div>
          <strong>
            {formatNumber(libraryItems.length, { whole: true })} total
          </strong>
        </div>

        {libraryItems.length === 0 ? (
          <div className="empty-state">
            No community suggestions have been published yet.
          </div>
        ) : (
          <div className="published-library-list">
            {libraryItems.map((item) => (
              <article className="published-library-row" key={item.id}>
                <span aria-hidden="true">
                  {item.itemType === "exercise"
                    ? "🏋️"
                    : item.itemType === "cardio"
                      ? "❤️"
                      : "🎯"}
                </span>
                <div>
                  <div>
                    <strong>{item.name}</strong>
                    <span className={`status-pill status-pill--${item.status}`}>
                      {item.status}
                    </span>
                  </div>
                  <small>
                    {item.itemType} · Release {item.libraryVersion} · Published{" "}
                    {formatDate(item.publishedAt)}
                  </small>
                </div>
                {item.status === "published" && (
                  <button
                    className="button button--secondary button--compact"
                    type="button"
                    disabled={busy}
                    onClick={() => handleArchive(item)}
                  >
                    Archive
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="admin-list card">
        <div className="admin-list__header">
          <div>
            <p className="section-kicker">Release history</p>
            <h2>Global library releases</h2>
          </div>
          <strong>{formatNumber(releases.length, { whole: true })} shown</strong>
        </div>

        {releases.length === 0 ? (
          <div className="empty-state">No global library releases yet.</div>
        ) : (
          <div className="library-release-list">
            {releases.map((release) => (
              <article className="library-release-row" key={release.id}>
                <span aria-hidden="true">🚀</span>
                <div>
                  <strong>Release {release.version}</strong>
                  <p>{release.notes || "No release notes were provided."}</p>
                  <small>
                    {formatNumber(release.itemCount, { whole: true })}{" "}
                    {pluralize(release.itemCount, "item", "items")} ·{" "}
                    {formatDate(release.publishedAt)}
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
