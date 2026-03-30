'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { login } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !submitting;
  }, [email, password, submitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      router.push('/shop');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className={styles.grid}>
        <section className={styles.hero}>
          <span className={styles.kicker}>Welcome back</span>
          <h1 className={styles.title}>Sign in to manage your orders</h1>
          <p className={styles.subtitle}>
            Use your email to access order history and track deliveries.
          </p>
          <div className={styles.perks}>
            <div className={styles.perk}><span className={styles.perkIcon}>⚡</span>Fast checkout</div>
            <div className={styles.perk}><span className={styles.perkIcon}>📋</span>Order history</div>
            <div className={styles.perk}><span className={styles.perkIcon}>🛒</span>Saved cart</div>
          </div>
        </section>

        <section className={`card ${styles.card}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Login</h2>
            <p className={styles.cardHint}>Enter any email + password (demo auth).</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button className={`btnPrimary ${styles.submit}`} type="submit" disabled={!canSubmit}>
              {submitting ? <span className={styles.spinner} /> : 'Sign in'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
