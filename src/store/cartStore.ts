import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, OrderItem } from '@/types/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  addItemWithQuantity: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  reorder: (orderItems: OrderItem[], products: Product[]) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        set((state) => {
          const existing = state.items.find((i) => i.product._id === product._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        });
      },

      addItemWithQuantity: (product: Product, quantity: number) => {
        if (quantity <= 0) return;
        set((state) => {
          const existing = state.items.find((i) => i.product._id === product._id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({ items: state.items.filter((i) => i.product._id !== productId) }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.product._id === productId ? { ...i, quantity } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalPrice: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      // Reorder: merge order items into cart using product data fetched from API
      reorder: (orderItems: OrderItem[], products: Product[]) => {
        const productMap = new Map(products.map((p) => [p._id, p]));
        orderItems.forEach((item) => {
          const product = productMap.get(item.productId);
          if (product) {
            get().addItemWithQuantity(product, item.quantity);
          }
        });
      },
    }),
    { name: 'food-delivery-cart' }
  )
);
