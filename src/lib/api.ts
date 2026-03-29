import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getShops = (params?: { minRating?: number; maxRating?: number }) =>
  api.get('/shops', { params });

export const getProductsByShop = (
  shopId: string,
  params?: { categories?: string; sort?: string; page?: number; limit?: number }
) => api.get(`/shops/${shopId}/products`, { params });

export const createOrder = (orderData: object) => api.post('/orders', orderData);

export const getOrdersByEmail = (email: string) =>
  api.get(`/orders/by-email/${encodeURIComponent(email)}`);
