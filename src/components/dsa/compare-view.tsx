"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
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

/**
 * The layout follows the width of the Compare block itself, not the window.
 * The lessons sidebar takes room from `lg` up, so a wide window can still
 * leave a narrow column. Three layouts, by container width:
 *   under 600px   tabs, one pane at a time
 *   600 to 760px  stacked, JavaScript above TypeScript
 *   760px and up  side by side
 * The sizes are in the class names below (`@[600px]`, `@[760px]`) and TABS_BELOW
 * must match the first.
 */
const TABS_BELOW = 600;
/** True while the block is narrow enough for tabs. Starts true, as the server renders. */
function useTabs(ref: React.RefObject<HTMLElement | null>): boolean {
  const [tabs, setTabs] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setTabs(el.getBoundingClientRect().width < TABS_BELOW);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return tabs;
}

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
  const root = useRef<HTMLElement>(null);
  const narrow = useTabs(root);
  const wide = !narrow;
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
    <section ref={root} aria-label="JavaScript beside TypeScript" className="compare @container my-6">
      {/* A phone has room for one at a time. The list is hidden from `md` up
          and the roles change with it, so a wide reader meets two labelled
          groups rather than a tablist with nothing to switch. */}
      {!wide && (
      <div
        role="tablist"
        aria-label="Choose a version"
        onKeyDown={onKeyDown}
        className="mb-2 grid grid-cols-2 gap-px overflow-hidden rounded-control border border-line bg-line @[600px]:hidden"
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

      <div className="grid gap-4 @[760px]:grid-cols-2">
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
                shown ? "" : "hidden @[600px]:block"
              } ${w === "ts" ? "@[600px]:border-survey-2/60" : "cmp-js"}`}
            >
              <figcaption className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line-2 px-3 py-2 @[760px]:flex-col @[760px]:items-start @[760px]:justify-start">
                <span className="notation hidden @[600px]:inline">{names[w]}</span>
                <span className="ml-auto flex flex-wrap items-center gap-2 @[760px]:ml-0 @[760px]:min-h-[26px]">
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
