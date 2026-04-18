import type { DoneMap, Subject, Tier, Topic } from "../types";

export function countDone(done: DoneMap, topics: Topic[]): number {
  return topics.filter((topic) => !!done[topic.id]).length;
}

export function percent(doneCount: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round((doneCount / total) * 100);
}

export function nextIncomplete(topics: Topic[], done: DoneMap): Topic | undefined {
  return topics.find((topic) => !done[topic.id]);
}

export function filterTopics(
  topics: Topic[],
  opts: { subject: Subject | "both"; tier: Tier | 0; search: string },
): Topic[] {
  const search = opts.search.trim().toLowerCase();

  return topics.filter((topic) => {
    const subjectMatch = opts.subject === "both" || topic.subject === opts.subject;
    const tierMatch = opts.tier === 0 || topic.tier === opts.tier;
    const searchMatch =
      search.length === 0 ||
      topic.name.toLowerCase().includes(search) ||
      topic.subtopics.some((subtopic) => subtopic.toLowerCase().includes(search));

    return subjectMatch && tierMatch && searchMatch;
  });
}
