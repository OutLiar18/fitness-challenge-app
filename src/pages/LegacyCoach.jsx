import { useState } from "react";

import Toast from "../components/common/Toast/Toast";
import PageHeader from "../components/layout/PageHeader";
import { COACH_FOCUSES, COACH_TONES } from "../constants/coach";
import useCoach from "../hooks/useCoach";
import usePlayerData from "../hooks/usePlayerData";
import useToast from "../hooks/useToast";
import { saveCoachPreferences } from "../services/coach/coachService";
import { formatNumber, formatPoints, pluralize } from "../utils/displayFormatters";
import "./LegacyCoach.css";

function ChangeValue({ value, unit }) {
  const numericValue = Number(value ?? 0);
  const prefix = numericValue > 0 ? "+" : "";
  const tone = numericValue > 0 ? "positive" : numericValue < 0 ? "negative" : "neutral";

  return (
    <span className={`coach-change coach-change--${tone}`}>
      {prefix}{formatNumber(numericValue, { whole: true })} {unit}
    </span>
  );
}

function CoachPreferences({ userId, preferences, notify }) {
  const [form, setForm] = useState(preferences);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await saveCoachPreferences(userId, form);
      notify("Legacy Coach preferences saved.", "success");
    } catch (error) {
      console.error(error);
      notify(error.message || "Coach preferences could not be saved.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="coach-preferences card" onSubmit={handleSubmit}>
      <div>
        <p className="section-kicker">Your control</p>
        <h2>Choose how guidance should feel</h2>
        <p>Legacy Coach is optional. Changing these settings never changes points, goals or league standings.</p>
      </div>

      <label className="coach-toggle">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(event) => setForm((current) => ({ ...current, enabled: event.target.checked }))}
        />
        <span>
          <strong>Enable Legacy Coach guidance</strong>
          <small>When disabled, your activity data remains available to you but recommendations are hidden.</small>
        </span>
      </label>

      <div className="coach-preference-grid">
        <div className="form-field">
          <label htmlFor="coach-tone">Coaching tone</label>
          <select id="coach-tone" value={form.tone} onChange={(event) => setForm((current) => ({ ...current, tone: event.target.value }))}>
            {COACH_TONES.map((tone) => <option key={tone.id} value={tone.id}>{tone.label}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="coach-focus">Primary focus</label>
          <select id="coach-focus" value={form.focus} onChange={(event) => setForm((current) => ({ ...current, focus: event.target.value }))}>
            {COACH_FOCUSES.map((focus) => <option key={focus.id} value={focus.id}>{focus.label}</option>)}
          </select>
        </div>
      </div>

      <button className="button button--primary" type="submit" disabled={saving}>{saving ? "Saving preferences…" : "Save coach preferences"}</button>
    </form>
  );
}

export default function LegacyCoach() {
  const { user } = usePlayerData();
  const { preferences, report, error } = useCoach();
  const { toast, showToast, dismissToast } = useToast();

  return (
    <div className="coach-page page-stack">
      <PageHeader
        eyebrow="Transparent guidance"
        title="Legacy Coach"
        description="Understand your recent patterns and choose one realistic next action. Every recommendation shows the evidence behind it."
        icon="✨"
      />

      {error && <div className="inline-alert inline-alert--danger" role="alert">{error}</div>}

      <section className="coach-hero card">
        <div>
          <p className="section-kicker">Last 7 days</p>
          <h2>{preferences.enabled ? "Your week, explained" : "Guidance is paused"}</h2>
          <blockquote>{preferences.enabled ? report.summary : "Your judgement remains in charge. Legacy Coach will remain quiet until you enable it again."}</blockquote>
        </div>
        <span aria-hidden="true">🧭</span>
      </section>

      <section className="coach-metrics" aria-label="Weekly coaching summary">
        <article className="card">
          <strong>{formatNumber(report.current.entryCount, { whole: true })}</strong>
          <span>{pluralize(report.current.entryCount, "entry", "entries")} this week</span>
          <ChangeValue value={report.changes.entries} unit="from last week" />
        </article>
        <article className="card">
          <strong>{report.current.activeDays}</strong>
          <span>Active {pluralize(report.current.activeDays, "day", "days")}</span>
          <ChangeValue value={report.changes.activeDays} unit="from last week" />
        </article>
        <article className="card">
          <strong>{formatPoints(report.current.points)}</strong>
          <span>Activity points this week</span>
          <ChangeValue value={report.changes.points} unit="from last week" />
        </article>
      </section>

      {preferences.enabled && (
        <section className="coach-recommendations">
          <div className="community-section-heading">
            <div><p className="section-kicker">Next actions</p><h2>Recommendations with reasons</h2></div>
            <span>{report.recommendations.length} suggestions</span>
          </div>
          <div className="coach-recommendation-grid">
            {report.recommendations.map((recommendation, index) => (
              <article className="coach-recommendation card" key={recommendation.id}>
                <span className="coach-recommendation__number">{index + 1}</span>
                <p className="section-kicker">{recommendation.category}</p>
                <h3>{recommendation.title}</h3>
                <p><strong>Try this:</strong> {recommendation.action}</p>
                <details>
                  <summary>Why this was suggested</summary>
                  <p>{recommendation.reason}</p>
                </details>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="coach-evidence card">
        <div>
          <p className="section-kicker">Evidence used</p>
          <h2>No hidden judgement</h2>
          <p>Legacy Coach uses only your own factual entries from the current and previous 7-day periods. It does not diagnose health conditions, claim certainty or send data to an external artificial-intelligence service.</p>
        </div>
        <ul>
          {report.evidence.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}
        </ul>
      </section>

      <CoachPreferences
        key={`${preferences.enabled}-${preferences.tone}-${preferences.focus}`}
        userId={user?.uid}
        preferences={preferences}
        notify={showToast}
      />

      <section className="community-guardrail card">
        <span aria-hidden="true">🌱</span>
        <div><p className="section-kicker">Human first</p><h2>Advice, not authority</h2><p><em>Legacy Coach should help you notice patterns—not replace your judgement, a qualified professional or the reality of your circumstances.</em></p></div>
      </section>

      <Toast message={toast?.message} type={toast?.type} onDismiss={dismissToast} />
    </div>
  );
}
