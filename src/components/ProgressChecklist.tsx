import type { DoneMap, Subject, Topic } from "../types";
import styles from "../styles/tracker.module.css";

interface ProgressChecklistProps {
  title: string;
  subject: Subject;
  topics: Topic[];
  done: DoneMap;
  onToggleDone: (id: string) => void;
}

export function ProgressChecklist({ title, subject, topics, done, onToggleDone }: ProgressChecklistProps) {
  const doneCount = topics.filter((topic) => done[topic.id]).length;
  const total = topics.length;

  return (
    <section className={styles.checklistCard}>
      <div className={styles.checklistHeader}>
        <h3>{title}</h3>
        <p>
          {doneCount}/{total} done
        </p>
      </div>

      <ul className={styles.checklistList}>
        {topics.map((topic) => {
          const isDone = !!done[topic.id];

          return (
            <li key={topic.id} className={styles.checklistItem}>
              <button
                type="button"
                className={`${styles.checkItemButton} ${isDone ? styles.checkItemDone : ""}`}
                onClick={() => onToggleDone(topic.id)}
                aria-label={`${isDone ? "Mark incomplete" : "Mark complete"} for ${topic.name}`}
              >
                <span className={styles.checkIcon}>{isDone ? "[x]" : "[ ]"}</span>
                <span className={styles.checkText}>
                  #{topic.order} {topic.name}
                </span>
                <span className={styles.checkMeta}>Tier {topic.tier}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className={styles.checklistFooter}>
        {subject === "physics" ? "Physics" : "Chemistry"} checklist helps you track each topic at a glance.
      </p>
    </section>
  );
}
