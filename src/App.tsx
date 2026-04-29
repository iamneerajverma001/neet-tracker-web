import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActionBar } from "./components/ActionBar";
import { FooterStats } from "./components/FooterStats";
import { HeaderProgress } from "./components/HeaderProgress";
import { NextTopicCard } from "./components/NextTopicCard";  
import { QuickJump } from "./components/QuickJump";
import { TopicCard } from "./components/TopicCard";
import { allTopics, subjectMeta, tierMeta } from "./data/trackerData";
import styles from "./styles/tracker.module.css";
import type { DoneMap, ExpandMap, Subject, Tier } from "./types";
import { exportProgressSummaryPdf } from "./utils/pdf";
import { countDone, nextIncomplete, percent } from "./utils/progress";
import { clearDoneMap, loadDoneMap, saveDoneMap, loadExpandMap, saveExpandMap } from "./utils/storage";

export default function App() {
  const subjectOrder: Subject[] = ["physics", "chemistry", "biology"];

  const [done, setDone] = useState<DoneMap>(() => loadDoneMap());
  const [expand, setExpand] = useState<ExpandMap>(() => loadExpandMap());
  const [openTopicId, setOpenTopicId] = useState<string | null>(null);
  const [openSubjects, setOpenSubjects] = useState<Record<Subject, boolean>>({
    physics: false,
    chemistry: false,
    biology: false,
  });
  const [openTiers, setOpenTiers] = useState<Record<string, boolean>>({});
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const topicRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    saveDoneMap(done);
  }, [done]);

  useEffect(() => {
    saveExpandMap(expand);
  }, [expand]);

  const physicsTopics = useMemo(() => allTopics.filter((topic) => topic.subject === "physics"), []);
  const chemistryTopics = useMemo(() => allTopics.filter((topic) => topic.subject === "chemistry"), []);
  const biologyTopics = useMemo(() => allTopics.filter((topic) => topic.subject === "biology"), []);

  // Calculate effective progress including expand progress
  const calcEffectiveProgress = (topics: typeof allTopics) => {
    let totalProgress = 0;
    topics.forEach((topic) => {
      if (done[topic.id]) {
        totalProgress += 100;
      } else {
        totalProgress += Math.min(90, (expand[topic.id] ?? 0) * 10);
      }
    });
    return Math.round(totalProgress / topics.length);
  };

  const totalDone = countDone(done, allTopics);
  const physicsDone = countDone(done, physicsTopics);
  const chemistryDone = countDone(done, chemistryTopics);
  const biologyDone = countDone(done, biologyTopics);
  const overallPct = calcEffectiveProgress(allTopics);
  const physicsEffectivePct = calcEffectiveProgress(physicsTopics);
  const chemistryEffectivePct = calcEffectiveProgress(chemistryTopics);
  const biologyEffectivePct = calcEffectiveProgress(biologyTopics);

  const tierSummary = useMemo(
    () =>
      ([1, 2, 3] as const).map((tier) => {
        const topics = allTopics.filter((topic) => topic.tier === tier);
        return {
          tier,
          done: countDone(done, topics),
          total: topics.length,
        };
      }),
    [done],
  );

  const subjectTopicMap = useMemo(
    () => ({
      physics: physicsTopics,
      chemistry: chemistryTopics,
      biology: biologyTopics,
    }),
    [physicsTopics, chemistryTopics, biologyTopics],
  );

  const nextTopic = nextIncomplete(allTopics, done);
  const nextTierLabel = nextTopic ? tierMeta[nextTopic.tier].label : "";

  const firstPendingByTier = useMemo(
    () =>
      ([1, 2, 3] as const).map((tier) => ({
        tier,
        topic: allTopics.find((topic) => topic.tier === tier && !done[topic.id]),
      })),
    [done],
  );

  const toggleDone = useCallback((id: string) => {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
    // Clear expand progress when marked done
    if (!done[id]) {
      setExpand((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }, [done]);

  const toggleExpand = useCallback((id: string) => {
    setExpand((prev) => {
      const current = prev[id] ?? 0;
      if (current < 9) {
        return { ...prev, [id]: current + 1 };
      }
      return prev;
    });
  }, []);

  const scrollToTopic = useCallback((id: string) => {
    const el = topicRefs.current[id];
    if (el) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
      setOpenTopicId(id);
    }
  }, []);

  const toggleOpenTopic = useCallback((id: string) => {
    setOpenTopicId((prev) => (prev === id ? null : id));
  }, []);

  const registerTopicRef = useCallback((id: string, el: HTMLElement | null) => {
    topicRefs.current[id] = el;
  }, []);

  const toggleSubject = useCallback((subject: Subject) => {
    setOpenSubjects((prev) => {
      const nextOpen = !prev[subject];

      if (nextOpen) {
        const tierKey = `${subject}-1`;
        setOpenTiers((tiers) => ({ ...tiers, [tierKey]: true }));
      }

      return { ...prev, [subject]: nextOpen };
    });
  }, []);

  const toggleTierSection = useCallback((subject: Subject, tier: Tier) => {
    const key = `${subject}-${tier}`;
    setOpenTiers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  function resetProgress() {
    const ok = window.confirm("Reset all saved progress?");
    if (!ok) {
      return;
    }

    clearDoneMap();
    setDone({});
    setOpenTopicId(null);
  }

  async function exportUiPdf() {
    if (isExportingPdf) {
      return;
    }

    setIsExportingPdf(true);
    try {
      await exportProgressSummaryPdf(allTopics, done, "neet-progress-report.pdf");
    } catch {
      window.alert("Could not export progress report PDF. Please try again.");
    } finally {
      setIsExportingPdf(false);
    }
  }

  return (
    <div className={styles.page}>
      <HeaderProgress
        totalDone={totalDone}
        total={allTopics.length}
        overallPct={overallPct}
        physicsDone={physicsDone}
        physicsTotal={physicsTopics.length}
        physicsEffectivePct={physicsEffectivePct}
        chemistryDone={chemistryDone}
        chemistryTotal={chemistryTopics.length}
        chemistryEffectivePct={chemistryEffectivePct}
        biologyDone={biologyDone}
        biologyTotal={biologyTopics.length}
        biologyEffectivePct={biologyEffectivePct}
        tierSummary={tierSummary}
      />

      <main className={styles.container}>
        <NextTopicCard
          topic={nextTopic}
          tierLabel={nextTierLabel}
          tier={nextTopic?.tier ?? 1}
          subjectIcon={nextTopic ? subjectMeta[nextTopic.subject].icon : ""}
          onDone={toggleDone}
        />

        <QuickJump entries={firstPendingByTier} onJump={scrollToTopic} />

        <ActionBar
          onReset={resetProgress}
          onExportPdf={exportUiPdf}
          isExportingPdf={isExportingPdf}
        />

        {subjectOrder.map((subject) => {
          const visibleSubjectTopics = allTopics.filter((topic) => topic.subject === subject);
          if (visibleSubjectTopics.length === 0) {
            return null;
          }

          const subjectTotal = subjectTopicMap[subject].length;
          const subjectDoneCount = countDone(done, subjectTopicMap[subject]);
          const isSubjectOpen = openSubjects[subject];

          return (
            <section key={subject} className={styles.subjectSectionCard}>
              <button
                type="button"
                className={styles.subjectSectionToggle}
                onClick={() => toggleSubject(subject)}
              >
                <span className={styles.subjectSectionTitle}>
                  {subjectMeta[subject].icon} {subject.charAt(0).toUpperCase() + subject.slice(1)}
                </span>
                <span className={styles.subjectSectionStats}>
                  {subjectDoneCount}/{subjectTotal} {isSubjectOpen ? "Hide" : "Expand"}
                </span>
              </button>

              {isSubjectOpen && (
                <div className={styles.subjectSectionBody}>
                  {([1, 2, 3] as const).map((tier) => {
                    const tierTopics = visibleSubjectTopics.filter((topic) => topic.tier === tier);
                    if (tierTopics.length === 0) {
                      return null;
                    }

                    const tierKey = `${subject}-${tier}`;
                    const tierOpen = !!openTiers[tierKey];
                    const tierDone = countDone(done, tierTopics);

                    return (
                      <section key={tierKey} className={styles.tierSectionCard}>
                        <button
                          type="button"
                          className={styles.tierSectionToggle}
                          onClick={() => toggleTierSection(subject, tier)}
                        >
                          <span>
                            Tier {tier} - {tierMeta[tier].label}
                          </span>
                          <span>
                            {tierDone}/{tierTopics.length} {tierOpen ? "Hide" : "Expand"}
                          </span>
                        </button>

                        {tierOpen && (
                          <div className={styles.tierSectionBody}>
                            {tierTopics.map((topic) => (
                              <TopicCard
                                key={topic.id}
                                topic={topic}
                                isOpen={openTopicId === topic.id}
                                isDone={!!done[topic.id]}
                                isNext={nextTopic?.id === topic.id}
                                expandCount={expand[topic.id] ?? 0}
                                tierMeta={tierMeta}
                                subjectMeta={subjectMeta}
                                onToggleOpen={toggleOpenTopic}
                                onToggleDone={toggleDone}
                                onExpand={toggleExpand}
                                registerRef={registerTopicRef}
                              />
                            ))}
                          </div>
                        )}
                      </section>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}

        {totalDone === allTopics.length && (
          <section className={styles.doneCard}>
            <h3>All {allTopics.length} Topics Completed</h3>
            <p>Move to full mocks and revision loops now.</p>
          </section>
        )}

        <FooterStats />
      </main>
    </div>
  );
}
