import styles from "../styles/tracker.module.css";

export function FooterStats() {
  return (
    <footer className={styles.footerCard}>
      <p className={styles.footerKicker}>Subject Target Benchmarks</p>
      <div className={styles.footerGrid}>
        <div>
          <p className={styles.footerScore}>100</p>
          <p>Physics</p>
          <p>~25-28 correct / 45</p>
        </div>
        <div>
          <p className={styles.footerScore}>100</p>
          <p>Chemistry</p>
          <p>~25-28 correct / 45</p>
        </div>
        <div>
          <p className={styles.footerScore}>360</p>
          <p>Biology</p>
          <p>90 correct / 90</p>
        </div>
      </div>
      <p className={styles.footerWarn}>Skip uncertain questions: each wrong = -1</p>
      <p className={styles.creditText}>LOVE FROM NEERAJ</p>
    </footer>
  );
}
