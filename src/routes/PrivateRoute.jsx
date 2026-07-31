import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="route-loading" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true" />
        <p>Loading your challenge…</p>
      </main>
    );
  }

  return user ? (
    children
  ) : (
    <Navigate to="/" replace state={{ from: location.pathname }} />
  );
}
