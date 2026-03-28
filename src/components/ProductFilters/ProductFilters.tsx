'use client';
import { SortOption } from '@/types';
import styles from './ProductFilters.module.css';

const CATEGORIES = ['Burgers', 'Chicken', 'Pizza', 'Sushi', 'Drinks', 'Desserts', 'Sides', 'Salads'];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'A → Z', value: 'name_asc' },
  { label: 'Price ↑', value: 'price_asc' },
  { label: 'Price ↓', value: 'price_desc' },
];

interface Props {
  selectedCategories: string[];
  sort: SortOption;
  onCategoryToggle: (cat: string) => void;
  onSortChange: (sort: SortOption) => void;
  availableCategories: string[];
}

export default function ProductFilters({
  selectedCategories,
  sort,
  onCategoryToggle,
  onSortChange,
  availableCategories,
}: Props) {
  const visible = CATEGORIES.filter((c) => availableCategories.includes(c));

  return (
    <div className={styles.bar}>
      <div className={styles.categories}>
        {visible.map((cat) => (
          <button
            key={cat}
            className={`${styles.catChip} ${selectedCategories.includes(cat) ? styles.active : ''}`}
            onClick={() => onCategoryToggle(cat)}
          >
            {cat}
          </button>
        ))}
        {selectedCategories.length > 0 && (
          <button
            className={styles.clearBtn}
            onClick={() => selectedCategories.forEach((c) => onCategoryToggle(c))}
          >
            Clear ✕
          </button>
        )}
      </div>

      <div className={styles.sortWrap}>
        <span className={styles.sortLabel}>Sort:</span>
        <div className={styles.sortOptions}>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.sortBtn} ${sort === opt.value ? styles.sortActive : ''}`}
              onClick={() => onSortChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
