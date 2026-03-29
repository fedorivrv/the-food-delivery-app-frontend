'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useLayoutEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only show cart count after hydration to avoid SSR mismatch
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? totalItems : 0;

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/shop" className={styles.logo} onClick={() => setOpen(false)}>
          <span className={styles.logoIcon}>🍔</span>
          <span className={styles.logoText}>delivery</span>
        </Link>

        {/* Desktop links */}
        <div className={styles.links}>
          <Link
            href="/shop"
            className={`${styles.link} ${pathname === '/shop' ? styles.active : ''}`}
          >
            Shop
          </Link>
          <div className={styles.divider} />
          <Link
            href="/cart"
            className={`${styles.link} ${pathname === '/cart' ? styles.active : ''}`}
          >
            Shopping Cart
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className={styles.burger} onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {cartCount > 0 && !open && <span className={styles.burgerBadge}>{cartCount}</span>}
          <span className={`${styles.burgerIcon} ${open ? styles.burgerOpen : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className={styles.mobileMenu}>
          <Link
            href="/shop"
            className={`${styles.mobileLink} ${pathname === '/shop' ? styles.mobileActive : ''}`}
            onClick={() => setOpen(false)}
          >
            🏪 Shop
          </Link>
          <Link
            href="/cart"
            className={`${styles.mobileLink} ${pathname === '/cart' ? styles.mobileActive : ''}`}
            onClick={() => setOpen(false)}
          >
            🛒 Cart
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>
        </div>
      )}
    </nav>
  );
}
