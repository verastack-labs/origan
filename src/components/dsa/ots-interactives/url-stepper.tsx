"use client";

import { Stepper } from "../stepper";
import { GROUPS, STAGES } from "@/lib/demos/url-journey";

/**
 * The trip of a web address, one stage at a time. The same stages as the
 * diagram above it, with the two busiest stations split in two (connecting is
 * TCP then TLS, and rendering is parsing then drawing). One stage is lit per
 * step, and the ones already done stay marked. On a phone the strip stands
 * upright, one stage to a row.
 */
function Stage({ at }: { at: number }) {
  return (
    <div className="mx-auto max-w-[640px]">
      <ol className="m-0 grid list-none gap-1.5 p-0 sm:grid-cols-7 sm:gap-1">
        {STAGES.map((s, i) => {
          const now = i === at;
          const done = i < at;
          return (
            <li
              key={s.id}
              className={`st-move flex items-center gap-3 border px-3 py-2 sm:block sm:px-1.5 sm:py-2.5 sm:text-center ${
                now
                  ? "border-survey bg-panel-2"
                  : done
                    ? "border-survey-2 bg-ground"
                    : "border-line-2 bg-ground"
              }`}
            >
              <span className={`font-mono text-[10px] tabular-nums sm:block ${now ? "text-survey" : "text-fg-3"}`}>{i + 1}</span>
              <span className="min-w-0 flex-1 sm:block">
                <span className={`block font-mono text-[12.5px] font-semibold ${now ? "text-fg" : done ? "text-fg-2" : "text-fg-3"}`}>
                  {s.name}
                </span>
                <span className={`block font-mono text-[10.5px] leading-tight sm:mt-0.5 ${now ? "text-survey" : "text-fg-3"}`}>{s.sub}</span>
              </span>
              <span
                aria-hidden="true"
                className={`st-move h-2 w-2 shrink-0 rounded-full sm:mx-auto sm:mt-2 ${now ? "bg-survey" : done ? "bg-survey-2" : "bg-line"}`}
              />
            </li>
          );
        })}
      </ol>

      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.1em] text-fg-3">
        {Object.entries(GROUPS).map(([id, name]) => (
          <span key={id} className={`st-move ${STAGES[at].group === id ? "text-survey" : ""}`}>
            {name}
          </span>
        ))}
      </p>
    </div>
  );
}

export function UrlStepper() {
  return (
    <Stepper
      label="Step through what happens when you type a URL"
      title="From the address bar to the page, one stage at a time"
      count={STAGES.length}
      stage={(i) => <Stage at={i} />}
      caption={(i) => (
        <p>
          <b>{STAGES[i].name}.</b> {STAGES[i].caption}
        </p>
      )}
    />
  );
}
