import { Navigate, useLocation } from "react-router-dom";

import PageLoader from "../components/common/PageLoader";
import useAuth from "../hooks/useAuth";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader message="Loading your challenge…" />;
  }

  return user ? (
    children
  ) : (
    <Navigate
      to="/"
      replace
      state={{ from: `${location.pathname}${location.search}` }}
    />
  );
}
