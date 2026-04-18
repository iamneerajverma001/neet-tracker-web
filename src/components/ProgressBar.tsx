import styles from "../styles/tracker.module.css";

interface ProgressBarProps {
  pct: number;
  color: string;
  thin?: boolean;
}

export function ProgressBar({ pct, color, thin = false }: ProgressBarProps) {
  const colorClass =
    color === "#00c6ff"
      ? styles.progressPhysics
      : color === "#f953c6"
        ? styles.progressChemistry
        : color === "#ff5050"
          ? styles.progressTier1
          : color === "#ffc800"
            ? styles.progressTier2
            : color === "#00c864"
              ? styles.progressTier3
              : styles.progressDefault;

  return (
    <progress
      className={`${thin ? styles.progressTrackThin : styles.progressTrack} ${colorClass}`}
      value={pct}
      max={100}
      aria-label="Progress"
    />
  );
}
