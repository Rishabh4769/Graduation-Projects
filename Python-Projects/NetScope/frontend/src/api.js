/**
 * api.js — Central fetch wrapper.
 * Automatically attaches X-Auth-Token to every request and redirects
 * to /login on 401 so individual callers don't need to handle auth.
 */

const BASE = "/api";

function getToken() {
  return sessionStorage.getItem("ns_token") ?? "";
}

export function setToken(token) {
  sessionStorage.setItem("ns_token", token);
}

export function clearToken() {
  sessionStorage.removeItem("ns_token");
  sessionStorage.removeItem("ns_user");
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["X-Auth-Token"] = token;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    clearToken();
    window.dispatchEvent(new Event("ns:unauthorized"));
    throw new Error("Session expired — please log in again");
  }

  return res;
}

export const api = {
  get:    (path)        => request("GET",    path),
  post:   (path, body)  => request("POST",   path, body),
  delete: (path)        => request("DELETE", path),
};
