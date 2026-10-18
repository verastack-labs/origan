"use client";

import { useMemo, useState } from "react";
import { Choice, Stepper } from "../stepper";
import { climbed, HEAP, parentOf, PUSHES, pushSteps, type HeapStep } from "@/lib/steps/heap";

/**
 * Lesson 8's heap push, one comparison at a time. The reader picks a value to
 * push, and the new value floats up the tree from the end of the row, swapping
 * with a bigger parent, until it is no smaller than its parent or reaches the
 * top. The tree and the row are the same heap drawn two ways, as in the
 * lesson's picture, and a value glides between slots as it moves.
 */
const AT: [number, number][] = [
  [170, 26],
  [90, 82],
  [250, 82],
  [50, 138],
  [130, 138],
  [210, 138],
  [290, 138],
  [30, 194],
];
const SLOTS = AT.length;

function Stage({ step }: { step: HeapStep }) {
  const { row } = step;
  const hot = step.kind === "start" ? null : step.i;
  const parent = step.kind === "compare" ? step.parent : null;
  const swap = step.kind === "compare" && step.swap;

  return (
    <div className="mx-auto max-w-[420px]">
      <svg viewBox="0 0 340 222" className="block h-auto w-full" aria-hidden="true">
        {row.map((_, i) => {
          if (i === 0) return null;
          const p = parentOf(i);
          const used = step.kind === "compare" && i === step.i && p === step.parent;
          return (
            <line
              key={i}
              x1={AT[p][0]}
              y1={AT[p][1]}
              x2={AT[i][0]}
              y2={AT[i][1]}
              className={`st-move ${used ? (swap ? "stroke-survey" : "stroke-survey-2") : "stroke-line"}`}
              strokeWidth={used ? 2.5 : 1.5}
            />
          );
        })}

        {/* Each value is its own node, so it can glide when it changes slot. */}
        {row.map((value, i) => {
          const isHot = i === hot;
          const isParent = i === parent;
          return (
            <g key={value} className="st-move" style={{ transform: `translate(${AT[i][0]}px, ${AT[i][1]}px)` }}>
              <circle
                r={18}
                className={`st-move ${isHot ? "fill-survey stroke-survey" : isParent ? "fill-panel-2 stroke-survey" : "fill-ground stroke-line"}`}
                strokeWidth={isHot || isParent ? 2 : 1.25}
              />
              <text
                y={5}
                textAnchor="middle"
                fontSize={15}
                fontWeight={isHot ? 700 : 400}
                className={`st-move font-mono ${isHot ? "fill-survey-ink" : "fill-fg"}`}
              >
                {value}
              </text>
            </g>
          );
        })}
      </svg>

      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">The same heap, as a row</p>
      <ol className="m-0 mt-1.5 grid list-none grid-cols-8 p-0">
        {Array.from({ length: SLOTS }, (_, i) => {
          const value = row[i];
          const isHot = i === hot;
          const isParent = i === parent;
          return (
            <li key={i} className={i > 0 ? "-ml-px" : ""}>
              <span
                className={`st-move flex h-10 items-center justify-center border font-mono text-[13px] tabular-nums sm:text-[15px] ${
                  value === undefined
                    ? "border-dashed border-line-2 text-fg-3"
                    : isHot
                      ? "border-survey bg-survey font-semibold text-survey-ink"
                      : isParent
                        ? "border-survey bg-panel-2 text-fg"
                        : "border-line bg-ground text-fg"
                }`}
              >
                {value ?? ""}
              </span>
              <span className="mt-1 block text-center font-mono text-[10px] tabular-nums text-fg-3">{i}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Caption({ step, value, steps }: { step: HeapStep; value: number; steps: HeapStep[] }) {
  switch (step.kind) {
    case "start":
      return (
        <p>
          A min-heap of seven numbers. Every parent is no bigger than its children, so the smallest, <b>{step.row[0]}</b>, is
          on top. We are going to push <b>{value}</b>.
        </p>
      );
    case "add":
      return (
        <p>
          Put <b>{value}</b> in the next free slot, slot {step.i}, at the end of the row. The heap rule might now be broken,
          so we check it against its parent, which is slot (({step.i} - 1) / 2) = {parentOf(step.i)}.
        </p>
      );
    case "compare": {
      const p = step.row[step.parent];
      return step.swap ? (
        <p>
          Is <b>{value}</b> smaller than its parent <b>{p}</b>? Yes, so they swap. {value} floats up to slot {step.parent}, and{" "}
          {p} drops down to slot {step.i}.
        </p>
      ) : (
        <p>
          Is <b>{value}</b> smaller than its parent <b>{p}</b>? No. A value that is no smaller than its parent can stay, so{" "}
          {value} stops in slot {step.i}. The rule holds again.
          {climbed(steps) > 0
            ? ` It floated up ${climbed(steps)} ${climbed(steps) === 1 ? "level" : "levels"}.`
            : " It did not need to move at all."}
        </p>
      );
    }
    case "top":
      return (
        <p>
          <b>{value}</b> is in slot 0, so it has no parent left to beat. It floated up {climbed(steps)}{" "}
          {climbed(steps) === 1 ? "level" : "levels"} to the top, and the rule holds again.
        </p>
      );
  }
}

export function HeapStepper() {
  const [value, setValue] = useState<number>(PUSHES[0]);
  const steps = useMemo(() => pushSteps(HEAP, value), [value]);

  return (
    <Stepper
      key={value}
      label="Step through pushing a value onto a heap"
      title="Push onto a min-heap, one swap at a time"
      count={steps.length}
      controls={<Choice label="Push" options={PUSHES} value={value} onChange={setValue} />}
      stage={(i) => <Stage step={steps[i]} />}
      caption={(i) => <Caption step={steps[i]} value={value} steps={steps} />}
    />
  );
}
