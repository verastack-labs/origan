import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { inlineCode } from "@/components/dsa/inline-code";
import type { Resource } from "@/data/resources";
import { pillsFor } from "@/lib/shelf";
import { StarButton } from "./star-button";

/**
 * One card on The Open Shelf: the brand and its descriptor, a line, the topic
 * pills, and a way in. Server-rendered markup with no state of its own, so the
 * shelf can filter and search without touching it.
 *
 * A live card is a link ("Free · 12 lessons", "Open the lessons"). A coming
 * card is a collection whose build is next: no link, a quieter dashed border
 * and a muted heading, and "Coming soon" where the count would be.
 */
const pill =
  "rounded-full border border-line px-2.5 py-[3px] font-mono text-[11px] tracking-[0.02em] text-fg-2";

function Heading({ resource, muted }: { resource: Resource; muted: boolean }) {
  return (
    <span
      className={`mt-2.5 text-[clamp(22px,2.6vw,30px)] font-bold tracking-[-0.03em] ${muted ? "text-fg-2" : "text-fg"}`}
    >
      {resource.name}
      {resource.descriptor && (
        <span className={`font-semibold ${muted ? "text-fg-3" : "text-fg-2"}`}>
          <span aria-hidden="true" className="text-fg-3">
            {" "}
            ·{" "}
          </span>
          <span className="sr-only">, </span>
          {resource.descriptor}
        </span>
      )}
    </span>
  );
}

function Body({ resource }: { resource: Resource }) {
  const { shown, more } = pillsFor(resource.topics);
  return (
    <>
      <span className="mt-2.5 max-w-[44ch] text-[15.5px] text-fg-2">{inlineCode(resource.summary)}</span>
      <span className="sr-only">Topics: {resource.topics.join(", ")}.</span>
      <span aria-hidden="true" className="mt-5 flex max-w-[72ch] flex-wrap gap-1.5">
        {shown.map((topic) => (
          <span key={topic} className={pill}>
            {topic}
          </span>
        ))}
        {more > 0 && <span className={`${pill} border-dashed text-fg-3`}>+{more} more</span>}
      </span>
    </>
  );
}

export function ShelfCard({
  resource,
  count,
  hidden,
  starred = false,
  onToggleStar,
}: {
  resource: Resource;
  count: number;
  hidden: boolean;
  /** Starred on this device. The star is drawn only when there is a handler for it. */
  starred?: boolean;
  onToggleStar?: () => void;
}) {
  const star = onToggleStar && <StarButton name={resource.name} starred={starred} onToggle={onToggleStar} />;

  if (resource.status === "coming") {
    return (
      <Reveal
        as="li"
        hidden={hidden}
        data-card={resource.id}
        data-status="coming"
        className="relative flex min-w-0 overflow-hidden rounded-panel border border-dashed border-line bg-ground"
      >
        <div className="flex w-full flex-col p-[clamp(20px,2.6vw,32px)]">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">Coming soon</span>
          <Heading resource={resource} muted />
          <Body resource={resource} />
          <span className="mt-auto pt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-3">
            Not open yet
          </span>
        </div>
        {star}
      </Reveal>
    );
  }

  const [one, many] = resource.unit;

  return (
    <Reveal
      as="li"
      hidden={hidden}
      data-card={resource.id}
      data-status="live"
      className="relative flex min-w-0 overflow-hidden rounded-panel border border-line bg-panel"
    >
      <Link
        href={resource.href}
        className="group flex w-full flex-col p-[clamp(20px,2.6vw,32px)] transition-colors hover:bg-panel-2"
      >
        <span className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-3">
          Free · {count} {count === 1 ? one : many}
        </span>
        <Heading resource={resource} muted={false} />
        <Body resource={resource} />
        <span className="mt-auto pt-6 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] text-survey">
          {resource.cta ?? "Open the lessons"}{" "}
          <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </Link>
      {star}
    </Reveal>
  );
}
