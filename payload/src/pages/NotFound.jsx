import { Link } from "react-router-dom";

import "./NotFound.css";

export default function NotFound() {
  return (
    <section className="not-found card">
      <span aria-hidden="true">🗺️</span>
      <p>Navigation anomaly</p>
      <h1>This page wandered off</h1>
      <p>
        It may be doing cardio. We respect the effort, but you should probably
        return to the dashboard.
      </p>
      <Link className="button button--primary" to="/dashboard">
        Return to dashboard
      </Link>
    </section>
  );
}
