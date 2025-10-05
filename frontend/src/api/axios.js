import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend API URL
});

// Request interceptor to add the token to headers
api.interceptors.request.use((config) => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`;
  }
  return config;
});

export default api;