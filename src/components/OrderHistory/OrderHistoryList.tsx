'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HistoryOrder } from '@/types/types';
import { useCartStore } from '@/store/cartStore';
import { getProductsByShop, getShops } from '@/lib/api';
import styles from './OrderHistoryList.module.css';

const STATUS_COLORS: Record<string, string> = {
  pending: '#e8a840',
  confirmed: '#5fa85a',
  delivered: '#4a9fd4',
  cancelled: '#c0534a',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface OrderCardProps {
  order: HistoryOrder;
}

function OrderCard({ order }: OrderCardProps) {
  const router = useRouter();
  const addItemWithQuantity = useCartStore((s) => s.addItemWithQuantity);
  const [reordering, setReordering] = useState(false);
  const [reordered, setReordered] = useState(false);

  const handleReorder = async () => {
    setReordering(true);
    try {
      // Fetch all shops to find products by productId
      const shopsRes = await getShops();
      const shops = shopsRes.data;

      // Collect all unique productIds from the order
      const productIds = new Set(order.items.map((i) => i.productId));

      // Fetch products from all shops and find matches
      const allProducts: Record<string, import('@/types/types').Product> = {};

      await Promise.all(
        shops.map(async (shop: import('@/types/types').Shop) => {
          try {
            const res = await getProductsByShop(shop._id, { limit: 100 });
            const products: import('@/types/types').Product[] = res.data.products;
            products.forEach((p) => {
              if (productIds.has(p._id)) allProducts[p._id] = p;
            });
          } catch {
            // skip shop if fails
          }
        })
      );

      // Add each order item to cart
      order.items.forEach((item) => {
        const product = allProducts[item.productId];
        if (product) {
          addItemWithQuantity(product, item.quantity);
        }
      });

      setReordered(true);
      setTimeout(() => {
        router.push('/cart');
      }, 800);
    } catch {
      setReordering(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <span className={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
          <span className={styles.date}>{formatDate(order.createdAt)}</span>
        </div>
        <span className={styles.status} style={{ color: STATUS_COLORS[order.status] }}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className={styles.items}>
        {order.items.map((item, i) => (
          <div key={i} className={styles.item}>
            <span className={styles.itemName}>{item.name}</span>
            <span className={styles.itemQty}>×{item.quantity}</span>
            <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.totalWrap}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalPrice}>${order.totalPrice.toFixed(2)}</span>
        </div>
        <button
          className={`${styles.reorderBtn} ${reordered ? styles.reordered : ''}`}
          onClick={handleReorder}
          disabled={reordering}
        >
          {reordering && !reordered && <span className={styles.btnSpinner} />}
          {reordered ? '✓ Added to Cart!' : reordering ? 'Adding…' : '🔁 Reorder'}
        </button>
      </div>
    </div>
  );
}

export default function OrderHistoryList({ orders }: { orders: HistoryOrder[] }) {
  return (
    <div className={styles.list}>
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  );
}
