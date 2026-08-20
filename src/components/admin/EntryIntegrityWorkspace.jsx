import { useState } from "react";

import ConfirmDialog from "../common/ConfirmDialog";
import ThemeIcon from "../common/ThemeIcon";
import EntryForm from "../entries/EntryForm";
import {
  createEntryCorrection,
  createEntryIntegrityReport,
  downloadEntryIntegrityReport,
  getEntryIntegrityBundle,
} from "../../services/entries/entryCorrectionService";
import { getEntryPointBreakdown } from "../../services/points";
import { getLocalDateKey, toDate } from "../../services/dateService";
import { formatNumber, pluralize } from "../../utils/displayFormatters";
import { getCategory } from "../../utils/categoryHelpers";
import "./EntryIntegrityWorkspace.css";

function formatDateTime(value) {
  const date = toDate(value);
  return date
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date)
    : "Unavailable";
}

function getDisplayName(bundle) {
  return (
    bundle?.profile?.displayName ||
    bundle?.profile?.fullName ||
    bundle?.claims?.[0]?.displayName ||
    "Champion"
  );
}

function DiagnosticList({ diagnostics = [] }) {
  return (
    <section className="entry-integrity__diagnostics card" aria-labelledby="entry-integrity-diagnostics">
      <div className="admin-section-heading">
        <div>
          <p className="section-kicker">Reconciliation diagnostics</p>
          <h3 id="entry-integrity-diagnostics">Derived-record health</h3>
          <p>
            These checks compare the immutable entry chain with proof and competition
            records. They never alter data automatically.
          </p>
        </div>
        <strong>{diagnostics.length} checks</strong>
      </div>
      <div className="entry-integrity__diagnostic-list">
        {diagnostics.map((item) => (
          <article
            className={`entry-integrity__diagnostic entry-integrity__diagnostic--${item.severity}`}
            key={`${item.code}-${JSON.stringify(item.details ?? {})}`}
          >
            <span aria-hidden="true">
              {item.severity === "error" ? "⛔" : item.severity === "warning" ? "⚠️" : "✅"}
            </span>
            <div>
              <strong>{item.message}</strong>
              <small>{item.code}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CorrectionChain({ bundle }) {
  return (
    <section className="entry-integrity__chain card" aria-labelledby="entry-integrity-chain">
      <div className="admin-section-heading">
        <div>
          <p className="section-kicker">Immutable history</p>
          <h3 id="entry-integrity-chain">Correction chain</h3>
          <p>
            Earlier entries remain preserved. The correction head identifies the only
            active version used by personal statistics.
          </p>
        </div>
        <strong>
          {bundle.corrections.length}{" "}
          {pluralize(bundle.corrections.length, "correction", "corrections")}
        </strong>
      </div>

      <div className="entry-integrity__chain-list">
        {bundle.chainEntries.map((entry) => {
          const category = getCategory(entry.category);
          const active = entry.id === bundle.currentEntry.id;
          return (
            <article className={active ? "is-current" : ""} key={entry.id}>
              <span aria-hidden="true">{category?.emoji ?? "🏆"}</span>
              <div>
                <div>
                  <strong>{active ? "Current factual record" : "Preserved earlier record"}</strong>
                  <small>{entry.id}</small>
                </div>
                <p>
                  {category?.name ?? entry.category} · {getLocalDateKey(entry.challengeDate)} ·{" "}
                  {formatNumber(getEntryPointBreakdown(entry).total)} personal activity points
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {bundle.corrections.length > 0 && (
        <ol className="entry-integrity__correction-list">
          {bundle.corrections.map((correction) => (
            <li key={correction.id}>
              <div>
                <strong>Correction {correction.sequence}</strong>
                <span>{formatDateTime(correction.createdAt)}</span>
              </div>
              <p>{correction.reason}</p>
              <small>
                {formatNumber(correction.sourcePoints)} → {formatNumber(correction.replacementPoints)} points ·{" "}
                {correction.pointDelta >= 0 ? "+" : ""}{formatNumber(correction.pointDelta)} change
              </small>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default function EntryIntegrityWorkspace({ actorId, notify }) {
  const [lookup, setLookup] = useState("");
  const [bundle, setBundle] = useState(null);
  const [replacementData, setReplacementData] = useState({});
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState([]);
  const [confirmingCorrection, setConfirmingCorrection] = useState(false);

  const currentCategory = getCategory(bundle?.currentEntry?.category);
  const hasBlockingDiagnostics = bundle?.diagnostics.some(
    (item) => item.severity === "error",
  );
  const currentPoints = getEntryPointBreakdown(bundle?.currentEntry ?? {}).total;
  const proposedPoints = bundle?.currentEntry
    ? getEntryPointBreakdown({
        ...bundle.currentEntry,
        data: replacementData,
      }).total
    : 0;

  async function handleLookup(event) {
    event?.preventDefault();
    if (!lookup.trim() || loading) return;
    setLoading(true);
    setErrors([]);
    try {
      const nextBundle = await getEntryIntegrityBundle(lookup);
      setBundle(nextBundle);
      setReplacementData(nextBundle.currentEntry.data ?? {});
      setReason("");
      notify?.("Entry integrity record loaded.", "success");
    } catch (error) {
      console.error(error);
      setBundle(null);
      setErrors([error.message || "The entry integrity record could not be loaded."]);
      notify?.(error.message || "The entry could not be found.", "error");
    } finally {
      setLoading(false);
    }
  }

  function requestCorrection() {
    if (!bundle?.currentEntry || saving) return;
    setConfirmingCorrection(true);
  }

  async function handleCorrection() {
    if (!bundle?.currentEntry || saving) return;
    setSaving(true);
    setErrors([]);
    try {
      const nextBundle = await createEntryCorrection({
        lookup: bundle.currentEntry.id,
        replacementData,
        reason,
        actorId,
      });
      setBundle(nextBundle);
      setLookup(nextBundle.currentEntry.id);
      setReplacementData(nextBundle.currentEntry.data ?? {});
      setReason("");
      setConfirmingCorrection(false);
      notify?.("The audited factual correction was completed.", "success", 6500);
    } catch (error) {
      console.error(error);
      const message = error.message || "The correction could not be completed.";
      setErrors([message]);
      setConfirmingCorrection(false);
      notify?.(message, "error", 6500);
    } finally {
      setSaving(false);
    }
  }

  function handleDownload() {
    if (!bundle) return;
    downloadEntryIntegrityReport(createEntryIntegrityReport(bundle));
    notify?.("Entry integrity report downloaded.", "success");
  }

  return (
    <div className="entry-integrity admin-integrity">
      <section className="entry-integrity__intro card">
        <div>
          <p className="section-kicker">Audited factual corrections</p>
          <h2>Entry integrity and reconciliation</h2>
          <p>
            Search by entry ID or WhatsApp verification ID. Corrections create a new
            factual entry, preserve every earlier version and use immutable reversal
            and replacement records for season points.
          </p>
        </div>
        <span aria-hidden="true"><ThemeIcon name="evidence" size={32} /></span>
      </section>

      <form className="entry-integrity__search card" onSubmit={handleLookup}>
        <label>
          <span>Entry ID or verification ID</span>
          <input
            type="search"
            value={lookup}
            onChange={(event) => setLookup(event.target.value)}
            placeholder="Entry document ID or RUN-7K4M9Q"
            autoComplete="off"
          />
        </label>
        <button className="button button--primary" type="submit" disabled={loading || !lookup.trim()}>
          {loading ? "Loading record…" : "Inspect entry"}
        </button>
      </form>

      {errors.length > 0 && (
        <div className="inline-alert inline-alert--danger" role="alert">
          <strong>The integrity workflow needs attention.</strong>
          <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>
        </div>
      )}

      {bundle && (
        <>
          <section className="entry-integrity__summary card">
            <div className="admin-section-heading">
              <div>
                <p className="section-kicker">Current resolved record</p>
                <h3>{getDisplayName(bundle)} · {currentCategory?.name ?? bundle.currentEntry.category}</h3>
                <p>
                  Challenge date {getLocalDateKey(bundle.currentEntry.challengeDate)} · current entry{" "}
                  <code>{bundle.currentEntry.id}</code>
                </p>
              </div>
              <button className="button button--secondary" type="button" onClick={handleDownload}>
                Download integrity report
              </button>
            </div>
            <div className="entry-integrity__metrics">
              <article><span>Current points</span><strong>{formatNumber(currentPoints)}</strong></article>
              <article><span>Proposed points</span><strong>{formatNumber(proposedPoints)}</strong></article>
              <article><span>Competition records</span><strong>{bundle.contributions.length}</strong></article>
              <article><span>Proof claims</span><strong>{bundle.claims.length}</strong></article>
            </div>
          </section>

          <DiagnosticList diagnostics={bundle.diagnostics} />
          <CorrectionChain bundle={bundle} />

          <section className="entry-integrity__editor" aria-labelledby="entry-integrity-editor">
            {bundle.currentEntry.source === "pocket" ? (
              <div className="inline-alert" id="entry-integrity-editor">
                Pocket redemptions remain final activation records. This release diagnoses
                their derived records but does not replace them through the standard factual
                correction workflow.
              </div>
            ) : hasBlockingDiagnostics ? (
              <div className="inline-alert inline-alert--danger" id="entry-integrity-editor" role="alert">
                This chain has unresolved integrity errors. Download the integrity report and
                reconcile the missing records before creating another immutable replacement.
              </div>
            ) : (
              <>
                <EntryForm
                  userId={actorId}
                  type={bundle.currentEntry.category}
                  formData={replacementData}
                  setFormData={setReplacementData}
                  onSave={requestCorrection}
                  saving={saving}
                  errors={errors}
                  eyebrow="Immutable replacement"
                  title={`Correct ${currentCategory?.name ?? "activity"} facts`}
                  description="Change only the incorrect factual fields. The category and challenge date stay fixed so historical season attribution remains stable."
                  notice={`Current personal activity points: ${formatNumber(currentPoints)} · proposed: ${formatNumber(proposedPoints)}.`}
                  submitLabel="Create audited replacement"
                  savingLabel="Creating correction…"
                />
                <label className="entry-integrity__reason card">
                  <span>Mandatory correction reason</span>
                  <textarea
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    rows="4"
                    maxLength="500"
                    placeholder="Explain the factual mistake and why this replacement is required."
                  />
                  <small>{reason.trim().length}/500 characters · minimum 8</small>
                </label>
              </>
            )}
          </section>
        </>
      )}
      <ConfirmDialog
        open={confirmingCorrection}
        title="Create this audited replacement?"
        description="A new immutable factual entry and matching competition reversals will be created. The earlier entry remains preserved for audit."
        confirmLabel="Create audited replacement"
        loading={saving}
        loadingLabel="Creating correction…"
        onConfirm={handleCorrection}
        onCancel={() => !saving && setConfirmingCorrection(false)}
      />
    </div>
  );
}
