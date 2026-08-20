import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import ThemeIcon from "../components/common/ThemeIcon";
import PageHeader from "../components/layout/PageHeader";
import { GOAL_CONFIGURATIONS, GOAL_PERIODS } from "../constants/goals";
import {
  CHALLENGE_PARTICULARS,
  RULEBOOK_SECTIONS,
  RULEBOOK_VERSION,
  RULE_STATUS_META,
  RULE_STATUSES,
} from "../constants/rulebook";
import {
  filterRulebookSections,
  getRulebookStats,
} from "../services/rules/rulebookModel";
import {
  formatMeasurement,
  formatNumber,
  pluralize,
} from "../utils/displayFormatters";
import "./Rulebook.css";

const STATUS_FILTERS = Object.freeze([
  { id: "current", label: "Current rules" },
  { id: RULE_STATUSES.SEASON, label: "Season options" },
  { id: RULE_STATUSES.INACTIVE, label: "Not active" },
  { id: "all", label: "Everything" },
]);

const RULEBOOK_SECTION_ICON_NAMES = Object.freeze({
  absolutes: "evidence",
  structure: "seasons",
  evidence: "evidence",
  "points-and-standings": "points",
  workouts: "progress",
  "water-and-fruit": "check",
  movement: "progress",
  learning: "rulebook",
  "teams-and-leagues": "houses",
  "safety-and-conduct": "info",
  "season-awards": "crown",
  "inactive-legacy": "info",
});

const PARTICULAR_ICON_NAMES = Object.freeze({
  name: "trophy",
  week: "seasons",
  "entry-window": "edit",
  objective: "progress",
});

function formatGoal(goal, period) {
  const target = goal.targets?.[period];

  if (target === undefined) {
    return "No daily target";
  }

  return formatMeasurement(target, goal.unit, {
    whole: !String(goal.unit).toLowerCase().includes("km"),
  });
}

function RuleStatusBadge({ status }) {
  const meta = RULE_STATUS_META[status];

  return (
    <span className={`rule-status rule-status--${meta.tone}`}>
      {meta.label}
    </span>
  );
}

