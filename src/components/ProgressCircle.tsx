import styles from "../styles/tracker.module.css";

interface ProgressCircleProps {
  pct: number;
  color: string;
  size?: "small" | "medium";
  showLabel?: boolean;
}

export function ProgressCircle({ pct, color, size = "small", showLabel = false }: ProgressCircleProps) {
  const radius = size === "small" ? 18 : 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;
  
  const colorClass =
    color === "#00c6ff"
      ? styles.circlePhysics
      : color === "#f953c6"
        ? styles.circleChemistry
        : color === "#ff5050"
          ? styles.circleTier1
          : color === "#ffc800"
            ? styles.circleTier2
            : color === "#00c864"
              ? styles.circleTier3
              : styles.circleDefault;

  const viewBox = size === "small" ? "0 0 50 50" : "0 0 60 60";
  const cx = size === "small" ? 25 : 30;
  const cy = size === "small" ? 25 : 30;

  return (
    <div className={`${styles.progressCircleContainer} ${styles[`progressCircle${size === "medium" ? "Medium" : "Small"}`]}`}>
      <svg viewBox={viewBox} className={styles.progressCircleSvg}>
        {/* Background circle */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(150, 152, 184, 0.15)"
          strokeWidth="2.5"
        />
        {/* Progress circle */}
        <circle
          className={`${styles.progressCircleStroke} ${colorClass}`}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.4s ease",
            transform: `rotate(-90deg)`,
            transformOrigin: `${cx}px ${cy}px`,
          }}
        />
      </svg>
      {showLabel && <span className={styles.progressCircleLabel}>{pct}%</span>}
    </div>
  );
}
