import axios from 'axios';

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3003';
const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:3001';

// Create separate axios instances for each service
const authApi = axios.create({
  baseURL: AUTH_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const productApi = axios.create({
  baseURL: PRODUCT_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
const addTokenToRequest = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApi.interceptors.request.use(addTokenToRequest);
productApi.interceptors.request.use(addTokenToRequest);

// Handle 401 errors
const handle401Error = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

authApi.interceptors.response.use(
  (response) => response,
  handle401Error
);

productApi.interceptors.response.use(
  (response) => response,
  handle401Error
);

// Auth API
export const authAPI = {
  login: (credentials) => authApi.post('/api/auth/login', credentials),
  logout: () => authApi.post('/api/auth/logout'),
  verify: () => authApi.get('/api/auth/verify'),
  profile: () => authApi.get('/api/auth/profile'),
};

// Products API
export const productsAPI = {
  getAll: () => productApi.get('/api/products'),
  getById: (id) => productApi.get(`/api/products/${id}`),
  create: (data) => productApi.post('/api/products', data),
  update: (id, data) => productApi.put(`/api/products/${id}`, data),
  delete: (id) => productApi.delete(`/api/products/${id}`),
};

// Health API
export const healthAPI = {
  checkAuth: () => authApi.get('/health'),
  checkProduct: () => productApi.get('/health'),
};

export default { authApi, productApi };
