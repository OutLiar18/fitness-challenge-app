import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

import PageLoader from "../components/common/PageLoader";
import ThemeIcon from "../components/common/ThemeIcon";
import WorkspaceTabs, {
  WorkspacePanel,
} from "../components/common/WorkspaceTabs";
import PageHeader from "../components/layout/PageHeader";
import usePlayerData from "../hooks/usePlayerData";
import {
  ANALYTICS_RANGE_OPTIONS,
  getPersonalAnalytics,
} from "../services/analytics/analyticsModel";
import {
  formatNumber,
  formatPoints,
  pluralize,
} from "../utils/displayFormatters";
import "./Analytics.css";

const ANALYTICS_TABS = Object.freeze([
  {
    id: "trends",
    label: "Trends",
    icon: <ThemeIcon name="analytics" size={18} />,
    description: "Weekly momentum",
  },
  {
    id: "consistency",
    label: "Consistency",
    icon: <ThemeIcon name="check" size={18} />,
    description: "Latest 28 days",
  },
  {
    id: "categories",
    label: "Categories",
    icon: <ThemeIcon name="balance" size={18} />,
    description: "Activity distribution",
  },
  {
    id: "insights",
    label: "Insights",
    icon: <ThemeIcon name="info" size={18} />,
    description: "Patterns in your data",
  },
]);

const INSIGHT_ICON_NAMES = Object.freeze({
  "best-week": "trophy",
  "consistent-category": "star",
  "momentum-up": "progress",
  "momentum-steady": "coach",
  "momentum-level": "balance",
  "consistency-window": "check",
});

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
});

const longDateFormatter = new Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatShortDate(value) {
  return value instanceof Date ? shortDateFormatter.format(value) : "";
}

function formatLongDate(value) {
  return value instanceof Date ? longDateFormatter.format(value) : "Date unavailable";
}

function percentage(value, maximum) {
  if (!maximum || value <= 0) return 0;
  return Math.max(4, Math.round((value / maximum) * 100));
}

function SummaryCard({ icon, value, label, detail }) {
  return (
    <article className="analytics-summary-card card">
      <span aria-hidden="true">{icon}</span>
      <div>
        <strong>{value}</strong>
        <small>{label}</small>
        {detail && <p>{detail}</p>}
      </div>
    </article>
  );
}

