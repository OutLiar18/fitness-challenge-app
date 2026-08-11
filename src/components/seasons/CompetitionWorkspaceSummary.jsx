import "./CompetitionWorkspaceSummary.css";

export default function CompetitionWorkspaceSummary({
  eyebrow,
  title,
  description,
  metrics = [],
  children,
}) {
  return (
    <section className="competition-summary card" aria-label={title}>
      <div className="competition-summary__copy">
        {eyebrow && <p className="section-kicker">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {metrics.length > 0 && (
        <dl className="competition-summary__metrics">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {children && <div className="competition-summary__actions">{children}</div>}
    </section>
  );
}
