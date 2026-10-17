"use client";

import { useSyncExternalStore } from "react";

/**
 * "Read" ticks, kept in this browser only. Nothing is sent anywhere and there
 * is no account. Storage can be unavailable (a private window, blocked site
 * data), so every access is guarded and the page works without it: the tick
 * simply does not stick.
 */
const KEY = "origan:rust-dsa:read";
const EVENT = "origan-rust-dsa-read";

// Only set when storage refuses a write, so the tick still toggles for the
// visit rather than sitting dead.
let fallback: string | null = null;

function readAll(): string {
  if (fallback !== null) return fallback;
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
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

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function useRead(slug: string): boolean {
  const raw = useSyncExternalStore(subscribe, readAll, () => "[]");
  return parse(raw).includes(slug);
}

function toggle(slug: string) {
  const list = parse(readAll());
  const next = JSON.stringify(
    list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug],
  );
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    // Storage is unavailable. The tick just does not outlive the visit.
    fallback = next;
  }
  window.dispatchEvent(new Event(EVENT));
}

/** The button at the foot of a lesson. */
export function ReadTick({ slug }: { slug: string }) {
  const read = useRead(slug);

  return (
    <button
      type="button"
      aria-pressed={read}
      onClick={() => toggle(slug)}
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

/** A small tick beside a lesson in the index, for lessons already read here. */
export function ReadMark({ slug }: { slug: string }) {
  const read = useRead(slug);
  if (!read) return null;

  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-survey">
      <span className="sr-only">Read</span>
      <span aria-hidden="true">Read ✓</span>
    </span>
  );
}
