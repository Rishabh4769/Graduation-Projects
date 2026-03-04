// Lightweight fetch wrapper that always uses `fetch` (no axios)
// - automatically prefixes `/api` when needed
// - attaches JWT from localStorage as `Authorization` header
// - parses JSON and throws on non-2xx responses

export async function fetchJson(path, options = {}) {
  const normalizedPath = path.startsWith('/api') ? path : `/api${path.startsWith('/') ? path : '/' + path}`;
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(normalizedPath, { ...options, headers });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }

  if (!res.ok) {
    const err = new Error((data && data.message) || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}
