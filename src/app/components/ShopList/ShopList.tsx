import { Shop } from '@/types/types';
import styles from './ShopList.module.css';

interface Props {
  shops: Shop[];
  selectedShop: Shop | null;
  onSelect: (shop: Shop) => void;
}

export default function ShopList({ shops, selectedShop, onSelect }: Props) {
  if (shops.length === 0) {
    return <p className={styles.empty}>No shops available</p>;
  }

  return (
    <ul className={styles.list}>
      {shops.map((shop) => (
        <li key={shop._id}>
          <button
            className={`${styles.shopBtn} ${selectedShop?._id === shop._id ? styles.active : ''}`}
            onClick={() => onSelect(shop)}
          >
            <span className={styles.shopDot} />
            {shop.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
