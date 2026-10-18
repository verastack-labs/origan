"use client";

import type { ShelfFilter } from "@/data/resources";
import { STARRED, countLabel, type FilterCount } from "@/lib/shelf";

/**
 * The filter chips above The Open Shelf: a row of bordered buttons, "All" first.
 * Each other chip has a bold label, a small count, and a one-line mono hint.
 *
 * They are real buttons with `aria-pressed`, so they work from the keyboard and
 * say what is chosen. They are hidden until JavaScript has run (`html.js`),
 * because without it a chip could do nothing and every card is shown anyway.
 *
 * On a phone the row is one line that scrolls sideways inside its own box, so
 * the page itself never scrolls sideways. From `md` it wraps.
 */
export function ShelfChips({
  filters,
  counts,
  active,
  onChange,
  starred = 0,
}: {
  filters: readonly ShelfFilter[];
  counts: Readonly<Record<string, FilterCount>>;
  /** The chosen filter id, or null for All. */
  active: string | null;
  onChange: (filter: string | null) => void;
  /** How many items are starred. The Starred chip is there only when this is above zero. */
  starred?: number;
}) {
  const chip =
    "shrink-0 rounded-control border border-line px-3.5 py-2 text-left transition-colors duration-150 hover:border-survey-2 aria-pressed:border-survey aria-pressed:bg-panel-2";

  return (
    <div
      role="group"
      aria-label="Filter the shelf"
      className="-mx-[clamp(18px,4vw,60px)] hidden gap-2 overflow-x-auto px-[clamp(18px,4vw,60px)] pb-2 [scrollbar-width:thin] [.js_&]:flex md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0"
    >
      <button type="button" aria-pressed={active === null} onClick={() => onChange(null)} className={`${chip} flex flex-col justify-center`}>
        <span className="text-[14px] font-bold text-fg">All</span>
      </button>
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          aria-pressed={active === filter.id}
          onClick={() => onChange(filter.id)}
          className={chip}
        >
          <span className="flex items-baseline gap-2">
            <span className="text-[14px] font-bold text-fg">{filter.label}</span>
            <span className="font-mono text-[10.5px] tabular-nums text-fg-3">{countLabel(counts[filter.id])}</span>
          </span>
          <span className="mt-0.5 block whitespace-nowrap font-mono text-[10.5px] tracking-[0.02em] text-fg-3">
            {filter.hint}
          </span>
        </button>
      ))}
      {starred > 0 && (
        <button type="button" aria-pressed={active === STARRED} onClick={() => onChange(STARRED)} className={chip}>
          <span className="flex items-baseline gap-2">
            <span className="text-[14px] font-bold text-fg">Starred</span>
            <span className="font-mono text-[10.5px] tabular-nums text-fg-3">{starred}</span>
          </span>
          <span className="mt-0.5 block whitespace-nowrap font-mono text-[10.5px] tracking-[0.02em] text-fg-3">
            the ones you pinned
          </span>
        </button>
      )}
    </div>
  );
}
