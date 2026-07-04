import React, { useState } from "react";
import "../auth.form.scss";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import LoadingScreen from '../../../components/LoadingScreen.jsx';

const Login = () => {
  const navigate = useNavigate();
  const { Loading, handleLogin } = useAuth();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await handleLogin({ email: Email, password: Password });

      if (data?.success) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  if (Loading) {
    return (
      <LoadingScreen
        title='Opening your account'
        subtitle='We are preparing the secure login experience and restoring your session.'
        detail='Please wait a moment while authentication completes.'
      />
    );
  }
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-hero">
          <span className="auth-hero__eyebrow">Welcome back</span>
          <h1>Sign in to continue building your career story.</h1>
          <p>
            Access your interview reports, resume tools, and personalized AI guidance from one clean dashboard.
          </p>

          <div className="auth-hero__stats">
            <div>
              <strong>Fast</strong>
              <span>One-step login</span>
            </div>
            <div>
              <strong>Secure</strong>
              <span>Protected access</span>
            </div>
            <div>
              <strong>Smart</strong>
              <span>AI-powered workflow</span>
            </div>
          </div>
        </aside>

        <div className="form-container auth-card">
          <div className="auth-card__header">
            <span className="auth-card__badge">Member access</span>
            <h2>Login</h2>
            <p>Enter your details to pick up where you left off.</p>
          </div>

          <form action="" onSubmit={handleSubmit}>
            {error && <p className="auth-form-error">{error}</p>}
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Enter email address"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Enter password"
              />
            </div>

            <button className="button primary-button auth-submit">Login</button>
          </form>

          <p className="auth-card__footer">
            Don&apos;t have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
