import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getAuthErrorMessage, loginUser } from "../services/auth/authService";
import "./Auth.css";

export default function Login() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!authLoading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await loginUser(form);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (loginError) {
      setError(getAuthErrorMessage(loginError, "You could not be logged in."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-brand" aria-label="Champions Legacy">
          <div className="auth-brand__mark"><span>🏆</span><span>Champions Legacy</span></div>
          <h1>Become better than yesterday.</h1>
          <p>Turn daily effort into visible progress across fitness, learning and personal growth.</p>
        </section>

        <section className="auth-panel">
          <p className="auth-panel__eyebrow">Welcome back</p>
          <h2>Continue your legacy</h2>
          <p className="auth-panel__intro">Sign in to record today’s progress and keep your momentum moving.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(event) => updateField("password", event.target.value)}
              />
            </div>

            {error && <div className="auth-form__error" role="alert">{error}</div>}

            <button className="button button--primary button--large" type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth-panel__switch">New to Champions Legacy? <Link to="/signup">Create an account</Link></p>
        </section>
      </div>
    </main>
  );
}
