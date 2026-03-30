'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { createOrder } from '@/lib/api';
import { OrderFormData, OrderFormErrors } from '@/types/types';
import styles from './OrderForm.module.css';

function validate(data: OrderFormData): OrderFormErrors {
  const errors: OrderFormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\+?[\d\s\-()]{7,15}$/.test(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!data.address.trim()) {
    errors.address = 'Address is required';
  } else if (data.address.trim().length < 10) {
    errors.address = 'Please enter a full delivery address';
  }

  return errors;
}

export default function OrderForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.getTotalPrice());
  const clearCart = useCartStore((s) => s.clearCart);

  const [form, setForm] = useState<OrderFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const newErrors = validate({ ...form, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof OrderFormErrors] }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof OrderFormErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = { name: true, email: true, phone: true, address: true };
    setTouched(allTouched);

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (items.length === 0) {
      setSubmitError('Your cart is empty. Please add items before submitting.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await createOrder({
        items: items.map((i) => ({
          productId: i.product._id,
          quantity: i.quantity,
        })),
        customerInfo: form,
      });

      setSuccess(true);
      clearCart();
      setTimeout(() => router.push('/shop'), 3000);
    } catch {
      setSubmitError('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successBox}>
        <div className={styles.successIcon}>🎉</div>
        <h3 className={styles.successTitle}>Order Placed!</h3>
        <p className={styles.successText}>
          Thank you, {form.name}! Your order has been received.
          <br />
          Redirecting you back to the shop…
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
          autoComplete="name"
        />
        {errors.name && touched.name && <span className={styles.errorMsg}>{errors.name}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
          autoComplete="email"
        />
        {errors.email && touched.email && <span className={styles.errorMsg}>{errors.email}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="phone">
          Phone
        </label>
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
        {errors.phone && touched.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="address">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          placeholder="123 Main St, City, Country"
          value={form.address}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${styles.input} ${errors.address && touched.address ? styles.inputError : ''}`}
          autoComplete="street-address"
        />
        {errors.address && touched.address && (
          <span className={styles.errorMsg}>{errors.address}</span>
        )}
      </div>

      {submitError && <div className={styles.submitError}>{submitError}</div>}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={submitting || items.length === 0}
      >
        {submitting ? (
          <span className={styles.spinner} />
        ) : (
          `Submit Order${items.length > 0 ? ` — $${totalPrice.toFixed(2)}` : ''}`
        )}
      </button>

      {items.length === 0 && (
        <p className={styles.emptyHint}>Add items to your cart before submitting</p>
      )}
    </form>
  );
}
