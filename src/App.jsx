import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import PageLoader from "./components/common/PageLoader";
import ProtectedApp from "./routes/ProtectedApp";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ActivityLog = lazy(() => import("./pages/ActivityLog"));
const Progress = lazy(() => import("./pages/Progress"));
const Announcements = lazy(() => import("./pages/Announcements"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const Teams = lazy(() => import("./pages/Teams"));
const Leagues = lazy(() => import("./pages/Leagues"));
const LegacyCoach = lazy(() => import("./pages/LegacyCoach"));
const Rulebook = lazy(() => import("./pages/Rulebook"));
const PointsGuide = lazy(() => import("./pages/PointsGuide"));
const PocketWeek = lazy(() => import("./pages/PocketWeek"));
const Notifications = lazy(() => import("./pages/Notifications"));
const FutureFeature = lazy(() => import("./pages/FutureFeature"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedApp />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/log" element={<ActivityLog />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leagues" element={<Leagues />} />
          <Route path="/coach" element={<LegacyCoach />} />
          <Route path="/rules" element={<Rulebook />} />
          <Route path="/points-guide" element={<PointsGuide />} />
          <Route path="/pocket" element={<PocketWeek />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/future/:featureId" element={<FutureFeature />} />
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
