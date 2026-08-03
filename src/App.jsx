import { lazy, Suspense } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import PageLoader from "./components/common/PageLoader";
import ProtectedApp from "./routes/ProtectedApp";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ActivityLog = lazy(() => import("./pages/ActivityLog"));
const Progress = lazy(() => import("./pages/Progress"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Inbox = lazy(() => import("./pages/Inbox"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const Houses = lazy(() => import("./pages/Houses"));
const Seasons = lazy(() => import("./pages/Seasons"));
const LegacyCoach = lazy(() => import("./pages/LegacyCoach"));
const Rulebook = lazy(() => import("./pages/Rulebook"));
const PointsGuide = lazy(() => import("./pages/PointsGuide"));
const PocketWeek = lazy(() => import("./pages/PocketWeek"));
const FutureFeature = lazy(() => import("./pages/FutureFeature"));
const NotFound = lazy(() => import("./pages/NotFound"));

function LegacyRouteRedirect({ to, tab = "" }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  if (tab) params.set("tab", tab);
  const query = params.toString();
  return <Navigate to={`${to}${query ? `?${query}` : ""}`} replace />;
}

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
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/houses" element={<Houses />} />
          <Route path="/seasons" element={<Seasons />} />
          <Route path="/coach" element={<LegacyCoach />} />
          <Route path="/rules" element={<Rulebook />} />
          <Route path="/points-guide" element={<PointsGuide />} />
          <Route path="/pocket" element={<PocketWeek />} />
          <Route path="/future/:featureId" element={<FutureFeature />} />

          <Route path="/teams" element={<LegacyRouteRedirect to="/houses" />} />
          <Route path="/leagues" element={<LegacyRouteRedirect to="/seasons" />} />
          <Route path="/announcements" element={<LegacyRouteRedirect to="/inbox" />} />
          <Route path="/notifications" element={<LegacyRouteRedirect to="/inbox" tab="private" />} />
          <Route path="/app" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
