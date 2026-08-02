import { Link } from "react-router-dom";

import "./NotFound.css";

export default function NotFound() {
  return (
    <section className="not-found card">
      <span aria-hidden="true">🗺️</span>
      <p>Page not found</p>
      <h1>This page is unavailable</h1>
      <p>
        The address may be incorrect, or the page may have moved. Return to
        your dashboard to continue your challenge.
      </p>
      <Link className="button button--primary" to="/dashboard">
        Return to dashboard
      </Link>
    </section>
  );
}
