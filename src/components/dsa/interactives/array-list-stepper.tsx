"use client";

import { Stepper } from "../stepper";
import { grownCapacity, growthSteps, START_CAPACITY, type GrowthStep } from "@/lib/steps/array-list";

/**
 * Lesson 3's `TinyList`, growing. Letters are added one at a time. When the
 * array is full, a bigger one is made and every item is copied across, which
 * is shown as the old array fading above the new one. The cells are all the
 * same width, so a bigger array is physically longer.
 */
const steps = growthSteps();
const MAX = steps.reduce((m, s) => Math.max(m, s.capacity), 0);

function Row({ slots, tone, fresh }: { slots: (string | null)[]; tone: "old" | "live"; fresh?: number }) {
  return (
    <ol className="m-0 flex list-none p-0">
      {slots.map((item, i) => (
        <li key={i} style={{ width: `${100 / MAX}%` }} className={i > 0 ? "-ml-px" : ""}>
          <span
            className={`st-move flex h-10 items-center justify-center border font-mono text-[13px] tabular-nums sm:h-11 sm:text-[15px] ${
              item === null
                ? "border-dashed border-line text-fg-3"
                : tone === "old"
                  ? "border-line-2 bg-panel text-fg-3 opacity-45"
                  : i === fresh
                    ? "border-survey bg-survey font-semibold text-survey-ink"
                    : "border-line bg-ground text-fg"
            }`}
          >
            {item ?? ""}
          </span>
          {tone === "live" && <span className="mt-1 block text-center font-mono text-[10px] tabular-nums text-fg-3">{i}</span>}
        </li>
      ))}
    </ol>
  );
}

function Stage({ step }: { step: GrowthStep }) {
  const justAdded = step.kind === "add" ? step.size - 1 : undefined;
  const full = step.kind === "full";
  const copying = step.kind === "copied";

  return (
    <div className="mx-auto max-w-[560px]">
      <dl className="m-0 mb-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-3">
        <div className="flex gap-1.5">
          <dt>size</dt>
          <dd className="m-0 tabular-nums text-fg">{step.size}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt>capacity</dt>
          <dd className="m-0 tabular-nums text-fg">{step.capacity}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt>copied so far</dt>
          <dd className="m-0 tabular-nums text-fg">{step.copied}</dd>
        </div>
      </dl>

      <div className="min-h-[3.25rem]">
        {copying && step.old && (
          <>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">Old array, thrown away</p>
            <Row slots={step.old} tone="old" />
          </>
        )}
      </div>

      <p className="mb-1 mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
        {copying ? "New array" : "The array"} <span className="text-fg-2">({step.capacity} slots)</span>
      </p>
      <Row slots={step.slots} tone="live" fresh={justAdded} />

      <p className="mt-3 min-h-5 font-mono text-[12px] text-fg-2">
        {step.value !== null && (
          <>
            <span className="text-[10px] uppercase tracking-[0.1em] text-fg-3">adding </span>
            <span className="font-semibold text-fg">{step.value}</span>
            {full && <span className="ml-2 text-warn">no empty slot</span>}
          </>
        )}
      </p>
    </div>
  );
}

function Caption({ at }: { at: number }) {
  const step = steps[at];
  const last = at === steps.length - 1;

  switch (step.kind) {
    case "start":
      return (
        <p>
          A <code>TinyList</code> starts with an array of {START_CAPACITY} slots, and none are used yet. Its <code>size</code>{" "}
          is how many slots hold an item, and its <code>capacity</code> is how many slots there are. We will add the
          letters A to H, one at a time.
        </p>
      );
    case "full":
      return (
        <p>
          Add <b>{step.value}</b>. But the array is full: size is {step.size} and capacity is {step.capacity}, so there is
          no empty slot. <code>growIfFull</code> makes a bigger array, {step.capacity} + {step.capacity} / 2 + 1 ={" "}
          {grownCapacity(step.capacity)} slots, and copies everything across.
        </p>
      );
    case "copied":
      return (
        <p>
          The new array has {step.capacity} slots. All {step.size} items were copied into it, and the old array is thrown
          away. That copy is the cost of growing. In total, {step.copied} {step.copied === 1 ? "item has" : "items have"}{" "}
          been copied so far.
        </p>
      );
    case "add": {
      const before = steps[at - 1];
      const after = before.kind === "copied";
      return (
        <p>
          {after ? "Now " : "Add "}
          <b>{step.value}</b>
          {after ? " fits. It goes" : " goes"} in the next empty slot, slot {step.size - 1}. Size is {step.size}, capacity is{" "}
          {step.capacity}.{after ? "" : " Nothing is copied."}
          {last && (
            <>
              {" "}
              Eight adds, two growths, and {step.copied} items copied in all. Growing by a fraction each time makes the
              copies rare, so adding stays cheap on average.
            </>
          )}
        </p>
      );
    }
  }
}

export function ArrayListGrowthStepper() {
  return (
    <Stepper
      label="Step through an ArrayList growing"
      title="An array that grows, one add at a time"
      count={steps.length}
      stage={(i) => <Stage step={steps[i]} />}
      caption={(i) => <Caption at={i} />}
    />
  );
}
