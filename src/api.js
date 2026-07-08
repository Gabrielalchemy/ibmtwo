import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Example helper – extend with real endpoints
export const generateForgeGDD = (payload) => api.post('/forge/gdd', payload);
export default api;