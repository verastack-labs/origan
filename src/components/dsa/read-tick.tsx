"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * "Read" ticks, kept in this browser only. Nothing is sent anywhere and there
 * is no account. Storage can be unavailable (a private window, blocked site
 * data), so every access is guarded and the page works without it: the tick
 * simply does not stick.
 */
/** Per course, so two lessons with the same slug never share a tick. DSA in Rust keeps its original key. */
const keyOf = (course: string) => `origan:${course}:read`;
const eventOf = (course: string) => `origan-${course}-read`;

// Only set when storage refuses a write, so the tick still toggles for the
// visit rather than sitting dead.
const fallback = new Map<string, string>();

function readAll(course: string): string {
  const held = fallback.get(course);
  if (held !== undefined) return held;
  try {
    return window.localStorage.getItem(keyOf(course)) ?? "[]";
  } catch {
    return "[]";
  }
}

function parse(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function subscribe(course: string) {
  return (onChange: () => void) => {
    window.addEventListener(eventOf(course), onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(eventOf(course), onChange);
      window.removeEventListener("storage", onChange);
    };
  };
}

function useRead(course: string, slug: string): boolean {
  const raw = useSyncExternalStore(
    useMemo(() => subscribe(course), [course]),
    () => readAll(course),
    () => "[]",
  );
  return parse(raw).includes(slug);
}

function toggle(course: string, slug: string) {
  const list = parse(readAll(course));
  const next = JSON.stringify(
    list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug],
  );
  try {
    window.localStorage.setItem(keyOf(course), next);
  } catch {
    // Storage is unavailable. The tick just does not outlive the visit.
    fallback.set(course, next);
  }
  window.dispatchEvent(new Event(eventOf(course)));
}

/** The button at the foot of a lesson. */
export function ReadTick({ course, slug }: { course: string; slug: string }) {
  const read = useRead(course, slug);

  return (
    <button
      type="button"
      aria-pressed={read}
      onClick={() => toggle(course, slug)}
      className={`inline-flex items-center gap-2.5 rounded-control border px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
        read
          ? "border-survey bg-survey text-survey-ink"
          : "border-line text-fg-2 hover:border-survey-2 hover:text-fg"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-[14px] w-[14px] items-center justify-center rounded-control border ${
          read ? "border-survey-ink" : "border-fg-3"
        }`}
      >
        {read && (
          <svg width="9" height="9" viewBox="0 0 9 9">
            <path d="M1.5 4.7l2 2L7.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        )}
      </span>
      {read ? "Marked as read" : "Mark as read"}
    </button>
  );
}

/** A bare tick for tight places such as the chapters sidebar. */
export function ReadCheck({ course, slug }: { course: string; slug: string }) {
  const read = useRead(course, slug);
  if (!read) return null;

  return (
    <span className="shrink-0 text-survey">
      <span className="sr-only">Read</span>
      <svg width="11" height="11" viewBox="0 0 9 9" aria-hidden="true">
        <path d="M1.5 4.7l2 2L7.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

/** A small tick beside a lesson in the index, for lessons already read here. */
export function ReadMark({ course, slug }: { course: string; slug: string }) {
  const read = useRead(course, slug);
  if (!read) return null;

  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-survey">
      <span className="sr-only">Read</span>
      <span aria-hidden="true">Read ✓</span>
    </span>
  );
}
