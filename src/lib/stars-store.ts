"use client";

import { useMemo, useSyncExternalStore } from "react";
import { STARS_KEY, parseStars, saveStars, toggled } from "./stars";

/**
 * The starred list as an external store, read with `useSyncExternalStore` the
 * way the chapters sidebar reads its folded state. The server and the first
 * client render both use the empty snapshot, so the markup matches and nothing
 * mismatches on hydration; the real list arrives straight after, and only then
 * does the shelf reorder.
 *
 * If storage refuses a write, the list is held in memory for the visit, so a
 * star still works and nothing breaks.
 */
const EVENT = "origan-shelf-stars";

// Only set when storage refused a write.
let held: string | null = null;

function readRaw(): string {
  if (held !== null) return held;
  try {
    return window.localStorage.getItem(STARS_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  // Another tab starred something.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** The ids starred on this device that still exist on the shelf. */
export function useStars(known: readonly string[]): ReadonlySet<string> {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  return useMemo(() => new Set(parseStars(raw, known)), [raw, known]);
}

/** Star or unstar one item, and tell every listener. */
export function toggleStar(id: string, known: readonly string[]) {
  const next = toggled(parseStars(readRaw(), known), id);
  let storage: Storage | undefined;
  try {
    storage = window.localStorage;
  } catch {
    // Even asking for storage can throw when site data is blocked.
  }
  held = saveStars(storage, next) ? null : JSON.stringify(next);
  window.dispatchEvent(new Event(EVENT));
}
