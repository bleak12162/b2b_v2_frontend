import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API 呼び出し関数
export const catalogAPI = {
  getFarmers: async () => {
    const response = await apiClient.get('/farmers');
    return response.data;
  },
  
  getProducts: async (farmerId: string) => {
    const response = await apiClient.get(`/farmers/${farmerId}/products`);
    return response.data;
  },
};

export const orderAPI = {
  createOrder: async (data: any) => {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  getOrders: async (filters?: any) => {
    const response = await apiClient.get('/orders', { params: filters });
    return response.data;
  },

  getOrder: async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  confirmOrder: async (orderId: string) => {
    const response = await apiClient.post(`/orders/${orderId}/confirm`);
    return response.data;
  },

  shipOrder: async (orderId: string, data: any) => {
    const response = await apiClient.post(`/orders/${orderId}/ship`, data);
    return response.data;
  },

  completeOrder: async (orderId: string) => {
    const response = await apiClient.post(`/orders/${orderId}/complete`);
    return response.data;
  },
};

export const shipToAPI = {
  getShipTos: async () => {
    const response = await apiClient.get('/ship-tos');
    return response.data;
  },

  createShipTo: async (data: any) => {
    const response = await apiClient.post('/ship-tos', data);
    return response.data;
  },

  updateShipTo: async (shipToId: string, data: any) => {
    const response = await apiClient.patch(`/ship-tos/${shipToId}`, data);
    return response.data;
  },
};

export default apiClient;
