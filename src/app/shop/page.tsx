'use client';
import { useState, useEffect, useMemo, useTransition } from 'react';
import { Shop, Product, ProductCategory, SortOption } from '@/types/types';
import { getShops, getProductsByShop } from '@/lib/api';
import ShopList from '@/components/ShopList/ShopList';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import FilterBar from '@/components/FilterBar/FilterBar';
import styles from './page.module.css';

export default function ShopPage() {
  const [allShops, setAllShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingShops, setLoadingShops] = useState(true);  
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getShops()
      .then((res) => {
        setAllShops(res.data);
        if (res.data.length > 0) setSelectedShop(res.data[0]);
      })
      .catch(() => setError('Failed to load shops'))
      .finally(() => setLoadingShops(false));
  }, []);

  // Filter shops by rating
  const filteredShops = useMemo(() => {
    if (ratingFilter === 'all') {
      return allShops;
    } else {
      const [min, max] = ratingFilter.split('-').map(Number);
      return allShops.filter((s) => s.rating >= min && s.rating < max);
    }
  }, [ratingFilter, allShops]);


  useEffect(() => {
    if (!selectedShop) return;
    
    let isMounted = true;
    
    getProductsByShop(selectedShop._id)
      .then((res) => {
        if (isMounted) {
          startTransition(() => {
            setProducts(res.data);
          });
        }
      })
      .catch(() => {
        if (isMounted) {
          startTransition(() => {
            setError('Failed to load products');
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedShop]);

  // Derive available categories from current products
  const availableCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  // Filter + sort products
  const displayedProducts = useMemo(() => {
    let list = [...products];
    if (selectedCategories.length > 0) {
      list = list.filter((p) => selectedCategories.includes(p.category));
    }
    switch (sortOption) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'name-asc': list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [products, selectedCategories, sortOption]);

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleRatingFilterChange = (rating: string) => {
    setRatingFilter(rating);
    const newFilteredShops = rating === 'all' 
      ? allShops 
      : (() => {
          const [min, max] = rating.split('-').map(Number);
          return allShops.filter((s) => s.rating >= min && s.rating < max);
        })();
    
    if (selectedShop && !newFilteredShops.find((s) => s._id === selectedShop._id)) {
      setSelectedShop(newFilteredShops[0] ?? null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h2 className={styles.sidebarTitle}>Shops</h2>
            <div className={styles.ratingFilter}>
              <span className={styles.filterLabel}>Filter by rating</span>
              {['all', '4-5', '3-4', '2-3'].map((r) => (
                <button
                  key={r}
                  className={`${styles.ratingBtn} ${ratingFilter === r ? styles.ratingActive : ''}`}
                  onClick={() => handleRatingFilterChange(r)}
                >
                  {r === 'all' ? 'All ratings' : `${r.replace('-', '.0 – ')}.0 ★`}
                </button>
              ))}
            </div>
          </div>

          {loadingShops ? (
            <div className={styles.loading}>
              {[1, 2, 3, 4].map((i) => <div key={i} className={styles.skeletonShop} />)}
            </div>
          ) : (
            <ShopList shops={filteredShops} selectedShop={selectedShop} onSelect={setSelectedShop} />
          )}
        </aside>

        <section className={styles.content}>
          {error && <div className={styles.error}>{error}</div>}
          {selectedShop && (
            <div className={styles.contentHeader}>
              <div className={styles.shopMeta}>
                <h1 className={styles.shopName}>{selectedShop.name}</h1>
                <div className={styles.shopRating}>
                  <span className={styles.ratingStars}>★</span>
                  <span className={styles.ratingVal}>{selectedShop.rating.toFixed(1)}</span>
                </div>
              </div>
              {selectedShop.description && (
                <p className={styles.shopDesc}>{selectedShop.description}</p>
              )}
            </div>
          )}

          <FilterBar
            availableCategories={availableCategories as import('@/types/types').ProductCategory[]}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            sortOption={sortOption}
            onSortChange={setSortOption}
            resultCount={displayedProducts.length}
          />

          <ProductGrid products={displayedProducts} loading={isPending} />
        </section>
      </div>
    </div>
  );
}
