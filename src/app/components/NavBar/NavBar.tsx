'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/carStore';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getTotalItems());

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/shop" className={styles.logo}>
          <span className={styles.logoIcon}>🍔</span>
          <span className={styles.logoText}>delivery</span>
        </Link>

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
            {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}
