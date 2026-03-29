import { api } from './axios';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

export const getOrders = async (): Promise<Order[]> => {
  const res = await api.get('/orders');
  return res.data;
};

export const createOrder = async (items: OrderItem[]) => {
  const res = await api.post('/orders', { items });
  return res.data;
};