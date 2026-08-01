import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DailyGoals from "../components/dashboard/DailyGoals";
import DailyProgress from "../components/dashboard/DailyProgress";
import MotivationCard from "../components/dashboard/MotivationCard";
import ProgressionCard from "../components/dashboard/ProgressionCard";
import QuickActions from "../components/dashboard/QuickActions";
import StatsCard from "../components/dashboard/StatsCard";
import TopCategories from "../components/dashboard/TopCategories";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import { GOAL_PERIODS } from "../constants/goals";
import usePlayerData from "../hooks/usePlayerData";
import { getProgressionSummary } from "../services/progression";
import {
  getGoalsForPeriod,
  getTodayEntryCount,
  getTopCategories,
  getTotalEntries,
} from "../services/statistics";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, user, entries } = usePlayerData();
  const [goalPeriod, setGoalPeriod] = useState(GOAL_PERIODS.DAILY);

  const goals = useMemo(
    () => getGoalsForPeriod(entries, goalPeriod),
    [entries, goalPeriod],
  );

  const topCategories = useMemo(() => getTopCategories(entries), [entries]);
  const progression = useMemo(() => getProgressionSummary(entries), [entries]);

  const stats = useMemo(
    () => ({
      points: progression.score.totalPoints,
      todayPoints: progression.score.todayPoints,
      entries: getTotalEntries(entries),
      todayEntries: getTodayEntryCount(entries),
    }),
    [entries, progression],
  );

  function handleGoalSelect(categoryId) {
    navigate(`/log?category=${encodeURIComponent(categoryId)}`);
  }

  return (
    <div className="dashboard-page page-stack">
      <WelcomeCard profile={profile} user={user} />

      <QuickActions />

      <StatsCard stats={stats} />

      <div className="dashboard-overview-grid">
        <ProgressionCard progression={progression} />
        <MotivationCard playerSeed={user?.uid || user?.email} />
      </div>

      <div className="dashboard-insights">
        <DailyProgress goals={goals} period={goalPeriod} />
        <TopCategories categories={topCategories} />
      </div>

      <DailyGoals
        goals={goals}
        period={goalPeriod}
        onPeriodChange={setGoalPeriod}
        onSelect={handleGoalSelect}
      />
    </div>
  );
}
