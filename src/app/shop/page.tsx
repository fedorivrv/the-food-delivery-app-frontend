'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Shop, Product, ProductCategory, SortOption, PaginatedProducts } from '@/types/types';
import { getShops, getProductsByShop } from '@/lib/api';
import ShopList from '@/components/ShopList/ShopList';
import ProductGrid from '@/components/ProductGrid/ProductGrid';
import FilterBar from '@/components/FilterBar/FilterBar';
import styles from './page.module.css';

const LIMIT = 8;

export default function ShopPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [allShops, setAllShops] = useState<Shop[]>([]);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingShops, setLoadingShops] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<ProductCategory[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('name-asc');
  const [ratingFilter, setRatingFilter] = useState<string>('all');

  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);

  // Sort map: frontend values → backend values
  const sortMap: Record<SortOption, string> = {
    'name-asc': 'name_asc',
    'price-asc': 'price_asc',
    'price-desc': 'price_desc',
  };

  // Load shops
  useEffect(() => {
  setLoadingShops(true);

  getShops()
    .then((res) => {
      console.log('SHOPS RESPONSE:', res.data);

      // ⚠️ універсальна обробка (під будь-який бек)
      const shopsData = Array.isArray(res.data)
        ? res.data
        : res.data?.shops || res.data?.data || [];

      setAllShops(shopsData);
      setShops(shopsData);

      if (shopsData.length > 0) {
        setSelectedShop(shopsData[0]);
      }
    })
    .catch((err) => {
      console.error('LOAD SHOPS ERROR:', err);
      setError(err?.message || 'Failed to load shops');
    })
    .finally(() => setLoadingShops(false));
}, []);

  // Filter shops by rating
  useEffect(() => {
    if (ratingFilter === 'all') {
      setShops(allShops);
    } else {
      const [min, max] = ratingFilter.split('-').map(Number);
      const filtered = allShops.filter((s) => s.rating >= min && s.rating < max);
      setShops(filtered);
      if (selectedShop && !filtered.find((s) => s._id === selectedShop._id)) {
        setSelectedShop(filtered[0] ?? null);
      }
    }
  }, [ratingFilter, allShops]);

  // Fetch first page (reset)
  const fetchFirstPage = useCallback(async () => {
    if (!selectedShop) {
      setProducts([]);
      return;
    }
    setLoadingProducts(true);
    setProducts([]);
    setPage(1);
    setHasMore(false);
    try {
      const res = await getProductsByShop(selectedShop._id, {
        categories: selectedCategories.join(','),
        sort: sortMap[sortOption],
        page: 1,
        limit: LIMIT,
      });
      const data: PaginatedProducts = res.data;
      setProducts(data.products);
      setHasMore(data.pagination.hasMore);
      setPage(2);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoadingProducts(false);
    }
  }, [selectedShop, selectedCategories, sortOption]);

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  // Fetch next page (infinite scroll)
  const fetchNextPage = useCallback(async () => {
    if (!selectedShop || loadingMoreRef.current || !hasMore) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const res = await getProductsByShop(selectedShop._id, {
        categories: selectedCategories.join(','),
        sort: sortMap[sortOption],
        page,
        limit: LIMIT,
      });
      const data: PaginatedProducts = res.data;
      setProducts((prev) => [...prev, ...data.products]);
      setHasMore(data.pagination.hasMore);
      setPage((p) => p + 1);
    } catch {
      setError('Failed to load more products');
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [selectedShop, selectedCategories, sortOption, page, hasMore]);

  // Intersection Observer for infinite scroll sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fetchNextPage]);

  const availableCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort() as ProductCategory[];
  }, [products]);

  const toggleCategory = (cat: ProductCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
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
                  onClick={() => setRatingFilter(r)}
                >
                  {r === 'all' ? 'All ratings' : `${r.replace('-', '.0 – ')}.0 ★`}
                </button>
              ))}
            </div>
          </div>

          {loadingShops ? (
            <div className={styles.loading}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.skeletonShop} />
              ))}
            </div>
          ) : (
            <ShopList shops={shops} selectedShop={selectedShop} onSelect={setSelectedShop} />
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
            availableCategories={availableCategories}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            sortOption={sortOption}
            onSortChange={setSortOption}
            resultCount={products.length}
          />

          <ProductGrid products={products} loading={loadingProducts} />

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className={styles.sentinel} />

          {loadingMore && (
            <div className={styles.loadingMore}>
              <span className={styles.loadingDot} />
              <span className={styles.loadingDot} />
              <span className={styles.loadingDot} />
            </div>
          )}

          {!hasMore && products.length > 0 && !loadingProducts && (
            <p className={styles.endMessage}>All {products.length} products loaded</p>
          )}
        </section>
      </div>
    </div>
  );
}
