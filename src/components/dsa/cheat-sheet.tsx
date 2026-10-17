import Link from "next/link";
import type { ReactNode } from "react";
import { coursePath, switchCourse, type Course } from "@/data/courses";
import { compareParts, playgroundHref, type CompareProps } from "@/lib/ts-snippets";
import { CopyButton } from "./copy-button";
import { ErrorNote, highlight, control } from "./ts-code";

/**
 * One row of the cheat sheet: a short JavaScript snippet beside the TypeScript
 * it becomes, with a title, a link back to the lesson that teaches it, and a
 * line or two of note.
 *
 * It uses the same regions and the same checks as `Compare`, so every row on
 * the sheet is type-checked and tested like the lessons are. It is laid out by
 * its own width (a container query), so the two sides sit together when the
 * column is wide enough and stack when it isn't, and the sheet prints well.
 */
export async function CheatRow({
  title,
  lesson,
  course = switchCourse,
  children,
  ...props
}: CompareProps & {
  title: string;
  /** The order number of the lesson that teaches it. */
  lesson: number | string;
  course?: Course;
  children?: ReactNode;
}) {
  const { js, ts, jsChanged, tsChanged, errorLines, failure } = compareParts(props);
  const [jsHtml, tsHtml] = await Promise.all([
    highlight(js, "javascript", { diff: jsChanged }),
    highlight(ts, "typescript", { diff: tsChanged, error: errorLines }),
  ]);
  const entry = course.curriculum.find((e) => e.order === Number(lesson));

  return (
    <article className="cheat-row @container my-4 overflow-hidden rounded-panel border border-line bg-panel">
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line-2 px-3 py-2.5">
        <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-fg">{title}</h3>
        {entry && (
          <Link href={coursePath(course, entry.slug)} className="notation hover:text-fg">
            Lesson {Number(lesson)}
            <span className="sr-only">: {entry.title}</span>
          </Link>
        )}
      </header>

      <div className="grid gap-px bg-line @[760px]:grid-cols-2">
        <figure className="code-block cmp-code cmp-js m-0 min-w-0 bg-panel">
          <figcaption className="flex items-center justify-between gap-2 border-b border-line-2 px-3 py-1.5">
            <span className="notation">JavaScript</span>
          </figcaption>
          <div dangerouslySetInnerHTML={{ __html: jsHtml }} />
        </figure>
        <figure className="code-block cmp-code m-0 min-w-0 bg-panel">
          <figcaption className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 border-b border-line-2 px-3 py-1.5">
            <span className="notation">TypeScript</span>
            <span className="no-print flex flex-wrap items-center gap-2">
              <CopyButton code={ts} hint="the TypeScript" />
              <a href={playgroundHref(ts)} target="_blank" rel="noopener noreferrer" className={control}>
                Playground<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </span>
          </figcaption>
          <div dangerouslySetInnerHTML={{ __html: tsHtml }} />
          {failure && <ErrorNote errorCode={failure.errorCode} message={failure.message} />}
        </figure>
      </div>

      {children && (
        <div className="border-t border-line-2 px-3 py-2.5 text-fg-2 [&>p]:my-0 [&>p]:text-[14.5px] [&>p]:leading-[1.6] [&>p]:text-fg-2">
          {children}
        </div>
      )}
    </article>
  );
}
