import { ProgressBar } from "./ProgressBar";
import styles from "../styles/tracker.module.css";

interface HeaderProgressProps {
  totalDone: number;
  total: number;
  overallPct: number;
  physicsDone: number;
  physicsTotal: number;
  chemistryDone: number;
  chemistryTotal: number;
}

export function HeaderProgress(props: HeaderProgressProps) {
  return (
    <header className={styles.header}>
      <p className={styles.kicker}>NEET Smart Tracker</p>
      <h1 className={styles.title}>Step-by-Step Study Flow Map</h1>

      <section className={styles.progressSection}>
        <div className={styles.progressLabelRow}>
          <span>Overall Progress</span>
          <span>
            {props.totalDone}/{props.total} · {props.overallPct}%
          </span>
        </div>
        <ProgressBar pct={props.overallPct} color="#a78bfa" />
      </section>

      <section className={styles.subjectGrid}>
        <div>
          <div className={styles.progressLabelRow}>
            <span className={styles.physicsText}>⚡ physics</span>
            <span>
              {props.physicsDone}/{props.physicsTotal}
            </span>
          </div>
          <ProgressBar
            pct={Math.round((props.physicsDone / props.physicsTotal) * 100)}
            color="#00c6ff"
            thin
          />
        </div>

        <div>
          <div className={styles.progressLabelRow}>
            <span className={styles.chemistryText}>🧪 chemistry</span>
            <span>
              {props.chemistryDone}/{props.chemistryTotal}
            </span>
          </div>
          <ProgressBar
            pct={Math.round((props.chemistryDone / props.chemistryTotal) * 100)}
            color="#f953c6"
            thin
          />
        </div>
      </section>
    </header>
  );
}
