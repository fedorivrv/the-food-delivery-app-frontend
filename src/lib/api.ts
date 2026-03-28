import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Shops
export const getShops = () => api.get('/shops');
export const getProductsByShop = (shopId: string) => api.get(`/shops/${shopId}/products`);

// Orders
export const createOrder = (orderData: object) => api.post('/orders', orderData);