function RuleItem({ item }) {
  return (
    <li className="rule-item">
      <div className="rule-item__meta">
        <span className="rule-item__number">Rule {item.number}</span>
        <RuleStatusBadge status={item.status} />
      </div>

      <p className="rule-item__text">{item.text}</p>

      {item.bullets?.length > 0 && (
        <ul className="rule-item__bullets">
          {item.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      )}
      {item.aside && (
        <p className="rule-item__aside">({item.aside})</p>
      )}
    </li>
  );
}

function RuleSection({ section, open, forceOpen, onToggle }) {
  return (
    <details
      id={`rules-section-${section.id}`}
      className="rule-section card"
      open={forceOpen || open}
      onToggle={(event) => onToggle(section.id, event.currentTarget.open)}
    >
      <summary className="rule-section__summary">
        <span className="rule-section__icon" aria-hidden="true">
          <ThemeIcon name={RULEBOOK_SECTION_ICON_NAMES[section.id] ?? "rulebook"} size={24} />
        </span>

        <span className="rule-section__copy">
          <span className="rule-section__eyebrow">
            Section {section.number} · {section.rules.length}{" "}
            {pluralize(section.rules.length, "rule", "rules")}
          </span>
          <strong>{section.title}</strong>
          <small>{section.summary}</small>
        </span>

        <span className="rule-section__chevron" aria-hidden="true">
          ⌄
        </span>
      </summary>

      <ol className="rule-section__list">
        {section.rules.map((item) => (
          <RuleItem key={item.id} item={item} />
        ))}
      </ol>
    </details>
  );
}

export default function Rulebook() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const requestedStatus = searchParams.get("status") || "current";
  const statusFilter = STATUS_FILTERS.some((filter) => filter.id === requestedStatus)
    ? requestedStatus
    : "current";
  const [openSections, setOpenSections] = useState(
    () => new Set(["absolutes", "structure"]),
  );

  const stats = useMemo(() => getRulebookStats(), []);
  const filteredSections = useMemo(
    () =>
      filterRulebookSections(RULEBOOK_SECTIONS, {
        query,
        status: statusFilter,
      }),
    [query, statusFilter],
  );
  const visibleRuleCount = filteredSections.reduce(
    (total, section) => total + section.rules.length,
    0,
  );
  const forceOpen = Boolean(query.trim());

  function setRuleQuery(value) {
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set("q", value);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  }

  function setRuleStatus(status) {
    const next = new URLSearchParams(searchParams);
    if (status === "current") next.delete("status");
    else next.set("status", status);
    setSearchParams(next, { replace: true });
  }

  function clearRuleFilters() {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    next.delete("status");
    setSearchParams(next, { replace: true });
  }

  function handleToggle(sectionId, isOpen) {
    if (forceOpen) {
      return;
    }

    setOpenSections((current) => {
      const next = new Set(current);

      if (isOpen) {
        next.add(sectionId);
      } else {
        next.delete(sectionId);
      }

      return next;
    });
  }

  function expandVisibleSections() {
    setOpenSections(new Set(filteredSections.map((section) => section.id)));
  }

  function collapseAllSections() {
    setOpenSections(new Set());
  }

  function openSection(sectionId) {
    setOpenSections((current) => new Set([...current, sectionId]));
  }

  return (
    <div className="rulebook-page page-stack">
      <PageHeader
        eyebrow={`Official challenge reference · ${RULEBOOK_VERSION}`}
        title="Challenge Rulebook"
        description="The rules that govern everyday activity, season competition and inactive mechanics—numbered and organised for quick reference."
        icon={<ThemeIcon name="rulebook" size={28} strokeWidth={2.2} />}
        actions={
          <Link className="button button--primary" to="/points-guide">
            View Points Guide
          </Link>
        }
      />

      <section className="rulebook-intro card" aria-labelledby="rulebook-purpose-title">
        <div>
          <p className="section-kicker">The spirit of the challenge</p>
          <h2 id="rulebook-purpose-title">Progress over perfection</h2>
          <blockquote>
            “Sweat, smile, and stumble forward together. Progress over
            perfection, laughter over limits.”
          </blockquote>
          <p>
            Use this as the live reference for how Champions Legacy Challenge
            works. Current rules apply across the app, Season options activate
            only when a season uses them, and inactive mechanics are reference only.
          </p>
        </div>

        <div className="rulebook-stats" aria-label="Rulebook summary">
          <article>
            <strong>{formatNumber(stats.current, { whole: true })}</strong>
            <span>current rules</span>
          </article>
          <article>
            <strong>{formatNumber(stats.season, { whole: true })}</strong>
            <span>season options</span>
          </article>
          <article>
            <strong>{formatNumber(stats.inactive, { whole: true })}</strong>
            <span>inactive mechanics</span>
          </article>
        </div>
      </section>

      <section className="rulebook-particulars" aria-labelledby="particulars-title">
        <div className="rulebook-section-heading">
          <p className="section-kicker">At a glance</p>
          <h2 id="particulars-title">Particulars of the challenge</h2>
        </div>

        <div className="rulebook-particulars__grid">
          {CHALLENGE_PARTICULARS.map((item) => (
            <article key={item.id} className="rulebook-particular card">
              <span aria-hidden="true"><ThemeIcon name={PARTICULAR_ICON_NAMES[item.id] ?? "rulebook"} size={22} /></span>
              <div>
                <small>{item.label}</small>
                <strong>{item.value}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rulebook-goals card" aria-labelledby="targets-title">
        <div className="rulebook-section-heading">
          <p className="section-kicker">Current targets</p>
          <h2 id="targets-title">Daily and weekly minimums</h2>
          <p>
            Goals encourage balanced participation. Point thresholds are shown
            separately in the Points Guide.
          </p>
        </div>

        <div className="rulebook-goals__table-wrap">
          <table className="rulebook-goals__table">
            <thead>
              <tr>
                <th scope="col">Activity</th>
                <th scope="col">Daily goal</th>
                <th scope="col">Weekly goal</th>
              </tr>
            </thead>
            <tbody>
              {GOAL_CONFIGURATIONS.map((goal) => (
                <tr key={goal.id}>
                  <th scope="row">
                    <span aria-hidden="true">{goal.emoji}</span>
                    {goal.name}
                  </th>
                  <td>{formatGoal(goal, GOAL_PERIODS.DAILY)}</td>
                  <td>{formatGoal(goal, GOAL_PERIODS.WEEKLY)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rulebook-tools card" aria-label="Rulebook controls">
        <label className="rulebook-search">
          <span>Search the rulebook</span>
          <input
            type="search"
            value={query}
            placeholder="Try “running”, “fruit”, “House” or “1.3”"
            onChange={(event) => setRuleQuery(event.target.value)}
          />
        </label>

        <div className="rulebook-filter-group" aria-label="Rule status filter">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.id}
              className={`rulebook-filter${
                statusFilter === filter.id ? " rulebook-filter--active" : ""
              }`}
              type="button"
              aria-pressed={statusFilter === filter.id}
              onClick={() => setRuleStatus(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="rulebook-tool-actions">
          <span aria-live="polite">
            {visibleRuleCount} {pluralize(visibleRuleCount, "rule", "rules")}
          </span>
          <button className="button button--secondary" type="button" onClick={expandVisibleSections}>
            Expand all
          </button>
          <button className="button button--ghost" type="button" onClick={collapseAllSections}>
            Collapse all
          </button>
        </div>
      </section>

      <nav className="rulebook-jump card" aria-label="Rulebook sections">
        <p>Jump to a section</p>
        <div>
          {filteredSections.map((section) => (
            <a
              key={section.id}
              href={`#rules-section-${section.id}`}
              onClick={() => openSection(section.id)}
            >
              <span aria-hidden="true"><ThemeIcon name={RULEBOOK_SECTION_ICON_NAMES[section.id] ?? "rulebook"} size={17} /></span>
              {section.title}
            </a>
          ))}
        </div>
      </nav>

      <section className="rulebook-legend card" aria-label="Rule status meaning">
        {Object.entries(RULE_STATUS_META).map(([status, meta]) => (
          <article key={status}>
            <RuleStatusBadge status={status} />
            <p>{meta.description}</p>
          </article>
        ))}
      </section>

      <div className="rulebook-sections">
        {filteredSections.map((section) => (
          <RuleSection
            key={section.id}
            section={section}
            open={openSections.has(section.id)}
            forceOpen={forceOpen}
            onToggle={handleToggle}
          />
        ))}
      </div>

      {filteredSections.length === 0 && (
        <section className="empty-state card">
          <span aria-hidden="true"><ThemeIcon name="rulebook" size={30} /></span>
          <h2>No rules match this search</h2>
          <p>Try a broader phrase or change the rule-status filter.</p>
          <button className="button button--secondary" type="button" onClick={clearRuleFilters}>
            Clear search and filters
          </button>
        </section>
      )}

      <section className="rulebook-final card">
        <span aria-hidden="true"><ThemeIcon name="balance" size={25} /></span>
        <div>
          <strong>When a rule is uncertain</strong>
          <p>
            Honesty, fairness, safety and long-term personal growth take
            precedence over competitive advantage. Official changes should be
            announced before they affect an active season.
          </p>
        </div>
      </section>
    </div>
  );
}
