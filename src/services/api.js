import axios from 'axios';
import { getToken } from '../utils/auth';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const productAPI = {
  getAll: () => api.get('/products'),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

export const inventoryAPI = {
  getAll: () => api.get('/inventory'),
  stockIn: (data) => api.post('/inventory/stock-in', data),
  stockOut: (data) => api.post('/inventory/stock-out', data),
};

export const warehouseAPI = {
  getAll: () => api.get('/warehouses'),
  create: (warehouse) => api.post('/warehouses', warehouse),
  update: (id, warehouse) => api.put(`/warehouses/${id}`, warehouse),
  delete: (id) => api.delete(`/warehouses/${id}`),
};

export const supplierAPI = {
  getAll: () => api.get('/suppliers'),
  create: (supplier) => api.post('/suppliers', supplier),
  update: (id, supplier) => api.put(`/suppliers/${id}`, supplier),
  delete: (id) => api.delete(`/suppliers/${id}`),
};

export default api;