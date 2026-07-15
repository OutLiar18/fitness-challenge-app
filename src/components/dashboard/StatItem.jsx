import "./StatItem.css";

export default function StatItem({ emoji, value, label }) {
  return (
    <div className="stat-item">
      <div className="stat-emoji">{emoji}</div>

      <div className="stat-value">{value}</div>

      <div className="stat-label">{label}</div>
    </div>
  );
}
