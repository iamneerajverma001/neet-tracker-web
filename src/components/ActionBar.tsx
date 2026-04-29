import styles from "../styles/tracker.module.css";

interface ActionBarProps {
  onReset: () => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
}

export function ActionBar({ onReset, onExportPdf, isExportingPdf }: ActionBarProps) {
  return (
    <section className={styles.actionBar}>
      <button type="button" className={styles.secondaryButton} onClick={onExportPdf} disabled={isExportingPdf}>
        {isExportingPdf ? "Creating PDF Report..." : "Export Progress Report"}
      </button>
      <button type="button" className={styles.secondaryButton} onClick={onReset}>Reset Progress</button>
    </section>
  );
}
