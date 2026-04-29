import type { DoneMap, ExpandMap } from "../types";

export const STORAGE_KEY = "neet-tracker-progress-v1";
export const EXPAND_STORAGE_KEY = "neet-tracker-expand-v1";

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

export function clearDoneMap(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function loadExpandMap(): ExpandMap {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(EXPAND_STORAGE_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const next: ExpandMap = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number") {
        next[key] = Math.max(0, Math.min(9, value));
      }
    }

    return next;
  } catch {
    return {};
  }
}

export function saveExpandMap(expandMap: ExpandMap): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(EXPAND_STORAGE_KEY, JSON.stringify(expandMap));
}
