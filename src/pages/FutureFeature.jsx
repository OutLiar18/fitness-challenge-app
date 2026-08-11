import { Link, Navigate, useParams } from "react-router-dom";

import PageHeader from "../components/layout/PageHeader";
import { FUTURE_FEATURES } from "../constants/futureFeatures";
import "./FutureFeature.css";

export default function FutureFeature() {
  const { featureId } = useParams();
  const feature = FUTURE_FEATURES[featureId];

  if (!feature) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="future-page page-stack">
      <PageHeader
        eyebrow={feature.eyebrow}
        title={feature.title}
        description={feature.summary}
        icon={feature.icon}
        actions={
          <div className="future-header-actions">
            <Link className="button button--secondary" to="/dashboard">
              Return to dashboard
            </Link>
            <Link className="button button--primary" to="/log">
              Keep building today
            </Link>
          </div>
        }
      />

      <section className="future-status card">
        <span aria-hidden="true">🚧</span>
        <div>
          <span className="future-status__label">Preview only</span>
          <strong>{feature.status}</strong>
          <p>
            This preview exists so navigation and architecture can grow around the
            long-term product direction without pretending the feature is already
            operational.
          </p>
        </div>
      </section>

      <div className="future-grid">
        <section className="future-capabilities card">
          <p>Planned capabilities</p>
          <h2>What this module should support</h2>
          <ul>
            {feature.capabilities.map((capability) => (
              <li key={capability}>
                <span aria-hidden="true">✓</span>
                <span>{capability}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="future-guardrail card">
          <span aria-hidden="true">🛡️</span>
          <div>
            <p>Architecture guardrail</p>
            <h2>Built carefully or not at all</h2>
            <blockquote>{feature.guardrail}</blockquote>
          </div>
        </section>
      </div>

      <section className="future-note card">
        <span aria-hidden="true">🔮</span>
        <p>
          This capability remains part of the long-term product direction. It will
          be introduced only when its data, permissions and user experience can be
          implemented without weakening the current foundations.
        </p>
      </section>
    </div>
  );
}
