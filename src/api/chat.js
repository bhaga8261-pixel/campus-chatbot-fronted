import api from './api';

// Chat-specific endpoints
const chatAPI = {
  ask:          (question) => api.post('/chat', { question }),
  getHistory:   ()         => api.get('/chat/history'),
  clearHistory: ()         => api.delete('/chat/history'),
};

export default chatAPI;
