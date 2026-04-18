import { describe, expect, it } from "vitest";
import { filterTopics, nextIncomplete, percent } from "./progress";
import type { DoneMap, Topic } from "../types";

const mockTopics: Topic[] = [
  {
    id: "p1",
    order: 1,
    subject: "physics",
    tier: 1,
    name: "Current Electricity",
    tag: "Class 12",
    q: "3 Qs",
    days: 3,
    why: "why",
    subtopics: ["Kirchhoff law"],
    tip: "tip",
    source: "NCERT",
    pyq: "trend",
  },
  {
    id: "c1",
    order: 2,
    subject: "chemistry",
    tier: 2,
    name: "Chemical Bonding",
    tag: "Class 11",
    q: "2 Qs",
    days: 2,
    why: "why",
    subtopics: ["VSEPR"],
    tip: "tip",
    source: "NCERT",
    pyq: "trend",
  },
];

describe("progress utilities", () => {
  it("calculates percent safely", () => {
    expect(percent(0, 0)).toBe(0);
    expect(percent(1, 2)).toBe(50);
  });

  it("finds the next incomplete topic", () => {
    const done: DoneMap = { p1: true };
    expect(nextIncomplete(mockTopics, done)?.id).toBe("c1");
  });

  it("filters by subject, tier, and search", () => {
    const filtered = filterTopics(mockTopics, {
      subject: "chemistry",
      tier: 2,
      search: "vsepr",
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("c1");
  });
});
