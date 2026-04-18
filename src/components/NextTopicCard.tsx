import type { Topic } from "../types";
import styles from "../styles/tracker.module.css";

interface NextTopicCardProps {
  topic?: Topic;
  tierLabel: string;
  tier: 1 | 2 | 3;
  subjectIcon: string;
  onDone: (id: string) => void;
}

export function NextTopicCard({ topic, tierLabel, tier, subjectIcon, onDone }: NextTopicCardProps) {
  if (!topic) {
    return null;
  }

  return (
    <section className={`${styles.nextCard} ${styles[`nextTier${tier}`]}`}>
      <p className={styles.nextKicker}>Study This Next</p>
      <div className={styles.nextMainRow}>
        <div>
          <h2 className={styles.nextTitle}>#{topic.order} {topic.name}</h2>
          <p className={styles.nextMeta}>
            {subjectIcon} {tierLabel} · {topic.tag} · {topic.days} days · {topic.q}
          </p>
        </div>
        <button className={styles.ctaButton} onClick={() => onDone(topic.id)}>
          Mark Done
        </button>
      </div>
    </section>
  );
}
