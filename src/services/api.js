import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT access token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle authorization expiration (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear credentials and redirect to login if session expires
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // If we are not already on the landing or login page, reload to trigger auth state reset
      if (!window.location.pathname.match(/^\/(login|register|)?$/)) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// --- API Endpoints ---
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const chatAPI = {
  ask: (question) => api.post('/chat', { question }),
  getHistory: () => api.get('/chat/history'),
  clearHistory: () => api.delete('/chat/history'),
};

export const docsAPI = {
  upload: (formData) => api.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  list: () => api.get('/documents'),
  delete: (id) => api.delete(`/documents/${id}`),
  search: (query) => api.get(`/documents/search?q=${encodeURIComponent(query)}`),
};

export const noticeAPI = {
  list: () => api.get('/notices'),
  create: (data) => api.post('/notices', data),
  delete: (id) => api.delete(`/notices/${id}`),
};

export const eventAPI = {
  list: () => api.get('/events'),
  create: (data) => api.post('/events', data),
  delete: (id) => api.delete(`/events/${id}`),
};

export const faqAPI = {
  list: () => api.get('/faq'),
  create: (data) => api.post('/faq', data),
  delete: (id) => api.delete(`/faq/${id}`),
};

export const adminAPI = {
  rebuildEmbeddings: () => api.post('/embeddings/rebuild'),
  getSystemStatus: () => api.get('/system/status'),
  listUsers: () => api.get('/system/users'),
  deleteUser: (id) => api.delete(`/system/users/${id}`),
};

export default api;
