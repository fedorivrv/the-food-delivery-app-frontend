'use client';
import { CartItem } from '@/types/types';
import { useCartStore } from '@/store/carStore';
import styles from './CartItem.module.css';

interface Props {
  item: CartItem;
}

export default function CartItemComponent({ item }: Props) {
  const { removeItem, updateQuantity } = useCartStore();
  const { product, quantity } = item;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>🍽️</div>
        )}
      </div>

      <div className={styles.info}>
        <h4 className={styles.name}>{product.name}</h4>
        <span className={styles.price}>${product.price.toFixed(2)}</span>
      </div>

      <div className={styles.controls}>
        <div className={styles.qty}>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQuantity(product._id, quantity - 1)}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className={styles.qtyVal}>{quantity}</span>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQuantity(product._id, quantity + 1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <span className={styles.subtotal}>${(product.price * quantity).toFixed(2)}</span>

        <button
          className={styles.removeBtn}
          onClick={() => removeItem(product._id)}
          aria-label="Remove item"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
