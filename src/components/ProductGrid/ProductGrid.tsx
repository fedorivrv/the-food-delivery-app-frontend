'use client';
import Image from 'next/image';
import { Product } from '@/types/types';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import styles from './ProductGrid.module.css';

interface Props {
  products: Product[];
  loading: boolean;
}

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            className={styles.image}
            width={300}
            height={200}
          />
        ) : (
          <div className={styles.imagePlaceholder}>🍽️</div>
        )}
        <span className={styles.categoryBadge}>{product.category}</span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        {product.description && <p className={styles.desc}>{product.description}</p>}
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button className={`${styles.addBtn} ${added ? styles.added : ''}`} onClick={handleAdd}>
            {added ? '✓ Added' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading }: Props) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🔍</span>
        <p>No products match your filters</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product, i) => (
        <div key={product._id} style={{ animationDelay: `${i * 40}ms` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
