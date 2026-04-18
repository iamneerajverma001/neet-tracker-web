import type { Subject, Tier } from "../types";
import styles from "../styles/tracker.module.css";

interface FiltersProps {
  subject: Subject | "both";
  tier: Tier | 0;
  search: string;
  onSubject: (next: Subject | "both") => void;
  onTier: (next: Tier | 0) => void;
  onSearch: (next: string) => void;
}

export function Filters({ subject, tier, search, onSubject, onTier, onSearch }: FiltersProps) {
  return (
    <section className={styles.filtersWrap}>
      <input
        className={styles.searchInput}
        placeholder="Search topic or sub-topic"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className={styles.pillRow}>
        {(["both", "physics", "chemistry"] as const).map((key) => (
          <button
            key={key}
            className={`${styles.pill} ${subject === key ? styles.pillActive : ""}`}
            onClick={() => onSubject(key)}
          >
            {key === "both" ? "All" : key}
          </button>
        ))}
      </div>

      <div className={styles.pillRow}>
        {[0, 1, 2, 3].map((value) => (
          <button
            key={value}
            className={`${styles.pill} ${tier === value ? styles.pillActive : ""}`}
            onClick={() => onTier(value as Tier | 0)}
          >
            {value === 0 ? "All" : `Tier ${value}`}
          </button>
        ))}
      </div>
    </section>
  );
}
