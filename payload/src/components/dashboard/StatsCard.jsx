import { DASHBOARD_STATS } from "../../constants/dashboardStats";
import { formatNumber } from "../../utils/displayFormatters";
import StatItem from "./StatItem";
import "./StatsCard.css";

export default function StatsCard({ stats }) {
  return (
    <div className="stats-grid">
      {DASHBOARD_STATS.map((stat) => (
        <StatItem
          key={stat.id}
          emoji={stat.emoji}
          label={stat.label}
          value={formatNumber(stats[stat.id] ?? 0, { whole: true })}
        />
      ))}
    </div>
  );
}
