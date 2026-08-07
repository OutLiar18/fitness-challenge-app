import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import WorkspaceTabs, {
  WorkspacePanel,
} from "../components/common/WorkspaceTabs";
import PageHeader from "../components/layout/PageHeader";
import {
  ACTIVITY_POINT_GUIDES,
  DIFFICULTY_POINT_GUIDE,
  POINTS_GUIDE_VERSION,
  PUBLIC_GOAL_BONUSES,
  PUBLIC_LEAGUE_SCORING,
  PUBLIC_POINT_FORMULAS,
  getActivityPointGuide,
} from "../services/points/pointsGuideModel";
import {
  formatMeasurement,
  formatNumber,
  formatPoints,
} from "../utils/displayFormatters";
import "./PointsGuide.css";

const POINTS_GUIDE_TABS = Object.freeze([
  {
    id: "activities",
    label: "Activity scoring",
    icon: "🎯",
    description: "Category ladders and examples",
  },
  {
    id: "bonuses",
    label: "Bonuses & difficulty",
    icon: "✨",
    description: "Goal bonuses and moderate multipliers",
  },
  {
    id: "season",
    label: "Season scoring",
    icon: "🛡️",
    description: "Daily caps, bonuses and House allocation",
  },
  {
    id: "formulas",
    label: "Reference formulas",
    icon: "🔎",
    description: "Visible calculations for curious players",
  },
]);

function formatRangeValue(value, unit) {
  return formatMeasurement(value, unit, {
    whole: !String(unit).toLowerCase().includes("km"),
  });
}

function getRangeLabel(row, unit) {
  if (row.maximum === null) {
    return `${formatRangeValue(row.minimum, unit)} or more`;
  }

  if (row.minimum === row.maximum) {
    return formatRangeValue(row.minimum, unit);
  }

  return `${formatRangeValue(row.minimum, unit)} to ${formatRangeValue(
    row.maximum,
    unit,
  )}`;
}

function ScoreLadder({ guide }) {
  const maximumPoints = Math.max(...guide.rows.map((row) => row.points), 1);

  return (
    <div className="score-ladder">
      {guide.rows.map((row) => {
        const percentage =
          row.points === 0
            ? 0
            : Math.max(8, (row.points / maximumPoints) * 100);

        return (
          <div
            className="score-ladder__row"
            key={`${row.minimum}-${row.maximum ?? "plus"}`}
          >
            <span className="score-ladder__range">
              {getRangeLabel(row, guide.unit)}
            </span>
            <span className="score-ladder__track" aria-hidden="true">
              <span style={{ width: `${percentage}%` }} />
            </span>
            <strong>{formatPoints(row.points)}</strong>
          </div>
        );
      })}
    </div>
  );
}

