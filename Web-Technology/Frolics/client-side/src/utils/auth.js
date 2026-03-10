export const TOKEN_STORAGE_KEY = 'token';
export const USER_STORAGE_KEY = 'user';

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
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function getStoredUser() {
  try {
    const rawUser = localStorage.getItem(USER_STORAGE_KEY);
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
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function logoutAndRedirect() {
  clearAuthStorage();
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
}
