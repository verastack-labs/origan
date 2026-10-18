import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { LiveResource } from "@/data/resources";

/**
 * One card on The Open Shelf: the brand and its descriptor, a line, the topic
 * pills, and a link in. Server-rendered markup with no state of its own, so the
 * shelf can filter and search without touching it.
 */
export function ShelfCard({ resource, count, hidden }: { resource: LiveResource; count: number; hidden: boolean }) {
  const [one, many] = resource.unit;

  return (
    <Reveal
      as="li"
      hidden={hidden}
      data-card={resource.id}
      className="overflow-hidden rounded-panel border border-line bg-panel"
    >
      <Link
        href={resource.href}
        className="group flex h-full flex-col p-[clamp(20px,2.6vw,32px)] transition-colors hover:bg-panel-2"
      >
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">
          Free · {count} {count === 1 ? one : many}
        </span>
        <span className="mt-2.5 text-[clamp(22px,2.6vw,30px)] font-bold tracking-[-0.03em] text-fg">
          {resource.name}
          {resource.descriptor && (
            <span className="font-semibold text-fg-2">
              <span aria-hidden="true" className="text-fg-3">
                {" "}
                ·{" "}
              </span>
              <span className="sr-only">, </span>
              {resource.descriptor}
            </span>
          )}
        </span>
        <span className="mt-2.5 max-w-[44ch] text-[15.5px] text-fg-2">{resource.summary}</span>
        <span className="sr-only">Topics: {resource.topics.join(", ")}.</span>
        <span aria-hidden="true" className="mt-5 flex max-w-[72ch] flex-wrap gap-1.5">
          {resource.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full border border-line px-2.5 py-[3px] font-mono text-[11px] tracking-[0.02em] text-fg-2"
            >
              {topic}
            </span>
          ))}
        </span>
        <span className="mt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-survey">
          {resource.cta ?? "Open the lessons"}{" "}
          <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </Link>
    </Reveal>
  );
}
