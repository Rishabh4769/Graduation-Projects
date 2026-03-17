export const TOKEN_STORAGE_KEY = 'token';
export const USER_STORAGE_KEY = 'user';

function getAuthStorage() {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage || window.localStorage;
}

function removeFromAllStores(key) {
  try { window.sessionStorage?.removeItem(key); } catch (e) { /* ignore */ }
  try { window.localStorage?.removeItem(key); } catch (e) { /* ignore */ }
}

function decodeJwtPayload(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = window.atob(normalized);
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
}

export function getStoredToken() {
  try {
    const token = window.sessionStorage?.getItem(TOKEN_STORAGE_KEY);
    return token || window.localStorage?.getItem(TOKEN_STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

export function getStoredUser() {
  try {
    const rawUser =
      window.sessionStorage?.getItem(USER_STORAGE_KEY) ||
      window.localStorage?.getItem(USER_STORAGE_KEY);
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
}

export function hasValidToken() {
  const token = getStoredToken();
  return Boolean(token) && !isTokenExpired(token);
}

export function getStoredRole() {
  const user = getStoredUser();
  return (user?.role || '').toLowerCase();
}

export function isAdminUser() {
  return getStoredRole() === 'admin';
}

export function getDefaultRouteForUser() {
  return isAdminUser() ? '/app/admin/dashboard' : '/app/dashboard';
}

export function clearAuthStorage() {
  removeFromAllStores(TOKEN_STORAGE_KEY);
  removeFromAllStores(USER_STORAGE_KEY);
}

export function persistSessionAuth(token, user) {
  const storage = getAuthStorage();
  if (!storage) return;

  // keep session-scoped; ensure long-lived copies are cleared
  storage.setItem(TOKEN_STORAGE_KEY, token);
  storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  if (storage !== window.localStorage) {
    removeFromAllStores(TOKEN_STORAGE_KEY);
    removeFromAllStores(USER_STORAGE_KEY);
    storage.setItem(TOKEN_STORAGE_KEY, token);
    storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function logoutAndRedirect() {
  clearAuthStorage();
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
}
