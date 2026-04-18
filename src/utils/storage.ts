import type { DoneMap } from "../types";

export const STORAGE_KEY = "neet-tracker-progress-v1";

export function loadDoneMap(): DoneMap {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const next: DoneMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "boolean") {
        next[key] = value;
      }
    }

    return next;
  } catch {
    return {};
  }
}

export function saveDoneMap(doneMap: DoneMap): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(doneMap));
}
