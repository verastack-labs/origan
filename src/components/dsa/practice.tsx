import type { ReactNode } from "react";
import { rustCourse, type Course } from "@/data/courses";
import { Hints } from "./hints";
import { inlineCode } from "./inline-code";
import { Snippet } from "./snippet";

/**
 * One practice problem: the statement, the starting code, hints that open one
 * at a time, and a solution behind a toggle.
 *
 * `start` and `solution` are regions in the tested crate; `also` names shared
 * regions (a node type, say) that both need to run in the Playground. The starter bodies
 * are `todo!()` and are only checked to compile; the solutions have tests.
 */
export function Practice({
  number,
  title,
  file,
  also,
  start,
  solution,
  hints,
  explain,
  course = rustCourse,
  children,
}: {
  number: number;
  title: string;
  file: string;
  /** Regions the problem builds on, such as a node type. They go to the Playground, not the page. */
  also?: string;
  start: string;
  solution: string;
  hints: readonly string[];
  explain: string;
  course?: Course;
  children: ReactNode;
}) {
  return (
    <article className="my-8 overflow-hidden rounded-panel border border-line bg-panel">
      <header className="border-b border-line-2 px-[clamp(16px,2.4vw,24px)] py-4">
        <p className="notation">Problem {number}</p>
        <h3 className="mt-1.5 text-[clamp(18px,2vw,21px)] font-semibold tracking-[-0.02em]">{title}</h3>
      </header>

      <div className="px-[clamp(16px,2.4vw,24px)] py-5">
        <div>{children}</div>

        <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.13em] text-fg-3">Start here</p>
        <Snippet file={file} name={start} also={also} course={course} />

        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.13em] text-fg-3">Stuck?</p>
        <Hints hints={hints} />

        <details className="group mt-6 rounded-control border border-line-2">
          <summary className="flex list-none items-center justify-between gap-3 px-3.5 py-3 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-fg-2 transition-colors hover:text-fg [&::-webkit-details-marker]:hidden">
            <span>Show a solution</span>
            <span aria-hidden="true" className="text-survey transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="border-t border-line-2 px-3.5 pb-1 pt-2">
            <Snippet file={file} name={solution} also={also} course={course} />
            <p className="mb-4 text-[15.5px] text-fg-2">{inlineCode(explain)}</p>
          </div>
        </details>
      </div>
    </article>
  );
}
