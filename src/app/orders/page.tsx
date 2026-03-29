'use client';
import { useState } from 'react';
import { HistoryOrder } from '@/types/types';
import { searchOrders } from '@/lib/api';
import OrderHistoryList from '@/components/OrderHistory/OrderHistoryList';
import styles from './page.module.css';

type SearchMode = 'credentials' | 'orderId';

interface FormState {
  email: string;
  phone: string;
  orderId: string;
}

interface FormErrors {
  email?: string;
  phone?: string;
  orderId?: string;
}

function validate(mode: SearchMode, form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (mode === 'credentials') {
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';
    if (!form.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\+?[\d\s\-()]{7,15}$/.test(form.phone)) errors.phone = 'Enter a valid phone number';
  } else {
    if (!form.orderId.trim()) errors.orderId = 'Order ID is required';
    else if (form.orderId.trim().length !== 24) errors.orderId = 'Order ID must be 24 characters';
  }
  return errors;
}

export default function OrdersPage() {
  const [mode, setMode] = useState<SearchMode>('credentials');
  const [form, setForm] = useState<FormState>({ email: '', phone: '', orderId: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [orders, setOrders] = useState<HistoryOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate(mode, { ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(mode, form));
  };

  const switchMode = (m: SearchMode) => {
    setMode(m);
    setErrors({});
    setTouched({});
    setSearched(false);
    setOrders([]);
    setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Record<string, boolean> = mode === 'credentials'
  ? { email: true, phone: true }
  : { orderId: true };
setTouched(allTouched);
    const validationErrors = validate(mode, form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    setServerError(null);

    try {
      const params = mode === 'credentials'
        ? { email: form.email.trim(), phone: form.phone.trim() }
        : { orderId: form.orderId.trim() };

      const res = await searchOrders(params);
      setOrders(res.data);
      setSearched(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setServerError(msg || 'Failed to find orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Order History</h1>
          <p className={styles.subtitle}>Find your past orders and reorder with one click</p>
        </div>

        {/* Search card */}
        <div className={styles.searchCard}>
          {/* Mode tabs */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${mode === 'credentials' ? styles.tabActive : ''}`}
              onClick={() => switchMode('credentials')}
              type="button"
            >
              ✉ Email & Phone
            </button>
            <button
              className={`${styles.tab} ${mode === 'orderId' ? styles.tabActive : ''}`}
              onClick={() => switchMode('orderId')}
              type="button"
            >
              # Order ID
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {mode === 'credentials' ? (
              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                    autoComplete="email"
                  />
                  {errors.email && touched.email && (
                    <span className={styles.errorMsg}>{errors.email}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={form.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${errors.phone && touched.phone ? styles.inputError : ''}`}
                    autoComplete="tel"
                  />
                  {errors.phone && touched.phone && (
                    <span className={styles.errorMsg}>{errors.phone}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.fields}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="orderId">Order ID</label>
                  <input
                    id="orderId"
                    name="orderId"
                    type="text"
                    placeholder="e.g. 664abc1234567890abcd1234"
                    value={form.orderId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${styles.input} ${styles.monoInput} ${errors.orderId && touched.orderId ? styles.inputError : ''}`}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {errors.orderId && touched.orderId && (
                    <span className={styles.errorMsg}>{errors.orderId}</span>
                  )}
                </div>
              </div>
            )}

            {serverError && (
              <div className={styles.serverError}>{serverError}</div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? <span className={styles.spinner} /> : 'Find Orders'}
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div className={styles.results}>
            {orders.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>📭</span>
                <p className={styles.emptyTitle}>No orders found</p>
                <span className={styles.emptyHint}>
                  {mode === 'credentials'
                    ? 'Check your email and phone number and try again'
                    : 'Check the Order ID and try again'}
                </span>
              </div>
            ) : (
              <>
                <p className={styles.resultCount}>
                  Found <strong>{orders.length}</strong> order{orders.length !== 1 ? 's' : ''}
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
