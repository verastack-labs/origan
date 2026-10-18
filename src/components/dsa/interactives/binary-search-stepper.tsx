"use client";

import { useMemo, useState } from "react";
import { Choice, Stepper } from "../stepper";
import { ROW, searchSteps, TARGETS, type SearchStep } from "@/lib/steps/binary-search";

/**
 * Lesson 14's binary search, one look at a time. The reader picks what to hunt
 * for, and Next and Back walk the lesson's own loop over the same eleven
 * numbers as the diagram above it.
 *
 * Every cell is a plain box. The part still in play is the bracket under the
 * row, from `lo` to `hi`, and it slides as the search narrows. A cell ruled out
 * fades, as in the diagram. The middle being looked at is outlined, and turns
 * solid when it is the one.
 */
const n = ROW.length;
const pct = (i: number) => `${(i / n) * 100}%`;

function Stage({ step, target }: { step: SearchStep; target: number }) {
  const mid = step.kind === "look" ? step.mid : null;
  const found = step.kind === "look" && step.result === "found";
  const met = step.lo === step.hi;

  return (
    <div className="mx-auto max-w-[560px]">
      {/* The middle being looked at. */}
      <div className="relative h-5">
        {mid !== null && (
          <span
            className="st-move absolute top-0 flex flex-col items-center font-mono text-[10px] uppercase leading-none tracking-[0.08em] text-survey"
            style={{ left: pct(mid), width: `${100 / n}%` }}
          >
            mid
            <svg width="9" height="6" viewBox="0 0 9 6" aria-hidden="true" className="mt-0.5">
              <path d="M0 0h9L4.5 6z" className="fill-survey" />
            </svg>
          </span>
        )}
      </div>

      <ol className="m-0 grid list-none grid-cols-11 p-0">
        {ROW.map((value, i) => {
          const inPlay = i >= step.lo && i < step.hi;
          const isMid = i === mid;
          const hit = isMid && found;
          return (
            <li
              key={value}
              className={`st-move flex h-10 items-center justify-center border font-mono text-[13px] tabular-nums sm:h-11 sm:text-[15px] ${
                hit
                  ? "z-10 border-survey bg-survey font-semibold text-survey-ink"
                  : isMid
                    ? "z-10 border-survey bg-panel-2 text-fg"
                    : inPlay
                      ? "border-line bg-ground text-fg"
                      : "border-line-2 bg-panel text-fg-3 opacity-45"
              } ${i > 0 ? "-ml-px" : ""}`}
            >
              {value}
            </li>
          );
        })}
      </ol>

      <ol aria-hidden="true" className="m-0 mt-1 grid list-none grid-cols-11 p-0 font-mono text-[10px] tabular-nums text-fg-3">
        {ROW.map((_, i) => (
          <li key={i} className="text-center">
            {i}
          </li>
        ))}
      </ol>

      {/* The part still in play, from lo to hi. */}
      <div className="relative mt-2 h-9">
        <span
          className="st-move absolute top-1 h-2 border-x border-b border-survey"
          style={{ left: pct(step.lo), width: `calc(${pct(step.hi - step.lo)} + 1px)` }}
        />
        <span
          className="st-move absolute top-4 -translate-x-1/2 font-mono text-[11px] font-semibold leading-none text-survey"
          style={{ left: pct(step.lo) }}
        >
          {met ? "lo = hi" : "lo"}
        </span>
        {!met && (
          <span
            className="st-move absolute top-4 -translate-x-1/2 font-mono text-[11px] font-semibold leading-none text-survey"
            style={{ left: pct(step.hi) }}
          >
            hi
          </span>
        )}
      </div>

      <p className="mt-1 text-center font-mono text-[11px] uppercase tracking-[0.1em] text-fg-3">
        Looking for <span className="text-fg">{target}</span>
      </p>
    </div>
  );
}

function Caption({ step, target, number }: { step: SearchStep; target: number; number: number }) {
  if (step.kind === "start") {
    return (
      <p>
        We are hunting for <b>{target}</b> in eleven sorted numbers. The part still in play is all of them: <code>lo</code>{" "}
        is {step.lo}, and <code>hi</code> is {step.hi}, one past the end.
      </p>
    );
  }

  if (step.kind === "gone") {
    const before = step.lo > 0 ? ROW[step.lo - 1] : null;
    const after = step.lo < n ? ROW[step.lo] : null;
    const gap =
      before !== null && after !== null
        ? `between ${before} and ${after}`
        : before === null
          ? "at the very front"
          : "at the very end";
    return (
      <p>
        <code>lo</code> and <code>hi</code> have met at {step.lo}, so nothing is left in play. <b>{target}</b> is not in
        the row. <code>lo</code> points at the gap where it would go, {gap}.
      </p>
    );
  }

  const sum = (
    <>
      <code>mid</code> is {step.lo} + ({step.hi} - {step.lo}) / 2, which is {step.mid}. The number in slot {step.mid} is{" "}
      <b>{step.value}</b>.{" "}
    </>
  );
  if (step.result === "found") {
    return (
      <p>
        {sum}That is <b>{target}</b>. Found it, in slot {step.mid}, after {number} {number === 1 ? "look" : "looks"}.
      </p>
    );
  }
  if (step.result === "too-small") {
    return (
      <p>
        {sum}That is smaller than {target}, so {target} cannot be in slot {step.mid} or anywhere before it. <code>lo</code>{" "}
        will move to mid + 1, which is {step.mid + 1}.
      </p>
    );
  }
  return (
    <p>
      {sum}That is bigger than {target}, so {target} cannot be in slot {step.mid} or anywhere after it. <code>hi</code>{" "}
      will move to mid, which is {step.mid}.
    </p>
  );
}

export function BinarySearchStepper() {
  const [target, setTarget] = useState<number>(TARGETS[0]);
  const steps = useMemo(() => searchSteps(ROW, target), [target]);

  return (
    <Stepper
      // A new target starts the walk again from the first step.
      key={target}
      label="Step through a binary search"
      title="Binary search, one look at a time"
      count={steps.length}
      controls={
        <Choice label="Hunt for" options={TARGETS} value={target} onChange={setTarget} />
      }
      stage={(i) => <Stage step={steps[i]} target={target} />}
      caption={(i) => <Caption step={steps[i]} target={target} number={steps.slice(0, i + 1).filter((s) => s.kind === "look").length} />}
      staticStep={steps.length - 1}
    />
  );
}
