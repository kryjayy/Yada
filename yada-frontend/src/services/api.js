import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('yada_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const checkInAPI = {
  submit: (data) => api.post('/checkin', data),
  getAll: () => api.get('/checkin'),
};

export const journalAPI = {
  create: (data) => api.post('/journal', data),
  getAll: () => api.get('/journal'),
};

export default api;
