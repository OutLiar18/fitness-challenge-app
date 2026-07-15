import "./StatsCard.css";
import StatItem from "./StatItem";
import { DASHBOARD_STATS } from "../../constants/dashboardStats";

export default function StatsCard({ stats }) {
  return (
    <div className="stats-grid">
      {DASHBOARD_STATS.map((stat) => (
        <StatItem
          key={stat.id}
          emoji={stat.emoji}
          label={stat.label}
          value={`${stats[stat.id] ?? 0}${stat.unit ? ` ${stat.unit}` : ""}`}
        />
      ))}
    </div>
  );
}
