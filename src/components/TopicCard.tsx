import type { SubjectMetaMap, TierMetaMap, Topic } from "../types";
import { ProgressBar } from "./ProgressBar";
import styles from "../styles/tracker.module.css";

interface TopicCardProps {
  topic: Topic;
  isOpen: boolean;
  isDone: boolean;
  isNext: boolean;
  tierMeta: TierMetaMap;
  subjectMeta: SubjectMetaMap;
  onToggleOpen: (id: string) => void;
  onToggleDone: (id: string) => void;
  registerRef: (id: string, el: HTMLElement | null) => void;
}

export function TopicCard({
  topic,
  isOpen,
  isDone,
  isNext,
  tierMeta,
  subjectMeta,
  onToggleOpen,
  onToggleDone,
  registerRef,
}: TopicCardProps) {
  const tm = tierMeta[topic.tier];
  const sm = subjectMeta[topic.subject];

  return (
    <article
      ref={(el) => registerRef(topic.id, el)}
      className={`${styles.topicCard} ${isDone ? styles.topicDone : ""} ${isNext ? styles.topicNext : ""}`}
    >
      <div className={styles.topicTop} onClick={() => onToggleOpen(topic.id)}>
        <button className={styles.stepButton} onClick={(e) => { e.stopPropagation(); onToggleDone(topic.id); }}>
          {isDone ? "✓" : topic.order}
        </button>

        <div className={styles.topicMain}>
          <p className={styles.topicTitle}>
            {sm.icon} {topic.name}
          </p>
          <p className={styles.topicMeta}>{tm.label} · {topic.tag} · {topic.days}d · {topic.q}</p>
          <ProgressBar pct={isDone ? 100 : isNext ? 10 : 0} color={tm.color} thin />
        </div>

        <span className={styles.chevron}>{isOpen ? "▴" : "▾"}</span>
      </div>

      {isOpen && (
        <div className={styles.topicBody}>
          <section className={styles.panel}>
            <h4>Why Study This</h4>
            <p>{topic.why}</p>
          </section>

          <section className={styles.panel}>
            <h4>Sub-Topics</h4>
            <ul className={styles.subtopicList}>
              {topic.subtopics.map((subtopic, index) => (
                <li key={subtopic}>
                  <span>{isDone ? "✓" : index + 1}</span>
                  <p>{subtopic}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.panel}>
            <h4>Power Tip</h4>
            <p>{topic.tip}</p>
          </section>

          <section className={styles.panelGrid}>
            <div>
              <h4>Source</h4>
              <p>{topic.source}</p>
            </div>
            <div>
              <h4>PYQ Trend</h4>
              <p>{topic.pyq}</p>
            </div>
          </section>

          <button className={styles.secondaryButton} onClick={() => onToggleDone(topic.id)}>
            {isDone ? "Mark Incomplete" : "Mark Complete"}
          </button>
        </div>
      )}
    </article>
  );
}
