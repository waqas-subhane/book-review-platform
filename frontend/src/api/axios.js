import axios from 'axios';

const api = axios.create({
  // This is the line that has been changed
  baseURL: 'https://book-review-platform-api-tw2l.onrender.com/api', 
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