'use client';
import { useCartStore } from '@/store/carStore';
import CartItem from '@/app/components/CarItem/CartItem';
import OrderForm from '@/app/components/OrderForm/OrderForm';
import styles from './page.module.css';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.getTotalPrice());

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.formSection}>
          <h1 className={styles.title}>Your Order</h1>
          <p className={styles.subtitle}>Fill in your details to complete the order</p>
          <OrderForm />
        </div>

        <div className={styles.cartSection}>
          <div className={styles.cartHeader}>
            <h2 className={styles.cartTitle}>Cart</h2>
            {items.length > 0 && <span className={styles.itemCount}>{items.length} items</span>}
          </div>

          {items.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>🛒</span>
              <p>Your cart is empty</p>
              <a href="/shop" className={styles.emptyLink}>
                Browse shops →
              </a>
            </div>
          ) : (
            <>
              <div className={styles.itemList}>
                {items.map((item) => (
                  <CartItem key={item.product._id} item={item} />
                ))}
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total price:</span>
                <span className={styles.totalPrice}>${totalPrice.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
