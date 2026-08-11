import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DailyGoals from "../components/dashboard/DailyGoals";
import DailyProgress from "../components/dashboard/DailyProgress";
import ProgressionCard from "../components/dashboard/ProgressionCard";
import QuickActions from "../components/dashboard/QuickActions";
import TopCategories from "../components/dashboard/TopCategories";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import { GOAL_PERIODS } from "../constants/goals";
import usePlayerData from "../hooks/usePlayerData";
import {
  getGoalsForPeriod,
  getTopCategories,
} from "../services/statistics";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, user, entries, progression } = usePlayerData();
  const [goalPeriod, setGoalPeriod] = useState(GOAL_PERIODS.DAILY);

  const goals = useMemo(
    () => getGoalsForPeriod(entries, goalPeriod),
    [entries, goalPeriod],
  );

  const topCategories = useMemo(() => getTopCategories(entries), [entries]);


  function handleGoalSelect(categoryId) {
    navigate(`/log?category=${encodeURIComponent(categoryId)}`);
  }

  return (
    <div className="dashboard-page page-stack">
      <WelcomeCard profile={profile} user={user} playerSeed={user?.uid || user?.email} />

            <QuickActions />

      <DailyGoals
        goals={goals}
        period={goalPeriod}
        onPeriodChange={setGoalPeriod}
        onSelect={handleGoalSelect}
      />

      <ProgressionCard progression={progression} />

      <div className="dashboard-insights">
        <DailyProgress goals={goals} period={goalPeriod} />
        <TopCategories categories={topCategories} />
      </div>
    </div>
  );
}
