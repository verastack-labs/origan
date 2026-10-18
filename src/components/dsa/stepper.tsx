"use client";

import { useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * A block that steps through states, one press at a time. It is the general
 * form of The Switch's narrowing stepper, and every stepper in the lessons is
 * built on it so they behave the same way.
 *
 * - Next and Back are real buttons. At the ends they stay focusable but do
 *   nothing, and are marked `aria-disabled`, so focus is never dropped. Next
 *   becomes "Start again" at the last step. The arrow keys work too, while
 *   focus is anywhere in the block.
 * - The step number and its caption sit in one polite live region, read as a
 *   whole (`aria-atomic`), so each press is announced once. The picture is
 *   hidden from assistive technology; the caption says what it shows.
 * - Without JavaScript the controls are hidden. The block shows the finished
 *   state of the picture, then every step in order as a list, so it says
 *   everything it says with script.
 * - Motion is a short ease on the parts that move (see `.st-move` in
 *   globals.css) and none under `prefers-reduced-motion`.
 *
 * The parent owns what changes the steps (a chosen target, say) and gives the
 * stepper a new `key` when it does, which starts it again at step one.
 */
const button =
  "rounded-control border border-line px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.09em] text-fg-2 transition-colors hover:border-survey-2 hover:text-fg aria-disabled:cursor-default aria-disabled:opacity-45 aria-disabled:hover:border-line aria-disabled:hover:text-fg-2";

/** The look of a caption's inline code and bold, shared by every block that has one. */
export const captionStyle =
  "[&_b]:font-semibold [&_b]:text-fg [&_code]:rounded-control [&_code]:bg-panel-2 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-fg";

export type StepperProps = {
  /** The accessible name of the whole block. */
  label: string;
  /** The small heading on the block's top rule. */
  title: string;
  /** How many steps there are. */
  count: number;
  /** The picture for a step (zero-based). */
  stage: (step: number) => ReactNode;
  /** One or two plain sentences saying what has happened at this step. */
  caption: (step: number) => ReactNode;
  /** Controls above the picture, such as a choice of target. */
  controls?: ReactNode;
  /** Which step the picture shows when there is no script. The last one by default. */
  staticStep?: number;
  /** Extra classes for the picture's frame. */
  stageClass?: string;
};

export function Stepper({ label, title, count, stage, caption, controls, staticStep, stageClass = "" }: StepperProps) {
  const [at, setAt] = useState(0);
  const last = count - 1;

  const back = () => setAt((i) => Math.max(0, i - 1));
  const next = () => setAt((i) => (i >= last ? 0 : i + 1));

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next();
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") back();
    else return;
    event.preventDefault();
  }

  return (
    <section
      aria-label={label}
      onKeyDown={onKeyDown}
      className="stepper my-6 overflow-hidden rounded-panel border border-line bg-panel"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line-2 px-3 py-2">
        <span className="notation">{title}</span>
        <span className="js-only notation">
          Step {at + 1} of {count}
        </span>
      </div>

      {controls && <div className="js-only border-b border-line-2 px-3 py-3">{controls}</div>}

      <div className={`js-only overflow-hidden px-3 py-4 ${stageClass}`} aria-hidden="true">
        {stage(at)}
      </div>
      <div className={`no-js-only overflow-hidden px-3 py-4 ${stageClass}`}>{stage(staticStep ?? last)}</div>

      <div className="js-only border-t border-line-2 bg-ground-2 px-3 py-3">
        <div aria-live="polite" aria-atomic="true" className="min-h-[7.5rem] sm:min-h-[5.5rem]">
          <p className="sr-only">
            Step {at + 1} of {count}.
          </p>
          <div className={`text-[14.5px] leading-[1.6] text-fg-2 ${captionStyle}`}>
            {caption(at)}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={back} aria-disabled={at === 0} className={button}>
            Back<span className="sr-only"> one step</span>
          </button>
          <button type="button" onClick={next} className={button}>
            {at === last ? "Start again" : "Next"}
            {at !== last && <span className="sr-only"> step</span>}
          </button>
          <span className={`ml-auto flex ${count > 10 ? "gap-1" : "gap-1.5"}`} aria-hidden="true">
            {Array.from({ length: count }, (_, i) => (
              <span
                key={i}
                className={`st-move h-1.5 rounded-control ${count > 10 ? "w-2.5 sm:w-3.5" : "w-4 sm:w-5"} ${i === at ? "bg-survey" : i < at ? "bg-survey-2" : "bg-line"}`}
              />
            ))}
          </span>
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">Arrow keys work too</p>
      </div>

      {/* No script: every step in order, so nothing is lost. */}
      <ol className="no-js-only m-0 list-none border-t border-line-2 bg-ground-2 px-3 py-3">
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className="py-1.5 text-[14px] leading-[1.6] text-fg-2 [&_b]:font-semibold [&_b]:text-fg">
            <span className="font-mono text-fg-3">{i + 1}. </span>
            {caption(i)}
          </li>
        ))}
      </ol>
    </section>
  );
}

/** A choice between a few values, as buttons that stay pressed. Used above a stepper's picture. */
export function Choice<T extends string | number>({
  label,
  options,
  value,
  onChange,
  format = String,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  format?: (value: T) => string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span aria-hidden="true" className="notation mr-1">
        {label}
      </span>
      {options.map((option) => (
        <button
          key={String(option)}
          type="button"
          aria-pressed={option === value}
          onClick={() => onChange(option)}
          className={`min-w-10 rounded-control border px-3 py-2 font-mono text-[12px] font-semibold tabular-nums transition-colors ${
            option === value
              ? "border-survey bg-survey text-survey-ink"
              : "border-line text-fg-2 hover:border-survey-2 hover:text-fg"
          }`}
        >
          {format(option)}
        </button>
      ))}
    </div>
  );
}
