export interface Shop {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  shopId: string;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface Order {
  items: { productId: string; name: string; price: number; quantity: number }[];
  customerInfo: OrderFormData;
  totalPrice: number;
}
