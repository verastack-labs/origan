"use client";

import { Stepper } from "../stepper";
import { adjacency, bfsSteps, ROADS, VERTICES, type BfsStep } from "@/lib/steps/bfs";

/**
 * Lesson 17's breadth-first search, one vertex at a time, on the town from the
 * ripples diagram. The queue is shown as a strip, and the graph shows who is
 * unseen, who is waiting, who is being visited and who is done, so the search
 * can be watched spreading ring by ring.
 */
const adj = adjacency(VERTICES, ROADS);
const steps = bfsSteps(adj, 0);

const CX = 170;
const CY = 132;
const R1 = 60;
const R2 = 104;
const polar = (r: number, degrees: number): [number, number] => [
  Math.round(CX + r * Math.cos((degrees * Math.PI) / 180)),
  Math.round(CY + r * Math.sin((degrees * Math.PI) / 180)),
];

// The same layout as the ripples diagram: ring 1 is one step from the start, ring 2 is two.
const AT: [number, number][] = [
  [CX, CY],
  polar(R1, 210),
  polar(R1, 330),
  polar(R1, 90),
  polar(R2, 190),
  polar(R2, 305),
  polar(R2, 350),
  polar(R2, 90),
];

type Mood = "unseen" | "waiting" | "current" | "done";

function moodOf(v: number, step: BfsStep): Mood {
  if (v === step.current) return "current";
  if (step.taken.includes(v)) return "done";
  if (step.queue.includes(v)) return "waiting";
  return "unseen";
}

const nodeClass: Record<Mood, string> = {
  unseen: "fill-ground stroke-line",
  waiting: "fill-panel-2 stroke-survey-2",
  current: "fill-survey stroke-survey",
  done: "fill-panel-2 stroke-survey",
};

const textClass: Record<Mood, string> = {
  unseen: "fill-fg-3",
  waiting: "fill-fg",
  current: "fill-survey-ink",
  done: "fill-fg",
};

function Stage({ step }: { step: BfsStep }) {
  const mood = (v: number) => moodOf(v, step);

  return (
    <div className="mx-auto max-w-[420px]">
      <svg viewBox="0 0 340 262" className="block h-auto w-full" aria-hidden="true">
        <circle cx={CX} cy={CY} r={R1} fill="none" className="stroke-fg-3" strokeWidth={1} strokeDasharray="4 4" opacity={0.6} />
        <circle cx={CX} cy={CY} r={R2} fill="none" className="stroke-fg-3" strokeWidth={1} strokeDasharray="4 4" opacity={0.6} />
        <text x={CX + 5} y={CY - R1 - 4} fontSize={9} className="font-mono fill-fg-3">
          1 STEP
        </text>
        <text x={CX + 5} y={CY - R2 - 4} fontSize={9} className="font-mono fill-fg-3">
          2 STEPS
        </text>

        {ROADS.map(([a, b]) => {
          // The road just used to find someone new is drawn heavier.
          const used =
            step.current !== null &&
            ((a === step.current && step.fresh.includes(b)) || (b === step.current && step.fresh.includes(a)));
          const both = step.taken.includes(a) && step.taken.includes(b);
          return (
            <line
              key={`${a}-${b}`}
              x1={AT[a][0]}
              y1={AT[a][1]}
              x2={AT[b][0]}
              y2={AT[b][1]}
              className={`st-move ${used ? "stroke-survey" : both ? "stroke-survey-2" : "stroke-line"}`}
              strokeWidth={used ? 2.5 : 1.5}
            />
          );
        })}

        {AT.map(([x, y], v) => {
          const m = mood(v);
          return (
            <g key={v}>
              <circle
                cx={x}
                cy={y}
                r={17}
                className={`st-move ${nodeClass[m]}`}
                strokeWidth={m === "current" || m === "done" ? 2 : 1.25}
                strokeDasharray={m === "waiting" ? "3 3" : undefined}
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fontSize={15}
                fontWeight={m === "current" ? 700 : 400}
                className={`st-move font-mono ${textClass[m]}`}
              >
                {v}
              </text>
            </g>
          );
        })}
      </svg>

      <dl className="mt-3 grid gap-2 font-mono text-[12px]">
        <div className="flex min-h-9 items-center gap-2">
          <dt className="w-[5.5rem] shrink-0 text-[10px] uppercase tracking-[0.1em] text-fg-3">Queue</dt>
          <dd className="m-0 flex min-w-0 flex-wrap gap-1">
            {step.queue.length === 0 ? (
              <span className="text-fg-3">empty</span>
            ) : (
              step.queue.map((v, i) => (
                <span
                  key={v}
                  className={`flex h-8 w-8 items-center justify-center border text-[13px] tabular-nums ${
                    i === 0 ? "border-survey bg-panel-2 text-fg" : "border-line text-fg-2"
                  }`}
                >
                  {v}
                </span>
              ))
            )}
            {step.queue.length > 0 && <span className="self-center pl-1 text-[10px] uppercase tracking-[0.08em] text-fg-3">front is on the left</span>}
          </dd>
        </div>
        <div className="flex min-h-9 items-center gap-2">
          <dt className="w-[5.5rem] shrink-0 text-[10px] uppercase tracking-[0.1em] text-fg-3">Visited</dt>
          <dd className="m-0 flex min-w-0 flex-wrap gap-1">
            {step.taken.length === 0 ? (
              <span className="text-fg-3">none yet</span>
            ) : (
              step.taken.map((v) => (
                <span key={v} className="flex h-8 w-8 items-center justify-center border border-survey-2 text-[13px] tabular-nums text-fg">
                  {v}
                </span>
              ))
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}

const list = (vs: readonly number[]) =>
  vs.length === 0
    ? ""
    : vs.length === 1
      ? String(vs[0])
      : `${vs.slice(0, -1).join(", ")} and ${vs[vs.length - 1]}`;

function Caption({ at }: { at: number }) {
  const step = steps[at];
  if (step.current === null) {
    return (
      <p>
        Start at vertex <b>0</b>. Mark it as seen, and put it in the queue. The queue is the to-do list, and we always take
        from the front.
      </p>
    );
  }

  const v = step.current;
  const known = adj[v].filter((w) => !step.fresh.includes(w));
  const ring = step.distance[v];
  const done = step.queue.length === 0;

  return (
    <p>
      Take <b>{v}</b> from the front and visit it. It is {ring === 0 ? "the start" : `${ring} ${ring === 1 ? "step" : "steps"} from vertex 0`}.{" "}
      {adj[v].length === 0 ? "It has no neighbours." : <>Its neighbours are {list(adj[v])}. </>}
      {step.fresh.length > 0 ? (
        <>
          {known.length > 0 && <>{list(known)} {known.length === 1 ? "is" : "are"} already seen, so we skip {known.length === 1 ? "it" : "them"}. </>}
          {list(step.fresh)} {step.fresh.length === 1 ? "is" : "are"} new, so {step.fresh.length === 1 ? "it joins" : "they join"} the back of the queue and {step.fresh.length === 1 ? "is" : "are"} marked seen now.
        </>
      ) : (
        adj[v].length > 0 && <>All of them are already seen, so nothing joins the queue.</>
      )}
      {done && <> The queue is empty, so the search is done. Every ring was finished before the next began.</>}
    </p>
  );
}

export function BfsStepper() {
  return (
    <Stepper
      label="Step through a breadth-first search"
      title="Breadth-first search, one vertex at a time"
      count={steps.length}
      stage={(i) => <Stage step={steps[i]} />}
      caption={(i) => <Caption at={i} />}
    />
  );
}
