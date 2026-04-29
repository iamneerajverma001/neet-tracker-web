import styles from "../styles/tracker.module.css";

interface ModernCheckboxProps {
  checked: boolean;
  onChange: (e: React.MouseEvent<HTMLButtonElement>) => void;
  label: string;
  topicName: string;
}

export function ModernCheckbox({ checked, onChange, label, topicName }: ModernCheckboxProps) {
  return (
    <button
      type="button"
      className={`${styles.modernCheckbox} ${checked ? styles.modernCheckboxChecked : ""}`}
      aria-label={label}
      title={label}
      onClick={onChange}
    >
      <span className={styles.modernCheckboxBox}>
        {checked && <span className={styles.modernCheckboxTick}>✓</span>}
      </span>
    </button>
  );
}
