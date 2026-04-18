import type { Topic } from "../types";
import styles from "../styles/tracker.module.css";

interface QuickJumpProps {
  entries: Array<{ tier: number; topic?: Topic }>;
  onJump: (topicId: string) => void;
}

export function QuickJump({ entries, onJump }: QuickJumpProps) {
  return (
    <section className={styles.quickJump}>
      <span className={styles.quickJumpLabel}>Quick Jump:</span>
      {entries.map((entry) => (
        <button
          key={entry.tier}
          className={styles.quickButton}
          disabled={!entry.topic}
          onClick={() => entry.topic && onJump(entry.topic.id)}
          title={entry.topic?.name ?? "Tier complete"}
        >
          Tier {entry.tier}: {entry.topic ? `#${entry.topic.order}` : "Done"}
        </button>
      ))}
    </section>
  );
}
