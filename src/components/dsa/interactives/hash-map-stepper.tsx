"use client";

import { Stepper } from "../stepper";
import { BUCKETS, putSteps, type PutStep } from "@/lib/steps/hash-map";

/**
 * Lesson 6's `TinyHashMap`, taking keys. Each put works out the key's hash
 * code, finds the bucket with `floorMod`, and puts the entry at the front of
 * that bucket's chain. One key collides with another, and one is put twice, so
 * both are seen.
 */
const steps = putSteps();

function Stage({ step }: { step: PutStep }) {
  return (
    <div className="mx-auto max-w-[560px]">
      <p className="min-h-[2.75rem] font-mono text-[12px] leading-[1.55] text-fg-2 sm:min-h-[1.5rem]">
        {step.key === null || step.hash === null || step.bucket === null ? (
          <span className="text-fg-3">{BUCKETS} empty buckets, numbered 0 to {BUCKETS - 1}</span>
        ) : (
          <>
            <span className="text-fg">&quot;{step.key}&quot;</span>.hashCode() is <span className="text-fg">{step.hash}</span>, and{" "}
            {step.hash} mod {BUCKETS} is <span className="font-semibold text-survey">{step.bucket}</span>
          </>
        )}
      </p>

      <ol className="m-0 mt-2 grid list-none gap-1.5 p-0">
        {step.table.map((chain, b) => {
          const hot = b === step.bucket;
          return (
            <li
              key={b}
              className={`st-move flex min-h-[2.75rem] items-center gap-2 border px-2 py-1 ${
                hot ? "border-survey bg-panel-2" : "border-line-2 bg-ground"
              }`}
            >
              <span className={`w-4 shrink-0 text-center font-mono text-[12px] tabular-nums ${hot ? "font-semibold text-survey" : "text-fg-3"}`}>
                {b}
              </span>
              {chain.length === 0 ? (
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">empty</span>
              ) : (
                <ul className="m-0 flex min-w-0 list-none flex-wrap items-center gap-x-1.5 gap-y-1 p-0">
                  {chain.map((entry, i) => {
                    const fresh = hot && entry.key === step.key;
                    return (
                      <li key={entry.key} className="flex items-center gap-1.5">
                        {i > 0 && (
                          <span aria-hidden="true" className="font-mono text-[12px] text-fg-3">
                            →
                          </span>
                        )}
                        <span
                          className={`st-move block border px-2 py-0.5 leading-tight ${
                            fresh ? "border-survey bg-survey text-survey-ink" : "border-line bg-panel text-fg"
                          }`}
                        >
                          <span className="block font-mono text-[13px] font-semibold">{entry.key}</span>
                          <span className={`block font-mono text-[10px] ${fresh ? "text-survey-ink" : "text-fg-3"}`}>{entry.value}</span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-fg-3">
        size <span className="tabular-nums text-fg">{step.size}</span>
      </p>
    </div>
  );
}

function Caption({ at }: { at: number }) {
  const step = steps[at];
  if (step.kind === "start" || step.key === null || step.bucket === null) {
    return (
      <p>
        A <code>TinyHashMap</code> starts with {BUCKETS} empty buckets. To put a key, it works out which bucket the key
        belongs to, with the key&apos;s <code>hashCode</code> and <code>Math.floorMod</code>, which is the remainder after
        dividing by {BUCKETS}, never negative. Then it puts the entry there.
      </p>
    );
  }

  const others = step.table[step.bucket].filter((e) => e.key !== step.key);

  if (step.outcome === "collision") {
    return (
      <p>
        <code>put</code>(<b>{step.key}</b>): bucket {step.bucket}, but <b>{others[0].key}</b> is already there. That is a{" "}
        <b>collision</b>: two different keys, one bucket. The new entry goes in front of the chain, so {step.key} comes first
        and {others[0].key} follows. To find either one later, the map walks the chain and checks each key with{" "}
        <code>equals</code>.
      </p>
    );
  }

  if (step.outcome === "replace") {
    return (
      <p>
        <code>put</code>(<b>{step.key}</b>) again: bucket {step.bucket}. <b>{step.key}</b> is already in the chain, so it is
        the same key. The value is replaced with {step.value}, and the size stays at {step.size}.
      </p>
    );
  }

  return (
    <p>
      <code>put</code>(<b>{step.key}</b>): the hash code {step.hash} gives bucket {step.bucket}. That bucket was empty, so{" "}
      {step.key} sits alone in it.
    </p>
  );
}

export function HashMapStepper() {
  return (
    <Stepper
      label="Step through putting keys into a hash map"
      title="Keys into buckets, one put at a time"
      count={steps.length}
      stage={(i) => <Stage step={steps[i]} />}
      caption={(i) => <Caption at={i} />}
    />
  );
}
