"use client";

import { useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import { CopyButton } from "./copy-button";

/**
 * JavaScript beside TypeScript.
 *
 * From `md` up the two sit side by side. Below that there is not room for two
 * columns of code, so they stack into tabs: "JavaScript" and "TypeScript". The
 * tabs follow the WAI-ARIA tabs pattern: a tablist, roving tabindex so Tab
 * enters the list once, and the arrow keys (with Home and End) move between
 * tabs and show the panel at once.
 *
 * The code arrives already highlighted. This file is only the layout and the
 * buttons, which is all that needs to run in the browser.
 */
type Side = { code: string; html: string };

const control =
  "rounded-control border border-line px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.09em] text-fg-2 transition-colors hover:border-survey-2 hover:text-fg";

const WIDE = "(min-width: 768px)";
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
/** True from `md` up, where the two sides are both on show and tabs would be noise. */
const useWide = () =>
  useSyncExternalStore(
    subscribe,
    () => window.matchMedia(WIDE).matches,
    () => false,
  );

const order = ["js", "ts"] as const;
type Which = (typeof order)[number];
const names: Record<Which, string> = { js: "JavaScript", ts: "TypeScript" };

export function CompareView({
  js,
  ts,
  tsFooter,
}: {
  js: Side;
  ts: Side & { playground: string };
  /** What TypeScript said, when the TypeScript side is a program that is meant to fail. */
  tsFooter?: ReactNode;
}) {
  const [active, setActive] = useState<Which>("js");
  const wide = useWide();
  const id = useId();
  const tabs = useRef<Record<Which, HTMLButtonElement | null>>({ js: null, ts: null });

  const tabId = (w: Which) => `${id}-tab-${w}`;
  const panelId = (w: Which) => `${id}-panel-${w}`;

  function move(to: Which) {
    setActive(to);
    tabs.current[to]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const at = order.indexOf(active);
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (at + 1) % order.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (at + order.length - 1) % order.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = order.length - 1;
    if (next === null) return;
    event.preventDefault();
    move(order[next]);
  }

  const sides: Record<Which, { side: Side; footer?: ReactNode; play?: string }> = {
    js: { side: js },
    ts: { side: ts, footer: tsFooter, play: ts.playground },
  };

  return (
    <section aria-label="JavaScript beside TypeScript" className="compare my-6">
      {/* A phone has room for one at a time. The list is hidden from `md` up
          and the roles change with it, so a wide reader meets two labelled
          groups rather than a tablist with nothing to switch. */}
      {!wide && (
      <div
        role="tablist"
        aria-label="Choose a version"
        onKeyDown={onKeyDown}
        className="mb-2 grid grid-cols-2 gap-px overflow-hidden rounded-control border border-line bg-line md:hidden"
      >
        {order.map((w) => {
          const on = active === w;
          return (
            <button
              key={w}
              ref={(el) => {
                tabs.current[w] = el;
              }}
              type="button"
              role="tab"
              id={tabId(w)}
              aria-selected={on}
              aria-controls={panelId(w)}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(w)}
              className={`px-3 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.09em] transition-colors ${
                on ? "bg-panel-2 text-fg" : "bg-panel text-fg-2 hover:text-fg"
              }`}
            >
              {names[w]}
            </button>
          );
        })}
      </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {order.map((w) => {
          const { side, footer, play } = sides[w];
          const shown = wide || active === w;
          return (
            <figure
              key={w}
              role={wide ? "group" : "tabpanel"}
              id={panelId(w)}
              aria-labelledby={wide ? undefined : tabId(w)}
              aria-label={wide ? names[w] : undefined}
              tabIndex={wide ? undefined : 0}
              // Before the script runs, the server cannot know the width, so it
              // renders the JavaScript panel only and the stylesheet shows both
              // from `md` up.
              className={`code-block cmp-code m-0 min-w-0 overflow-hidden rounded-panel border border-line bg-panel ${
                shown ? "" : "hidden md:block"
              } ${w === "ts" ? "md:border-survey-2/60" : "cmp-js"}`}
            >
              <figcaption className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line-2 px-3 py-2 md:flex-col md:items-start md:justify-start">
                <span className="notation hidden md:inline">{names[w]}</span>
                <span className="ml-auto flex flex-wrap items-center gap-2 md:ml-0 md:min-h-[26px]">
                  <CopyButton code={side.code} hint={`the ${names[w]}`} />
                  {play && (
                    <a href={play} target="_blank" rel="noopener noreferrer" className={control}>
                      Open in TypeScript Playground<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </span>
              </figcaption>
              <div dangerouslySetInnerHTML={{ __html: side.html }} />
              {footer}
            </figure>
          );
        })}
      </div>

      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
        Tinted lines are the ones that differ
      </p>
    </section>
  );
}
