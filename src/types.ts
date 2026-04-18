export type Subject = "physics" | "chemistry";
export type Tier = 1 | 2 | 3;

export type DoneMap = Record<string, boolean>;

export interface Topic {
  id: string;
  order: number;
  subject: Subject;
  tier: Tier;
  name: string;
  tag: string;
  q: string;
  days: number;
  why: string;
  subtopics: string[];
  tip: string;
  source: string;
  pyq: string;
}

export interface TierMeta {
  label: string;
  color: string;
  bg: string;
  desc: string;
}

export interface SubjectMeta {
  color: string;
  glow: string;
  icon: string;
}

export type TierMetaMap = Record<Tier, TierMeta>;
export type SubjectMetaMap = Record<Subject, SubjectMeta>;
