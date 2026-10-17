"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { NarrowingStep } from "@/lib/narrowing-steps";

/**
 * The part of the narrowing stepper that runs in the browser: which step is
 * showing, and the two buttons that change it.
 *
 * - The code is highlighted already. A step lights its lines by toggling a
 *   class on the existing `.line` elements, so nothing is re-rendered.
 * - Next and Back are real buttons. At the ends they stay focusable but do
 *   nothing, and are marked `aria-disabled`, so focus is never dropped. Next
 *   becomes "Start again" at the last step. The arrow keys work too, while
 *   focus is anywhere in the block.
 * - The step, its type and its sentence sit in one polite live region, read as
 *   a whole (`aria-atomic`), so each press is announced once.
 * - Without JavaScript the buttons are hidden and every step is listed in
 *   order instead, so the block still says everything it says with script.
 * - The line highlight fades over 150ms, and not at all under
 *   `prefers-reduced-motion` (see `.narrowing` in globals.css).
 */
const button =
  "rounded-control border border-line px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.09em] text-fg-2 transition-colors hover:border-survey-2 hover:text-fg aria-disabled:cursor-default aria-disabled:opacity-45 aria-disabled:hover:border-line aria-disabled:hover:text-fg-2";

export function NarrowingStepperView({ html, steps }: { html: string; steps: NarrowingStep[] }) {
  const [at, setAt] = useState(0);
  const code = useRef<HTMLDivElement>(null);
  const last = steps.length - 1;
  const step = steps[at];

  useEffect(() => {
    const lit = new Set(steps[at].lines);
    code.current?.querySelectorAll(".line").forEach((line, i) => line.classList.toggle("is-on", lit.has(i)));
  }, [at, steps]);

  const back = () => setAt((i) => Math.max(0, i - 1));
  const next = () => setAt((i) => (i === last ? 0 : i + 1));

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next();
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") back();
    else return;
    event.preventDefault();
  }

  return (
    <section
      aria-label="Step through the narrowing"
      onKeyDown={onKeyDown}
      className="narrowing code-block cmp-code my-6 overflow-hidden rounded-panel border border-line bg-panel"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line-2 px-3 py-2">
        <span className="notation">Narrowing, one branch at a time</span>
        <span className="js-only notation">Step {at + 1} of {steps.length}</span>
      </div>

      <div ref={code} dangerouslySetInnerHTML={{ __html: html }} />

      <div className="js-only border-t border-line-2 bg-ground-2 px-3 py-3">
        <div aria-live="polite" aria-atomic="true" className="min-h-[6.5rem]">
          <p className="notation">
            <span className="sr-only">Step {at + 1} of {steps.length}. </span>
            The type of <span className="text-fg">{step.expr}</span> here
          </p>
          <p className={`mt-1.5 font-mono text-[15px] font-semibold ${step.type === "never" ? "text-warn" : "text-survey"}`}>
            {step.type}
          </p>
          {step.members && <p className="mt-0.5 font-mono text-[12.5px] text-fg-2">that is {step.members}</p>}
          <p className="mt-2 text-[14px] leading-[1.6] text-fg-2">{step.note}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={back} aria-disabled={at === 0} className={button}>
            Back<span className="sr-only"> one step</span>
          </button>
          <button type="button" onClick={next} className={button}>
            {at === last ? "Start again" : "Next"}
            {at !== last && <span className="sr-only"> step</span>}
          </button>
          <span className="ml-auto flex gap-1.5" aria-hidden="true">
            {steps.map((_, i) => (
              <span key={i} className={`h-1.5 w-5 rounded-control ${i === at ? "bg-survey" : i < at ? "bg-survey-2" : "bg-line"}`} />
            ))}
          </span>
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">Arrow keys work too</p>
      </div>

      {/* No script: every step in order, so nothing is lost. */}
      <ol className="no-js-only m-0 list-none border-t border-line-2 bg-ground-2 px-3 py-3">
        {steps.map((s, i) => (
          <li key={i} className="py-1.5 text-[14px] leading-[1.6] text-fg-2">
            <span className="font-mono text-fg-3">{i + 1}. </span>
            <span className="font-mono text-fg">{s.expr}</span>: <span className="font-mono text-survey">{s.type}</span>. {s.note}
          </li>
        ))}
      </ol>
    </section>
  );
}
