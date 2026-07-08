import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const { login, setup } = useAuth();
  const { theme, toggle } = useTheme();

  const [setupRequired, setSetupRequired] = useState(null); // null = loading
  const [username,  setUsername]  = useState("");
  const [password,  setPassword]  = useState("");
  const [password2, setPassword2] = useState(""); // confirm for setup
  const [error,     setError]     = useState("");
  const [loading,   setLoading]   = useState(false);

  useEffect(() => {
    fetch("/api/auth/status")
      .then((r) => r.json())
      .then((d) => setSetupRequired(d.setup_required))
      .catch(() => setSetupRequired(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (setupRequired && password !== password2) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      if (setupRequired) {
        await setup(username, password);
      } else {
        await login(username, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (setupRequired === null) {
    return (
      <div className={styles.page}>
        <div className={styles.loader}>Connecting to backend…</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Theme toggle */}
      <button
        className={styles.themeBtn}
        onClick={toggle}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        {theme === "dark" ? <IconSun /> : <IconMoon />}
      </button>

      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="1.5"/>
            <path d="M2 12h3M19 12h3M12 2v3M12 19v3"
              stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="3" fill="var(--accent)"/>
          </svg>
          <span className={styles.logoText}>NetScope</span>
        </div>

        <h1 className={styles.title}>
          {setupRequired ? "Create your account" : "Sign in"}
        </h1>
        <p className={styles.subtitle}>
          {setupRequired
            ? "No accounts exist yet. Set up your admin account to get started."
            : "Network traffic monitor & anomaly detector"}
        </p>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span>Username</span>
            <input
              type="text"
              value={username}
              autoComplete="username"
              autoFocus
              required
              minLength={setupRequired ? 3 : 1}
              maxLength={32}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              aria-label="Username"
            />
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              autoComplete={setupRequired ? "new-password" : "current-password"}
              required
              minLength={setupRequired ? 8 : 1}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={setupRequired ? "Min 8 characters" : "Enter password"}
              aria-label="Password"
            />
          </label>

          {setupRequired && (
            <label className={styles.field}>
              <span>Confirm Password</span>
              <input
                type="password"
                value={password2}
                autoComplete="new-password"
                required
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="Repeat password"
                aria-label="Confirm password"
              />
            </label>
          )}

          {error && (
            <div className={styles.error} role="alert">{error}</div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading || !username || !password}
          >
            {loading
              ? "Please wait…"
              : setupRequired ? "Create account & sign in" : "Sign in"}
          </button>
        </form>

        {setupRequired && (
          <p className={styles.hint}>
            This account will be the administrator. You can add more users later.
          </p>
        )}
      </div>

      <p className={styles.footer}>NetScope v2.0 · Local network monitor</p>
    </div>
  );
}

function IconSun() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}
