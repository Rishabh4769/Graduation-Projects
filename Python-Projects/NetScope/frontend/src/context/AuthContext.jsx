import React, { createContext, useContext, useEffect, useState } from "react";
import { api, setToken, clearToken } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);    // null = not checked yet
  const [checked, setChecked] = useState(false);   // has the initial /me check run?

  // Re-check auth when the token is invalidated server-side
  useEffect(() => {
    function onUnauth() { setUser(null); }
    window.addEventListener("ns:unauthorized", onUnauth);
    return () => window.removeEventListener("ns:unauthorized", onUnauth);
  }, []);

  // On mount, verify any stored token
  useEffect(() => {
    const token = sessionStorage.getItem("ns_token");
    if (!token) {
      setChecked(true);
      return;
    }
    api.get("/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.username) setUser(data.username);
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  async function login(username, password) {
    const res = await api.post("/auth/login", { username, password });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.detail ?? "Login failed");
    }
    const data = await res.json();
    setToken(data.token);
    sessionStorage.setItem("ns_user", data.username);
    setUser(data.username);
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch { /* ignore */ }
    clearToken();
    setUser(null);
  }

  async function setup(username, password) {
    const res = await api.post("/auth/setup", { username, password });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.detail ?? "Setup failed");
    }
    // Immediately log in after setup
    await login(username, password);
  }

  return (
    <AuthContext.Provider value={{ user, checked, login, logout, setup }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
