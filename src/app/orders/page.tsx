'use client';
import { useState } from 'react';
import { HistoryOrder } from '@/types/types';
import { getOrdersByEmail } from '@/lib/api';
import OrderHistoryList from '@/components/OrderHistory/OrderHistoryList';
import styles from './page.module.css';

export default function OrdersPage() {
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getOrdersByEmail(trimmed);
      setOrders(res.data);
      setSearched(true);
    } catch {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Order History</h1>
          <p className={styles.subtitle}>Enter your email to see your past orders</p>
        </div>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.inputWrap}>
            <span className={styles.inputIcon}>✉</span>
            <input
              type="email"
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              autoComplete="email"
            />
          </div>
          {error && <span className={styles.errorMsg}>{error}</span>}
          <button type="submit" className={styles.searchBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Find Orders'}
          </button>
        </form>

        {searched && (
          <div className={styles.results}>
            {orders.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>📭</span>
                <p>
                  No orders found for <strong>{email}</strong>
                </p>
                <span className={styles.emptyHint}>Check the email address and try again</span>
              </div>
            ) : (
              <>
                <p className={styles.resultCount}>
                  Found <strong>{orders.length}</strong> order{orders.length !== 1 ? 's' : ''} for{' '}
                  {email}
                </p>
                <OrderHistoryList orders={orders} />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
