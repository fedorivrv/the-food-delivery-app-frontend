import axios from 'axios';
import type { PaginatedProducts, Shop } from '@/types/types';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // We use Bearer tokens (localStorage), not cookies — credentials would trigger stricter CORS.
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export function getShops(params?: { minRating?: number; maxRating?: number }) {
  return api.get<Shop[]>('/shops', { params });
}

export function getProductsByShop(
  shopId: string,
  params?: { categories?: string; sort?: string; page?: number; limit?: number }
) {
  return api.get<PaginatedProducts>(`/shops/${shopId}/products`, { params });
}

export function createOrder(data: {
  items: Array<{ productId: string; quantity: number }>;
  customerInfo: { name: string; email: string; phone: string; address: string };
}) {
  return api.post('/orders', data);
}

export function searchOrders(params: { email: string; phone: string } | { orderId: string }) {
  return api.get('/orders/search', { params });
}