import Link from "next/link";
import { coursePath, type Course } from "@/data/courses";
import { site } from "@/data/site";
import type { Lesson } from "@/lib/lessons";

/** The credit every page in this section carries. */
export function StudioCredit({ className = "" }: { className?: string }) {
  return (
    <p className={`font-mono text-[10.5px] uppercase tracking-[0.11em] text-fg-3 ${className}`}>
      Made by{" "}
      <a
        href={site.labsUrl}
        rel="noopener"
        className="text-fg-2 underline decoration-line decoration-1 underline-offset-4 transition-colors hover:text-survey hover:decoration-survey-2"
      >
        {site.studio}
      </a>
    </p>
  );
}

const partLinks = (parts: Course["parts"]) => (
  <ol className="grid gap-1">
    {parts.map((part, i) => (
      <li key={part.id}>
        <a
          href={`#${part.id}`}
          className="flex items-baseline gap-3 rounded-control px-2 py-1.5 text-[14.5px] text-fg-2 transition-colors hover:bg-panel hover:text-fg"
        >
          <span className="font-mono text-[10px] tabular-nums text-fg-3">{String(i + 1).padStart(2, "0")}</span>
          {part.label}
        </a>
      </li>
    ))}
  </ol>
);

/**
 * The seven parts of a lesson as a block that opens and closes above the text
 * on a phone. On a desktop the chapters sidebar lists them beside the text, so
 * this stays out of the way there. Plain links, so it needs no script.
 */
export function ContentsBlock({ parts }: { parts: Course["parts"] }) {
  return (
    <details className="group mb-8 rounded-panel border border-line bg-panel lg:hidden">
      <summary className="flex list-none items-center justify-between gap-3 px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.09em] text-fg [&::-webkit-details-marker]:hidden">
        <span>Contents</span>
        <svg
          width="9"
          height="9"
          viewBox="0 0 9 9"
          aria-hidden="true"
          className="transition-transform duration-200 group-open:rotate-180"
        >
          <path d="M1 2.5l3.5 3.5L8 2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </summary>
      <div className="border-t border-line-2 p-2">{partLinks(parts)}</div>
    </details>
  );
}

/** Previous and next, at the foot. The next lesson may not be written yet. */
export function LessonNav({
  course,
  lesson,
  lessons,
}: {
  course: Course;
  lesson: Lesson;
  lessons: Lesson[];
}) {
  const at = lessons.findIndex((l) => l.slug === lesson.slug);
  const prev = lessons[at - 1];
  const next = lessons[at + 1];
  const upcoming = course.curriculum.find((entry) => entry.order === lesson.order + 1);

  const cell =
    "block h-full bg-panel p-[clamp(16px,2.2vw,24px)] transition-colors";

  return (
    <nav aria-label="Previous and next lesson" className="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
      {prev ? (
        <Link href={coursePath(course, prev.slug)} rel="prev" scroll={false} className={`${cell} hover:bg-panel-2`}>
          <span className="notation">Previous</span>
          <span className="mt-2 block text-[17px] font-semibold tracking-[-0.01em] text-fg">{prev.title}</span>
        </Link>
      ) : (
        <Link href={course.path} className={`${cell} hover:bg-panel-2`}>
          <span className="notation">Start</span>
          <span className="mt-2 block text-[17px] font-semibold tracking-[-0.01em] text-fg">All lessons</span>
        </Link>
      )}
      {next ? (
        <Link href={coursePath(course, next.slug)} rel="next" scroll={false} className={`${cell} hover:bg-panel-2 sm:text-right`}>
          <span className="notation">Next</span>
          <span className="mt-2 block text-[17px] font-semibold tracking-[-0.01em] text-fg">{next.title}</span>
        </Link>
      ) : (
        <div className={`${cell} sm:text-right`}>
          <span className="notation">Coming next</span>
          <span className="mt-2 block text-[17px] font-semibold tracking-[-0.01em] text-fg-2">
            {upcoming ? upcoming.title : "More lessons"}
          </span>
        </div>
      )}
    </nav>
  );
}
