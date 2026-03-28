'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { Shop, Product } from '@/types/types';
import { getShops, getProductsByShop } from '@/lib/api';
import ShopList from '@/components/ShopList/ShopList';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import styles from './page.module.css';

export default function ShopPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback((shop: Shop) => {
    setLoadingProducts(true);
    setProducts([]);
    getProductsByShop(shop._id)
      .then((res) => setProducts(res.data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoadingProducts(false));
  }, []);

  const handleSelectShop = useCallback((shop: Shop) => {
    setSelectedShop(shop);
    loadProducts(shop);
  }, [loadProducts]);

  useEffect(() => {
    getShops()
      .then((res) => {
        setShops(res.data);
        if (res.data.length > 0) {          
          handleSelectShop(res.data[0]);
        }
      })
      .catch(() => setError('Failed to load shops'))
      .finally(() => setLoadingShops(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Shops</h2>
          {loadingShops ? (
            <div className={styles.loading}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.skeletonShop} />
              ))}
            </div>
          ) : (
            <ShopList shops={shops} selectedShop={selectedShop} onSelect={handleSelectShop} />
          )}
        </aside>

        <section className={styles.content}>
          {error && <div className={styles.error}>{error}</div>}
          {selectedShop && (
            <div className={styles.contentHeader}>
              <h1 className={styles.shopName}>{selectedShop.name}</h1>
              {selectedShop.description && (
                <p className={styles.shopDesc}>{selectedShop.description}</p>
              )}
            </div>
          )}
          <ProductGrid products={products} loading={loadingProducts} />
        </section>
      </div>
    </div>
  );
}