function FormulaExamples({ guide }) {
  return (
    <div className="points-formula-examples">
      <code>{guide.formula}</code>
      <div>
        {guide.examples.map((example) => (
          <article key={example.input}>
            <span>{example.input}</span>
            <strong>{formatPoints(example.points)}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}

function ActivityGuidePanel({ guide }) {
  return (
    <section
      className={`points-detail card points-detail--${guide.accent}`}
      aria-labelledby={`points-detail-${guide.id}`}
    >
      <div className="points-detail__header">
        <span className="points-detail__icon" aria-hidden="true">
          {guide.icon}
        </span>
        <div>
          <p className="section-kicker">Activity point ladder</p>
          <h2 id={`points-detail-${guide.id}`}>{guide.name}</h2>
          <p>{guide.intro}</p>
        </div>
      </div>

      {guide.type === "table" ? (
        <ScoreLadder guide={guide} />
      ) : (
        <FormulaExamples guide={guide} />
      )}

      {guide.footnote && (
        <p className="points-detail__footnote">
          <strong>Important:</strong> {guide.footnote}
        </p>
      )}
    </section>
  );
}

export default function PointsGuide() {
  const [selectedGuideId, setSelectedGuideId] = useState("running");
  const [activeTab, setActiveTab] = useState("activities");
  const selectedGuide = useMemo(
    () =>
      getActivityPointGuide(selectedGuideId) ?? ACTIVITY_POINT_GUIDES[0],
    [selectedGuideId],
  );

  return (
    <div className="points-guide-page page-stack">
      <PageHeader
        eyebrow={`Public scoring reference · ${POINTS_GUIDE_VERSION}`}
        title="Points Guide"
        description="A simple view of the repeatable point calculations used by the current scoring engine. Choose a category to inspect its scoring ladder."
        icon="📊"
        actions={
          <Link className="button button--secondary" to="/rules">
            Read the Rulebook
          </Link>
        }
      />

      <section className="points-guide-intro card" aria-labelledby="points-purpose-title">
        <div>
          <p className="section-kicker">One action, one calculation</p>
          <h2 id="points-purpose-title">Your entries provide the facts</h2>
          <p>
            The app applies the current point table automatically. Statistics,
            personal points and league scores remain separate so each can serve
            its own purpose.
          </p>
        </div>

        <div className="points-guide-intro__facts">
          <article>
            <span aria-hidden="true">🔎</span>
            <strong>Visible</strong>
            <small>Repeatable scoring only</small>
          </article>
          <article>
            <span aria-hidden="true">⚖️</span>
            <strong>Balanced</strong>
            <small>Difficulty matters moderately</small>
          </article>
          <article>
            <span aria-hidden="true">🧭</span>
            <strong>Versioned</strong>
            <small>Historical league rules stay frozen</small>
          </article>
        </div>
      </section>

      <WorkspaceTabs
        idPrefix="points-guide"
        label="Points Guide sections"
        tabs={POINTS_GUIDE_TABS}
        activeId={activeTab}
        onChange={setActiveTab}
      />

      <WorkspacePanel id="activities" activeId={activeTab} idPrefix="points-guide">
      <section className="points-category-picker card" aria-labelledby="category-picker-title">
        <div>
          <p className="section-kicker">Choose a category</p>
          <h2 id="category-picker-title">Explore the scoring ladders</h2>
        </div>

        <div className="points-category-picker__grid">
          {ACTIVITY_POINT_GUIDES.map((guide) => (
            <button
              key={guide.id}
              className={`points-category-button points-category-button--${guide.accent}${
                selectedGuide.id === guide.id
                  ? " points-category-button--active"
                  : ""
              }`}
              type="button"
              aria-pressed={selectedGuide.id === guide.id}
              onClick={() => setSelectedGuideId(guide.id)}
            >
              <span aria-hidden="true">{guide.icon}</span>
              <strong>{guide.name}</strong>
            </button>
          ))}
        </div>
      </section>

      <ActivityGuidePanel guide={selectedGuide} />

      </WorkspacePanel>

      <WorkspacePanel id="bonuses" activeId={activeTab} idPrefix="points-guide">
      <section className="points-difficulty card" aria-labelledby="difficulty-title">
        <div className="points-section-heading">
          <p className="section-kicker">Difficulty multipliers</p>
          <h2 id="difficulty-title">A moderate reward for harder activities</h2>
          <p>
            Cardio applies the multiplier after duration points. Workouts apply
            it to repetitions before using the workout table.
          </p>
        </div>

        <div className="difficulty-scale">
          {DIFFICULTY_POINT_GUIDE.map((difficulty) => (
            <article key={difficulty.tier}>
              <span>Tier {difficulty.tier}</span>
              <strong>{difficulty.name}</strong>
              <em>× {formatNumber(difficulty.multiplier)}</em>
            </article>
          ))}
        </div>
      </section>

        <div className="points-secondary-grid points-secondary-grid--single">
        <section className="points-bonuses card" aria-labelledby="bonuses-title">
          <div className="points-section-heading">
            <p className="section-kicker">Visible consistency bonuses</p>
            <h2 id="bonuses-title">Goal completion</h2>
          </div>

          <div className="points-bonus-list">
            {PUBLIC_GOAL_BONUSES.map((bonus) => (
              <article key={bonus.id}>
                <span aria-hidden="true">{bonus.icon}</span>
                <div>
                  <strong>{bonus.label}</strong>
                  <small>
                    {formatPoints(bonus.points)}
                    {bonus.suffix ? ` ${bonus.suffix}` : ""}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </section>

        </div>
      </WorkspacePanel>

      <WorkspacePanel id="season" activeId={activeTab} idPrefix="points-guide">
        <div className="points-secondary-grid points-secondary-grid--single">
        <section className="points-league card" aria-labelledby="league-scoring-title">
          <div className="points-section-heading">
            <p className="section-kicker">Seasonal competition</p>
            <h2 id="league-scoring-title">League day score</h2>
          </div>

          <code>{PUBLIC_LEAGUE_SCORING.formula}</code>

          <div className="points-league__values">
            <article>
              <strong>{formatPoints(PUBLIC_LEAGUE_SCORING.dailyActivityCap)}</strong>
              <span>daily activity cap</span>
            </article>
            <article>
              <strong>{formatPoints(PUBLIC_LEAGUE_SCORING.dailyParticipationBonus)}</strong>
              <span>active-day bonus</span>
            </article>
          </div>

          <div className="points-league__formulas">
            <code>{PUBLIC_LEAGUE_SCORING.houseFormula}</code>
            <code>{PUBLIC_LEAGUE_SCORING.pocketFormula}</code>
            <code>{PUBLIC_LEAGUE_SCORING.powerPlayFormula}</code>
            <code>{PUBLIC_LEAGUE_SCORING.powerPlayExclusions}</code>
          </div>

          <p>{PUBLIC_LEAGUE_SCORING.note}</p>
        </section>
        </div>
      </WorkspacePanel>

      <WorkspacePanel id="formulas" activeId={activeTab} idPrefix="points-guide">
      <section className="points-formulas card" aria-labelledby="formulas-title">
        <div className="points-section-heading">
          <p className="section-kicker">For the curious</p>
          <h2 id="formulas-title">Public formulas</h2>
          <p>Formulas only. The app handles the calculations.</p>
        </div>

        <div className="points-formulas__grid">
          {PUBLIC_POINT_FORMULAS.map((item) => (
            <article key={item.id}>
              <span>{item.label}</span>
              <code>{item.formula}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="points-guide-boundary card">
        <span aria-hidden="true">🔐</span>
        <div>
          <strong>This page intentionally stays simple</strong>
          <p>
            It lists visible, repeatable scoring. One-off progression surprises
            and non-competitive experience rewards are deliberately left out.
          </p>
        </div>
      </section>      </WorkspacePanel>
    </div>
  );
}
