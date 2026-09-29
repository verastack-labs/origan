"use client";

import { useEffect, useRef, useState } from "react";
import { views } from "@/data/surface";
import { surfaceGlyphs } from "./survey-glyphs";

const tones = {
  ok: "text-survey border-survey-2",
  warn: "text-warn border-[color-mix(in_srgb,var(--color-warn)_45%,transparent)]",
  mute: "text-fg-3 border-line",
} as const;

/**
 * An illustrative view of the student surface, with working navigation.
 *
 * The brief asks for a glimpse rather than a screenshot, and there is no
 * deployment to screenshot anyway. Six panes with real navigation show more of
 * the product than a static crop would, while the labelling keeps it honest.
 */
export function SurfaceStudy() {
  const [active, setActive] = useState(0);
  const paneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pane = paneRef.current;
    if (!pane) return;

    pane.classList.remove("swap");
    void pane.offsetHeight;
    pane.classList.add("swap");

    const id = requestAnimationFrame(() => {
      pane.querySelectorAll<HTMLElement>("[data-bar]").forEach((bar) => {
        bar.style.width = `${bar.dataset.bar}%`;
      });
    });
    return () => cancelAnimationFrame(id);
  }, [active]);

  const view = views[active];

  return (
    <div className="mt-[clamp(24px,3.4vw,44px)] overflow-hidden rounded-panel border border-line bg-panel">
      <div className="flex justify-between gap-3 border-b border-line px-4 py-[11px]">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg-3">
          Interface study
        </span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg-3">
          Illustrative, not a live deployment
        </span>
      </div>

      <div className="grid min-h-[330px] grid-cols-1 md:grid-cols-[198px_1fr]">
        <nav className="flex flex-wrap border-b border-line bg-ground-2 py-3 md:block md:border-b-0 md:border-r">
          {views.map((v, i) => {
            const Glyph = surfaceGlyphs[v.id as keyof typeof surfaceGlyphs];
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setActive(i)}
                aria-current={active === i}
                className={`flex w-auto items-center gap-2.5 px-[18px] py-2.5 text-left text-[14.5px] transition-colors md:w-full ${
                  active === i
                    ? "bg-panel-2 font-semibold text-fg shadow-[inset_2px_0_0_var(--color-survey)]"
                    : "text-fg-2 hover:bg-panel hover:text-fg"
                }`}
              >
                <span className={active === i ? "text-survey" : undefined}>
                  <Glyph size={14} />
                </span>
                {v.nav}
              </button>
            );
          })}
        </nav>

        <div ref={paneRef} className="px-[clamp(18px,2.6vw,28px)] py-[22px]">
          <h4 className="text-[20px] font-bold tracking-[-0.02em]">{view.heading}</h4>
          <span className="mt-1.5 block font-mono text-[9.5px] uppercase tracking-[0.09em] text-fg-3">
            {view.sub}
          </span>

          <div className="mt-[18px] grid gap-2">
            {view.rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-control border border-line-2 px-3.5 py-3 text-[15px] text-fg-2"
              >
                <span>{row.label}</span>
                {row.kind === "bar" ? (
                  <span className="block h-[5px] w-[104px] overflow-hidden rounded-[1px] bg-line-2">
                    <i
                      data-bar={row.percent}
                      className="block h-full w-0 bg-survey transition-[width] duration-[900ms] ease-survey"
                    />
                  </span>
                ) : (
                  <span
                    className={`rounded-full border px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.07em] ${tones[row.tone]}`}
                  >
                    {row.text}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
