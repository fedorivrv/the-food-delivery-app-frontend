'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HistoryOrder } from '@/types/types';
import { useCartStore } from '@/store/cartStore';
import { getProductsByShop, getShops } from '@/lib/api';
import styles from './OrderHistoryList.module.css';

const STATUS_META: Record<string, { label: string; color: string; icon: string }> = {
  pending:   { label: 'Pending',   color: '#e8a840', icon: '⏳' },
  confirmed: { label: 'Confirmed', color: '#5fa85a', icon: '✅' },
  delivered: { label: 'Delivered', color: '#4a9fd4', icon: '🚀' },
  cancelled: { label: 'Cancelled', color: '#c0534a', icon: '✕'  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function ProductThumb({ name, imageUrl }: { name: string; imageUrl?: string }) {
  return (
    <div className={styles.thumb}>
      {imageUrl
        ? <img src={imageUrl} alt={name} className={styles.thumbImg} />
        : <span className={styles.thumbPlaceholder}>🍽️</span>
      }
    </div>
  );
}

function OrderCard({ order }: { order: HistoryOrder }) {
  const router = useRouter();
  const addItemWithQuantity = useCartStore((s) => s.addItemWithQuantity);
  const [reordering, setReordering] = useState(false);
  const [reordered, setReordered] = useState(false);

  const statusMeta = STATUS_META[order.status] ?? STATUS_META.pending;

  const handleReorder = async () => {
    setReordering(true);
    try {
      const shopsRes = await getShops();
      const shops: import('@/types/types').Shop[] = shopsRes.data;
      const productIds = new Set(order.items.map((i) => i.productId));
      const allProducts: Record<string, import('@/types/types').Product> = {};

      await Promise.all(
        shops.map(async (shop) => {
          try {
            const res = await getProductsByShop(shop._id, { limit: 100 });
            const products: import('@/types/types').Product[] = res.data.products;
            products.forEach((p) => { if (productIds.has(p._id)) allProducts[p._id] = p; });
          } catch { /* skip */ }
        })
      );

      order.items.forEach((item) => {
        const product = allProducts[item.productId];
        if (product) addItemWithQuantity(product, item.quantity);
      });

      setReordered(true);
      setTimeout(() => router.push('/cart'), 900);
    } catch {
      setReordering(false);
    }
  };

  // Show first 4 items inline, rest as "+N more"
  const visibleItems = order.items.slice(0, 4);
  const extraCount = order.items.length - visibleItems.length;

  return (
    <div className={styles.card}>
      {/* Card header */}
      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.orderId}>#{order._id.slice(-8).toUpperCase()}</span>
          <span className={styles.date}>{formatDate(order.createdAt)}</span>
        </div>
        <span className={styles.statusBadge} style={{ color: statusMeta.color, borderColor: statusMeta.color + '44' }}>
          {statusMeta.icon} {statusMeta.label}
        </span>
      </div>

      {/* Items grid — matches wireframe: product image + name/price pairs */}
      <div className={styles.itemsGrid}>
        {visibleItems.map((item, i) => (
          <div key={i} className={styles.itemCard}>
            <ProductThumb name={item.name} />
            <div className={styles.itemInfo}>
              <p className={styles.itemName}>{item.name}</p>
              <p className={styles.itemPrice}>Price: ${item.price.toFixed(2)}</p>
              {item.quantity > 1 && (
                <p className={styles.itemQty}>×{item.quantity}</p>
              )}
            </div>
          </div>
        ))}
        {/* Total price tile — matches wireframe */}
        <div className={styles.totalTile}>
          {extraCount > 0 && (
            <span className={styles.extraItems}>+{extraCount} more item{extraCount > 1 ? 's' : ''}</span>
          )}
          <span className={styles.totalLabel}>Total price:</span>
          <span className={styles.totalPrice}>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Reorder footer */}
      <div className={styles.cardFooter}>
        <div className={styles.customerInfo}>
          <span className={styles.customerName}>{order.customerInfo.name}</span>
          <span className={styles.customerAddr}>{order.customerInfo.address}</span>
        </div>
        <button
          className={`${styles.reorderBtn} ${reordered ? styles.reordered : ''}`}
          onClick={handleReorder}
          disabled={reordering}
        >
          {reordering && !reordered && <span className={styles.btnSpinner} />}
          {reordered ? '✓ Added!' : reordering ? 'Adding…' : '🔁 Reorder'}
        </button>
      </div>
    </div>
  );
}

export default function OrderHistoryList({ orders }: { orders: HistoryOrder[] }) {
  return (
    <div className={styles.list}>
      {orders.map((order, i) => (
        <div key={order._id} style={{ animationDelay: `${i * 60}ms` }}>
          <OrderCard order={order} />
        </div>
      ))}
    </div>
  );
}
