import "./StatItem.css";

export default function StatItem({ emoji, value, label }) {
  return (
    <article className="stat-item">
      <span className="stat-item__emoji" aria-hidden="true">{emoji}</span>
      <div>
        <p className="stat-item__value">{value}</p>
        <p className="stat-item__label">{label}</p>
      </div>
    </article>
  );
}
