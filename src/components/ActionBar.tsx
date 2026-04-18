import styles from "../styles/tracker.module.css";

interface ActionBarProps {
  onReset: () => void;
  onExport: () => void;
  onImportClick: () => void;
}

export function ActionBar({ onReset, onExport, onImportClick }: ActionBarProps) {
  return (
    <section className={styles.actionBar}>
      <button className={styles.secondaryButton} onClick={onExport}>Export Progress</button>
      <button className={styles.secondaryButton} onClick={onImportClick}>Import Progress</button>
      <button className={styles.secondaryButton} onClick={onReset}>Reset Progress</button>
    </section>
  );
}
