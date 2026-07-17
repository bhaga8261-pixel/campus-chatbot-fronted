import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getToken, clearAuth } from '../utils/token';

// ── Axios instance ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 ────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      const publicPaths = ['/', '/login', '/register'];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// ── Notice APIs ──────────────────────────────────────────────────────────────
export const noticeAPI = {
  list:   ()       => api.get('/notices'),
  create: (data)   => api.post('/notices', data),
  delete: (id)     => api.delete(`/notices/${id}`),
};

// ── Event APIs ───────────────────────────────────────────────────────────────
export const eventAPI = {
  list:   ()       => api.get('/events'),
  create: (data)   => api.post('/events', data),
  delete: (id)     => api.delete(`/events/${id}`),
};

// ── FAQ APIs ─────────────────────────────────────────────────────────────────
export const faqAPI = {
  list:   ()       => api.get('/faq'),
  create: (data)   => api.post('/faq', data),
  delete: (id)     => api.delete(`/faq/${id}`),
};

// ── Document APIs ────────────────────────────────────────────────────────────
export const docsAPI = {
  upload: (formData) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  list:   ()       => api.get('/documents'),
  delete: (id)     => api.delete(`/documents/${id}`),
  search: (query, limit = 5) =>
    api.get(`/documents/search?q=${encodeURIComponent(query)}&limit=${limit}`),
};

// ── Admin APIs ───────────────────────────────────────────────────────────────
export const adminAPI = {
  rebuildEmbeddings: () => api.post('/embeddings/rebuild'),
  getSystemStatus:   () => api.get('/system/status'),
  listUsers:         () => api.get('/system/users'),
  deleteUser:        (id) => api.delete(`/system/users/${id}`),
};

export default api;
