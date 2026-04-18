import { useEffect, useMemo, useRef, useState } from "react";
import { ActionBar } from "./components/ActionBar";
import { Filters } from "./components/Filters";
import { FooterStats } from "./components/FooterStats";
import { HeaderProgress } from "./components/HeaderProgress";
import { NextTopicCard } from "./components/NextTopicCard";
import { QuickJump } from "./components/QuickJump";
import { TopicCard } from "./components/TopicCard";
import { allTopics, subjectMeta, tierMeta } from "./data/trackerData";
import styles from "./styles/tracker.module.css";
import type { DoneMap, Subject, Tier } from "./types";
import { countDone, filterTopics, nextIncomplete, percent } from "./utils/progress";
import { loadDoneMap, saveDoneMap } from "./utils/storage";

export default function App() {
  const [done, setDone] = useState<DoneMap>(() => loadDoneMap());
  const [subjectFilter, setSubjectFilter] = useState<Subject | "both">("both");
  const [tierFilter, setTierFilter] = useState<Tier | 0>(0);
  const [search, setSearch] = useState("");
  const [openTopicId, setOpenTopicId] = useState<string | null>(null);

  const importRef = useRef<HTMLInputElement | null>(null);
  const topicRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    saveDoneMap(done);
  }, [done]);

  const physicsTopics = useMemo(() => allTopics.filter((topic) => topic.subject === "physics"), []);
  const chemistryTopics = useMemo(() => allTopics.filter((topic) => topic.subject === "chemistry"), []);

  const totalDone = countDone(done, allTopics);
  const physicsDone = countDone(done, physicsTopics);
  const chemistryDone = countDone(done, chemistryTopics);
  const overallPct = percent(totalDone, allTopics.length);

  const filteredTopics = useMemo(
    () => filterTopics(allTopics, { subject: subjectFilter, tier: tierFilter, search }),
    [subjectFilter, tierFilter, search],
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

  function toggleDone(id: string) {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function scrollToTopic(id: string) {
    const el = topicRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setOpenTopicId(id);
    }
  }

  function resetProgress() {
    const ok = window.confirm("Reset all saved progress?");
    if (!ok) {
      return;
    }

    setDone({});
    setOpenTopicId(null);
  }

  function exportProgress() {
    const payload = {
      exportedAt: new Date().toISOString(),
      done,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "neet-tracker-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importProgress(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { done?: DoneMap };
        if (!parsed.done || typeof parsed.done !== "object") {
          window.alert("Invalid progress file.");
          return;
        }

        const nextMap: DoneMap = {};
        for (const [key, value] of Object.entries(parsed.done)) {
          if (typeof value === "boolean") {
            nextMap[key] = value;
          }
        }

        setDone(nextMap);
      } catch {
        window.alert("Could not import progress. Please select a valid JSON file.");
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className={styles.page}>
      <HeaderProgress
        totalDone={totalDone}
        total={allTopics.length}
        overallPct={overallPct}
        physicsDone={physicsDone}
        physicsTotal={physicsTopics.length}
        chemistryDone={chemistryDone}
        chemistryTotal={chemistryTopics.length}
      />

      <main className={styles.container}>
        <NextTopicCard
          topic={nextTopic}
          tierLabel={nextTierLabel}
          tier={nextTopic?.tier ?? 1}
          subjectIcon={nextTopic ? subjectMeta[nextTopic.subject].icon : ""}
          onDone={toggleDone}
        />

        <Filters
          subject={subjectFilter}
          tier={tierFilter}
          search={search}
          onSubject={setSubjectFilter}
          onTier={setTierFilter}
          onSearch={setSearch}
        />

        <QuickJump entries={firstPendingByTier} onJump={scrollToTopic} />

        <ActionBar
          onReset={resetProgress}
          onExport={exportProgress}
          onImportClick={() => importRef.current?.click()}
        />

        <input
          ref={importRef}
          type="file"
          accept="application/json"
          aria-label="Import saved progress"
          className={styles.hiddenInput}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              importProgress(file);
            }
            e.currentTarget.value = "";
          }}
        />

        {filteredTopics.length === 0 && (
          <div className={styles.emptyState}>No topics match your filters. Try a different search.</div>
        )}

        {filteredTopics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            isOpen={openTopicId === topic.id}
            isDone={!!done[topic.id]}
            isNext={nextTopic?.id === topic.id}
            tierMeta={tierMeta}
            subjectMeta={subjectMeta}
            onToggleOpen={(id) => setOpenTopicId((prev) => (prev === id ? null : id))}
            onToggleDone={toggleDone}
            registerRef={(id, el) => {
              topicRefs.current[id] = el;
            }}
          />
        ))}

        {totalDone === allTopics.length && (
          <section className={styles.doneCard}>
            <h3>All 33 Topics Completed</h3>
            <p>Move to full mocks and revision loops now.</p>
          </section>
        )}

        <FooterStats />
      </main>
    </div>
  );
}
