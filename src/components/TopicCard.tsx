import { memo } from "react";
import type { SubjectMetaMap, TierMetaMap, Topic } from "../types";
import { ProgressCircle } from "./ProgressCircle";
import { ModernCheckbox } from "./ModernCheckbox";
import styles from "../styles/tracker.module.css";

interface TopicCardProps {
  topic: Topic;
  isOpen: boolean;
  isDone: boolean;
  isNext: boolean;
  expandCount: number;
  tierMeta: TierMetaMap;
  subjectMeta: SubjectMetaMap;
  onToggleOpen: (id: string) => void;
  onToggleDone: (id: string) => void;
  onExpand: (id: string) => void;
  registerRef: (id: string, el: HTMLElement | null) => void;
}

export const TopicCard = memo(function TopicCard({
  topic,
  isOpen,
  isDone,
  isNext,
  expandCount,
  tierMeta,
  subjectMeta,
  onToggleOpen,
  onToggleDone,
  onExpand,
  registerRef,
}: TopicCardProps) {
  const tm = tierMeta[topic.tier];
  const sm = subjectMeta[topic.subject];
  const progressPct = isDone ? 100 : Math.min(90, expandCount * 10);
  
  const handleToggleOpen = () => {
    // Only increment expand progress when OPENING the tile, not when closing
    if (!isOpen && !isDone && expandCount < 9) {
      onExpand(topic.id);
    }
    onToggleOpen(topic.id);
  };

  return (
    <article
      ref={(el) => registerRef(topic.id, el)}
      className={`${styles.topicCard} ${isDone ? styles.topicDone : ""} ${isNext ? styles.topicNext : ""}`}
    >
      <div className={styles.topicTop}>
        <ModernCheckbox
          checked={isDone}
          onChange={(e) => {
            e.stopPropagation();
            onToggleDone(topic.id);
          }}
          label={`${isDone ? "Mark incomplete" : "Mark complete"} for ${topic.name}`}
          topicName={topic.name}
        />

        <button
          type="button"
          className={styles.topicToggle}
          aria-label={`Toggle details for ${topic.name}`}
          onClick={handleToggleOpen}
        >
          <div className={styles.topicMain}>
            <p className={styles.topicTitle}>
              {sm.icon} {topic.name}
            </p>
            <p className={styles.topicMeta}>
              {tm.label} · {topic.tag} · {topic.days}d · {topic.q} · {progressPct}%
            </p>
            <ProgressCircle pct={progressPct} color={tm.color} size="small" />
          </div>

          <span className={styles.chevron}>{isOpen ? "▴" : "▾"}</span>
        </button>
      </div>

      {isOpen && (
        <div className={styles.topicBody}>
          <section className={styles.chapterStatusPanel}>
            <div>
              <h4>Chapter Checklist Status</h4>
              <p>{isDone ? "Checked: Chapter completed" : "Unchecked: Chapter pending"}</p>
            </div>
            <button type="button" className={styles.secondaryButton} onClick={() => onToggleDone(topic.id)}>
              {isDone ? "Uncheck Chapter" : "Check Chapter"}
            </button>
          </section>

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

        </div>
      )}
    </article>
  );
});
