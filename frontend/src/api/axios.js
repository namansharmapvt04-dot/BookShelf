import axios from 'axios';

// ─── Base URL ────────────────────────────────────────────────────────────────
// VITE_API_URL must be set in Vercel's Environment Variables dashboard.
// Example: https://bookshelf-4brs.onrender.com/api
//
// During local dev (npm run dev) this falls back to the Vite proxy at '/api',
// which proxies to http://localhost:8000/api via vite.config.js.
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

if (!import.meta.env.VITE_API_URL) {
  console.warn(
    '[api] VITE_API_URL is not set — falling back to relative "/api".\n' +
    'This will break in production. Set VITE_API_URL in Vercel → Settings → Environment Variables.'
  );
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor: auto-refresh on 401 ───────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          // Use BASE_URL so this also hits the Render backend, not Vercel
          const res = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh });
          localStorage.setItem('access_token', res.data.access);
          original.headers.Authorization = `Bearer ${res.data.access}`;
          return api(original);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
