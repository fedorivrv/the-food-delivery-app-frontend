'use client';
import { ProductCategory, SortOption } from '@/types/types';
import styles from './FilterBar.module.css';

const CATEGORY_ICONS: Record<string, string> = {
  Burgers: '🍔',
  Chicken: '🍗',
  Pizza: '🍕',
  Sushi: '🍣',
  Drinks: '🥤',
  Desserts: '🍰',
  Sides: '🍟',
  Salads: '🥗',
};

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name (A → Z)' },
  { value: 'price-asc', label: 'Price (Low → High)' },
  { value: 'price-desc', label: 'Price (High → Low)' },
];

interface Props {
  availableCategories: ProductCategory[];
  selectedCategories: ProductCategory[];
  onToggleCategory: (cat: ProductCategory) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

export default function FilterBar({
  availableCategories,
  selectedCategories,
  onToggleCategory,
  sortOption,
  onSortChange,
  resultCount,
}: Props) {
  const hasFilters = selectedCategories.length > 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div className={styles.categories}>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              className={`${styles.catBtn} ${selectedCategories.includes(cat) ? styles.catActive : ''}`}
              onClick={() => onToggleCategory(cat)}
            >
              <span>{CATEGORY_ICONS[cat] ?? '🍽️'}</span>
              {cat}
            </button>
          ))}
          {hasFilters && (
            <button
              className={styles.clearBtn}
              onClick={() => selectedCategories.forEach(onToggleCategory)}
            >
              ✕ Clear
            </button>
          )}
        </div>

        <div className={styles.sortWrap}>
          <label className={styles.sortLabel} htmlFor="sort-select">
            Sort:
          </label>
          <select
            id="sort-select"
            className={styles.sortSelect}
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasFilters && (
        <p className={styles.resultInfo}>
          Showing <strong>{resultCount}</strong> product{resultCount !== 1 ? 's' : ''} in{' '}
          {selectedCategories.join(', ')}
        </p>
      )}
    </div>
  );
}
