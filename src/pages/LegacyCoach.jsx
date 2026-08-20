import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Toast from "../components/common/Toast/Toast";
import WorkspaceTabs, {
  WorkspacePanel,
} from "../components/common/WorkspaceTabs";
import ThemeIcon from "../components/common/ThemeIcon";
import PageHeader from "../components/layout/PageHeader";
import { COACH_FOCUSES, COACH_TONES } from "../constants/coach";
import useCoach from "../hooks/useCoach";
import usePlayerData from "../hooks/usePlayerData";
import useToast from "../hooks/useToast";
import { saveCoachPreferences } from "../services/coach/coachService";
import { formatNumber, formatPoints, pluralize } from "../utils/displayFormatters";
import "./LegacyCoach.css";

const COACH_TABS = Object.freeze([
  {
    id: "recommendations",
    label: "Recommendations",
    icon: <ThemeIcon name="coach" size={18} />,
    description: "Practical next actions",
  },
  {
    id: "evidence",
    label: "Evidence",
    icon: <ThemeIcon name="evidence" size={18} />,
    description: "What the coach used",
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: <ThemeIcon name="admin" size={18} />,
    description: "Tone, focus and visibility",
  },
]);

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
    <form
      className="coach-preferences card"
      onSubmit={handleSubmit}
      aria-busy={saving || undefined}
    >
      <div>
        <p className="section-kicker">Your control</p>
        <h2>Choose how guidance should feel</h2>
        <p>Legacy Coach is optional. Changing these settings never changes points, goals or league standings.</p>
      </div>

      <label className="coach-toggle">
        <input
          type="checkbox"
          checked={form.enabled}
          disabled={saving}
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
          <select
            id="coach-tone"
            value={form.tone}
            disabled={saving}
            onChange={(event) => setForm((current) => ({ ...current, tone: event.target.value }))}
          >
            {COACH_TONES.map((tone) => <option key={tone.id} value={tone.id}>{tone.label}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="coach-focus">Primary focus</label>
          <select
            id="coach-focus"
            value={form.focus}
            disabled={saving}
            onChange={(event) => setForm((current) => ({ ...current, focus: event.target.value }))}
          >
            {COACH_FOCUSES.map((focus) => <option key={focus.id} value={focus.id}>{focus.label}</option>)}
          </select>
        </div>
      </div>

      <button className="button button--primary" type="submit" disabled={saving}>{saving ? "Saving preferences…" : "Save preferences"}</button>
    </form>
  );
}

export default function LegacyCoach() {
  const { user } = usePlayerData();
  const { preferences, report, error } = useCoach();
  const { toast, showToast, dismissToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const defaultTab = preferences.enabled ? "recommendations" : "preferences";
  const activeTab = COACH_TABS.some((tab) => tab.id === requestedTab)
    ? requestedTab
    : defaultTab;

  function setCoachTab(tabId) {
    const next = new URLSearchParams(searchParams);
    if (tabId === defaultTab) next.delete("tab");
    else next.set("tab", tabId);
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="coach-page page-stack">
      <PageHeader
        eyebrow="Transparent guidance"
        title="Legacy Coach"
        description="Understand your recent patterns and choose one realistic next action. Every recommendation shows the evidence behind it."
        icon={<ThemeIcon name="coach" size={28} strokeWidth={2.2} />}
      />

      {error && <div className="inline-alert inline-alert--danger" role="alert">{error}</div>}

      <section className="coach-hero card">
        <div>
          <p className="section-kicker">Last 7 days</p>
          <h2>{preferences.enabled ? "Your week, explained" : "Guidance is paused"}</h2>
          <blockquote>{preferences.enabled ? report.summary : "Your judgement remains in charge. Legacy Coach will remain quiet until you enable it again."}</blockquote>
        </div>
        <span aria-hidden="true"><ThemeIcon name="compass" size={42} strokeWidth={2.2} /></span>
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

      <WorkspaceTabs
        idPrefix="coach"
        label="Legacy Coach sections"
        tabs={COACH_TABS.map((tab) =>
          tab.id === "recommendations"
            ? { ...tab, badge: report.recommendations.length }
            : tab,
        )}
        activeId={activeTab}
        onChange={setCoachTab}
      />

      <WorkspacePanel id="recommendations" activeId={activeTab} idPrefix="coach">
        {preferences.enabled ? (
          <section className="coach-recommendations">
            <div className="community-section-heading">
              <div><p className="section-kicker">Next actions</p><h2>Recommendations with reasons</h2></div>
              <span>{report.recommendations.length} {pluralize(report.recommendations.length, "suggestion", "suggestions")}</span>
            </div>
            {report.recommendations.length === 0 ? (
              <div className="empty-state coach-empty-state">
                <span aria-hidden="true"><ThemeIcon name="check" size={20} /></span>
                <h3>No recommendation needs your attention</h3>
                <p>Keep recording factual activity. Legacy Coach will surface a practical next step when the pattern supports one.</p>
              </div>
            ) : (
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
            )}
          </section>
        ) : (
          <section className="empty-state card">
            Guidance is paused. Open Preferences to enable Legacy Coach again.
          </section>
        )}
      </WorkspacePanel>

      <WorkspacePanel id="evidence" activeId={activeTab} idPrefix="coach">
        <section className="coach-evidence card">
          <div>
            <p className="section-kicker">Evidence used</p>
            <h2>No hidden judgement</h2>
            <p>Legacy Coach uses only your own factual entries from the current and previous 7-day periods. It does not diagnose health conditions, claim certainty or send data to an external artificial-intelligence service.</p>
          </div>
          <ul>
            {report.evidence.map((item) => <li key={item}><span aria-hidden="true"><ThemeIcon name="check" size={17} /></span>{item}</li>)}
          </ul>
        </section>

        <section className="community-guardrail card">
          <span aria-hidden="true"><ThemeIcon name="info" size={26} /></span>
          <div><p className="section-kicker">Human first</p><h2>Advice, not authority</h2><p><em>Legacy Coach should help you notice patterns—not replace your judgement, a qualified professional or the reality of your circumstances.</em></p></div>
        </section>
      </WorkspacePanel>

      <WorkspacePanel id="preferences" activeId={activeTab} idPrefix="coach">
        <CoachPreferences
          key={`${preferences.enabled}-${preferences.tone}-${preferences.focus}`}
          userId={user?.uid}
          preferences={preferences}
          notify={showToast}
        />
      </WorkspacePanel>

      <Toast message={toast?.message} type={toast?.type} onDismiss={dismissToast} />
    </div>
  );
}
