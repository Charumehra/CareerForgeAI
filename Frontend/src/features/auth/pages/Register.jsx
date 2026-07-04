import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth';
import "../auth.form.scss";

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, Loading } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await handleRegister({ username, email, password });

      if (data?.success) {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    }
  }
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <aside className="auth-hero auth-hero--register">
          <span className="auth-hero__eyebrow">Get started</span>
          <h1>Create your account and unlock your AI career assistant.</h1>
          <p>
            Build interview plans, generate resumes, and keep all your career tools in one polished workspace.
          </p>

          <div className="auth-hero__bullet-list">
            <div>Personalized interview questions</div>
            <div>Printable resume generation</div>
            <div>Clean dashboard and saved reports</div>
          </div>
        </aside>

        <div className="form-container auth-card">
          <div className="auth-card__header">
            <span className="auth-card__badge auth-card__badge--soft">New account</span>
            <h2>Register</h2>
            <p>Set up your profile in a few seconds.</p>
          </div>

          <form action="" onSubmit={handleSubmit}>
            {error && <p className="auth-form-error">{error}</p>}
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                autoComplete="username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="button primary-button auth-submit" disabled={Loading}>
              Create account
            </button>
          </form>

          <p className="auth-card__footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default Register