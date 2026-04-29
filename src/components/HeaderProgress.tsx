import styles from "../styles/tracker.module.css";

interface HeaderProgressProps {
  totalDone: number;
  total: number;
  overallPct: number;
  physicsDone: number;
  physicsTotal: number;
  physicsEffectivePct?: number;
  chemistryDone: number;
  chemistryTotal: number;
  chemistryEffectivePct?: number;
  biologyDone: number;
  biologyTotal: number;
  biologyEffectivePct?: number;
  tierSummary: Array<{ tier: 1 | 2 | 3; done: number; total: number }>;
}

export function HeaderProgress(props: HeaderProgressProps) {
  const physicsPct = props.physicsEffectivePct ?? Math.round((props.physicsDone / props.physicsTotal) * 100);
  const chemistryPct = props.chemistryEffectivePct ?? Math.round((props.chemistryDone / props.chemistryTotal) * 100);
  const biologyPct = props.biologyEffectivePct ?? Math.round((props.biologyDone / props.biologyTotal) * 100);
  const circumference = 2 * Math.PI * 16;

  function ringProgress(
    pct: number,
    valueClass: string,
    label: string,
    valueText: string,
    metaText: string,
  ) {
    const clamped = Math.max(0, Math.min(100, pct));
    const progress = (clamped / 100) * circumference;
    const dashArray = `${progress} ${circumference}`;

    return (
      <div className={styles.ringCard}>
        <div className={styles.ringDial}>
          <svg viewBox="0 0 40 40" className={styles.ringSvg} role="img" aria-label={`${label} ${valueText}`}>
            <circle className={styles.ringTrack} cx="20" cy="20" r="16" />
            <circle
              className={valueClass}
              cx="20"
              cy="20"
              r="16"
              strokeDasharray={dashArray}
              transform="rotate(-90 20 20)"
            />
          </svg>
          <div className={styles.ringInner}>{valueText}</div>
        </div>
        <div className={styles.ringMeta}>
          <h3>{label}</h3>
          <p>{metaText}</p>
        </div>
      </div>
    );
  }

  return (
    <header className={styles.header}>
      <p className={styles.kicker}>NEET Smart Tracker</p>
      <h1 className={styles.title}>Step-by-Step Study Flow Map</h1>

      <section className={styles.ringGrid}>
        {ringProgress(
          props.overallPct,
          styles.ringValue,
          "Overall",
          `${props.overallPct}%`,
          `${props.totalDone}/${props.total} topics completed`,
        )}
        {ringProgress(
          physicsPct,
          styles.physicsRing,
          "Physics",
          `${physicsPct}%`,
          `${props.physicsDone}/${props.physicsTotal}`,
        )}
        {ringProgress(
          chemistryPct,
          styles.chemistryRing,
          "Chemistry",
          `${chemistryPct}%`,
          `${props.chemistryDone}/${props.chemistryTotal}`,
        )}
        {ringProgress(
          biologyPct,
          styles.biologyRing,
          "Biology",
          `${biologyPct}%`,
          `${props.biologyDone}/${props.biologyTotal}`,
        )}
      </section>

      <section className={styles.tierStrip}>
        {props.tierSummary.map((entry) => {
          const tierPct = Math.round((entry.done / entry.total) * 100);

          return (
            <div key={entry.tier} className={styles.tierBlock}>
              <p>Tier {entry.tier}</p>
              <strong>{tierPct}%</strong>
              <span>
                {entry.done}/{entry.total}
              </span>
            </div>
          );
        })}
      </section>
    </header>
  );
}
