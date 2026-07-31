import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getAuthErrorMessage, registerUser } from "../services/auth/authService";
import "./Auth.css";

export default function Signup() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
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

    if (form.password.length < 6) {
      setError("Use a password with at least six characters.");
      return;
    }

    setSubmitting(true);

    try {
      await registerUser(form);
      navigate("/dashboard", { replace: true });
    } catch (signupError) {
      setError(getAuthErrorMessage(signupError, "Your account could not be created."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <section className="auth-brand" aria-label="Champions Legacy">
          <div className="auth-brand__mark"><span>🏆</span><span>Champions Legacy</span></div>
          <h1>Build the person you are becoming.</h1>
          <p>Track meaningful actions, reward consistency and create a legacy one day at a time.</p>
        </section>

        <section className="auth-panel">
          <p className="auth-panel__eyebrow">Start your challenge</p>
          <h2>Create your account</h2>
          <p className="auth-panel__intro">Your progress starts with one honest entry.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__row">
              <div className="form-field">
                <label htmlFor="signup-first-name">First name</label>
                <input id="signup-first-name" autoComplete="given-name" required value={form.firstName} onChange={(event) => updateField("firstName", event.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="signup-last-name">Last name</label>
                <input id="signup-last-name" autoComplete="family-name" required value={form.lastName} onChange={(event) => updateField("lastName", event.target.value)} />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="signup-email">Email address</label>
              <input id="signup-email" type="email" autoComplete="email" required value={form.email} onChange={(event) => updateField("email", event.target.value)} />
            </div>

            <div className="form-field">
              <label htmlFor="signup-password">Password</label>
              <input id="signup-password" type="password" minLength={6} autoComplete="new-password" required value={form.password} onChange={(event) => updateField("password", event.target.value)} />
              <span className="form-help">Use at least six characters.</span>
            </div>

            {error && <div className="auth-form__error" role="alert">{error}</div>}

            <button className="button button--primary button--large" type="submit" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="auth-panel__switch">Already have an account? <Link to="/">Sign in</Link></p>
        </section>
      </div>
    </main>
  );
}
