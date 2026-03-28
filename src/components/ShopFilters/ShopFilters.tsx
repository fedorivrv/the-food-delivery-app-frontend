import styles from './ShopFilters.module.css';

const RATING_RANGES = [
  { label: '⭐ 4.0 – 5.0', value: '4-5' },
  { label: '⭐ 3.0 – 4.0', value: '3-4' },
  { label: '⭐ 2.0 – 3.0', value: '2-3' },
];

interface Props {
  selected: string;
  onChange: (range: string) => void;
}

export default function ShopFilters({ selected, onChange }: Props) {
  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Filter by rating</span>
      <div className={styles.options}>
        <button
          className={`${styles.chip} ${selected === '' ? styles.active : ''}`}
          onClick={() => onChange('')}
        >
          All
        </button>
        {RATING_RANGES.map((r) => (
          <button
            key={r.value}
            className={`${styles.chip} ${selected === r.value ? styles.active : ''}`}
            onClick={() => onChange(selected === r.value ? '' : r.value)}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
}