export default function Analytics() {
  const { entries, loading } = usePlayerData();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedWeeks = Number(searchParams.get("weeks"));
  const rangeWeeks = ANALYTICS_RANGE_OPTIONS.includes(requestedWeeks)
    ? requestedWeeks
    : 8;
  const requestedTab = searchParams.get("tab");
  const activeTab = ANALYTICS_TABS.some((tab) => tab.id === requestedTab)
    ? requestedTab
    : "trends";

  function setAnalyticsTab(tabId) {
    const next = new URLSearchParams(searchParams);
    if (tabId === "trends") next.delete("tab");
    else next.set("tab", tabId);
    setSearchParams(next, { replace: true });
  }

  function setAnalyticsRange(weeks) {
    const next = new URLSearchParams(searchParams);
    if (weeks === 8) next.delete("weeks");
    else next.set("weeks", String(weeks));
    setSearchParams(next, { replace: true });
  }
  const analytics = useMemo(
    () => getPersonalAnalytics(entries, { rangeWeeks }),
    [entries, rangeWeeks],
  );
  const weeklyMaximum = Math.max(0, ...analytics.weeklyTrend.map((week) => week.points));
  const categoryMaximum = Math.max(0, ...analytics.categoryBalance.map((category) => category.points));
  const dailyMaximum = Math.max(0, ...analytics.dailyConsistency.map((day) => day.points));

  if (loading) {
    return <PageLoader message="Reading your activity patterns…" />;
  }

  return (
    <div className="analytics-page page-stack">
      <PageHeader
        eyebrow="Reflection and insight"
        title="Analytics"
        description="See how your activity changes over time, where your effort goes and what patterns are emerging. Analytics never changes your Points or Experience Points."
        icon={<ThemeIcon name="analytics" size={28} strokeWidth={2.2} />}
      />

      <section className="analytics-toolbar card">
        <div>
          <p className="section-kicker">Analysis window</p>
          <strong>{formatLongDate(analytics.startDate)} – {formatLongDate(analytics.endDate)}</strong>
        </div>
        <label htmlFor="analytics-range">
          Show
          <select
            id="analytics-range"
            value={rangeWeeks}
            onChange={(event) => setAnalyticsRange(Number(event.target.value))}
          >
            {ANALYTICS_RANGE_OPTIONS.map((weeks) => (
              <option key={weeks} value={weeks}>{weeks} weeks</option>
            ))}
          </select>
        </label>
      </section>

      <section className="analytics-summary-grid" aria-label="Analytics summary">
        <SummaryCard
          icon={<ThemeIcon name="check" size={22} />}
          value={formatNumber(analytics.summary.activeDays, { whole: true })}
          label="Active days"
          detail={`${analytics.summary.entries} ${pluralize(analytics.summary.entries, "entry", "entries")}`}
        />
        <SummaryCard
          icon={<ThemeIcon name="points" size={22} />}
          value={formatPoints(analytics.summary.activityPoints)}
          label="Activity points"
          detail="Goal bonuses are kept separate"
        />
        <SummaryCard
          icon={<ThemeIcon name="balance" size={22} />}
          value={formatNumber(analytics.summary.averagePointsPerActiveDay, { whole: true })}
          label="Average per active day"
          detail="A reflection metric, not a target"
        />
        <SummaryCard
          icon={<ThemeIcon name="trophy" size={22} />}
          value={analytics.summary.bestDay ? formatPoints(analytics.summary.bestDay.points) : "No data yet"}
          label="Strongest recent day"
          detail={analytics.summary.bestDay ? formatLongDate(analytics.summary.bestDay.date) : "Log activity to begin"}
        />
      </section>

      <WorkspaceTabs
        idPrefix="analytics"
        label="Analytics sections"
        tabs={ANALYTICS_TABS}
        activeId={activeTab}
        onChange={setAnalyticsTab}
      />

      <WorkspacePanel id="trends" activeId={activeTab} idPrefix="analytics">
        <article className="analytics-section card" aria-labelledby="weekly-trend-title">
          <div className="analytics-section__header">
            <div>
              <p className="section-kicker">Momentum</p>
              <h2 id="weekly-trend-title">Weekly activity trend</h2>
            </div>
            <span>Activity points only</span>
          </div>

          {analytics.summary.entries === 0 ? (
            <div className="empty-state analytics-empty-state">
              <span aria-hidden="true">
                <ThemeIcon name="analytics" size={34} strokeWidth={2.2} />
              </span>
              <h3>No activity in this window yet</h3>
              <p>Log activity to start building weekly trends and category patterns.</p>
              <Link className="button button--primary" to="/log">
                Log an activity
              </Link>
            </div>
          ) : (
            <div
              className="analytics-week-chart"
              role="list"
              aria-label="Weekly activity points and active days"
            >
              {analytics.weeklyTrend.map((week) => (
                <div
                  className="analytics-week"
                  key={week.id}
                  role="listitem"
                  aria-label={`${formatShortDate(week.startDate)}: ${week.points} activity points across ${week.activeDays} active days`}
                >
                  <div className="analytics-week__plot" aria-hidden="true">
                    <span
                      style={{ height: `${percentage(week.points, weeklyMaximum)}%` }}
                    />
                  </div>
                  <strong>{formatNumber(week.points, { whole: true })}</strong>
                  <small>{formatShortDate(week.startDate)}</small>
                  <em>{week.activeDays}d</em>
                </div>
              ))}
            </div>
          )}
        </article>
      </WorkspacePanel>

      <WorkspacePanel id="consistency" activeId={activeTab} idPrefix="analytics">
        <article className="analytics-section card" aria-labelledby="consistency-title">
          <div className="analytics-section__header">
            <div>
              <p className="section-kicker">Consistency</p>
              <h2 id="consistency-title">Latest 28 days</h2>
            </div>
            <span>Darker means more activity points</span>
          </div>

          <div
            className="analytics-heatmap"
            role="list"
            aria-label="Activity over the latest 28 days"
          >
            {analytics.dailyConsistency.map((day) => {
              const intensity = dailyMaximum > 0 ? day.points / dailyMaximum : 0;
              const intensityLevel = day.entries > 0
                ? Math.max(1, Math.min(4, Math.ceil(intensity * 4)))
                : 0;
              return (
                <span
                  key={day.dateKey}
                  role="listitem"
                  className={`analytics-day${intensityLevel ? ` analytics-day--level-${intensityLevel}` : ""}`}
                  title={`${formatLongDate(day.date)}: ${day.entries} entries, ${day.points} activity points`}
                  aria-label={`${formatLongDate(day.date)}: ${day.entries} entries and ${day.points} activity points`}
                >
                  {day.date.getDate()}
                </span>
              );
            })}
          </div>
          <div className="analytics-heatmap__legend" aria-hidden="true">
            <span>Quiet</span><i /><i /><i /><i /><span>More active</span>
          </div>
        </article>
      </WorkspacePanel>

      <WorkspacePanel id="categories" activeId={activeTab} idPrefix="analytics">
        <article className="analytics-section card" aria-labelledby="category-balance-title">
          <div className="analytics-section__header">
            <div>
              <p className="section-kicker">Activity mix</p>
              <h2 id="category-balance-title">Category balance</h2>
            </div>
          </div>

          {analytics.categoryBalance.length === 0 ? (
            <div className="empty-state">Your category pattern will appear after you log activity.</div>
          ) : (
            <div className="analytics-category-list">
              {analytics.categoryBalance.map((category) => (
                <article key={category.id}>
                  <span className="analytics-category__icon" aria-hidden="true">{category.emoji}</span>
                  <div>
                    <div className="analytics-category__heading">
                      <strong>{category.name}</strong>
                      <small>{category.points} points · {category.activeDays} active days</small>
                    </div>
                    <div className="analytics-category__track" aria-hidden="true">
                      <span style={{ width: `${percentage(category.points, categoryMaximum)}%` }} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </WorkspacePanel>

      <WorkspacePanel id="insights" activeId={activeTab} idPrefix="analytics">
        <article className="analytics-section card" aria-labelledby="analytics-insights-title">
          <div className="analytics-section__header">
            <div>
              <p className="section-kicker">What the data suggests</p>
              <h2 id="analytics-insights-title">Clear, transparent insights</h2>
            </div>
          </div>
          <div className="analytics-insight-list">
            {analytics.insights.map((insight) => (
              <article key={insight.id}>
                <span aria-hidden="true">
                  <ThemeIcon
                    name={INSIGHT_ICON_NAMES[insight.id] ?? "info"}
                    size={22}
                  />
                </span>
                <div>
                  <strong>{insight.title}</strong>
                  <p>{insight.message}</p>
                  {insight.date && <small>Week of {formatLongDate(insight.date)}</small>}
                </div>
              </article>
            ))}
          </div>
        </article>

        <section className="analytics-integrity card">
          <span aria-hidden="true">
            <ThemeIcon name="info" size={26} />
          </span>
          <div>
            <p className="section-kicker">Explainable by design</p>
            <h2>Built from your recorded activity</h2>
            <p>
              Analytics uses the same factual entries and point breakdowns used elsewhere. Running still contributes to both Running and Cardio where eligible; the page does not create a second scoring system.
            </p>
          </div>
        </section>
      </WorkspacePanel>
    </div>
  );
}
