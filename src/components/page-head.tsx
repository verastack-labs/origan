import type { ReactNode } from "react";
import Link from "next/link";
import { Reveal } from "./reveal";
import { InterestButton } from "./interest";
import { HeadingPair, type Pair } from "./heading-pair";

/**
 * Shared measurements. Every page is ruled to the same width and the same
 * vertical rhythm, which is most of why three separate routes read as one
 * drawing set rather than as three pages.
 */
export const shell = "mx-auto max-w-[1240px] px-[clamp(18px,4vw,60px)]";
export const section = "py-[clamp(60px,8.5vw,120px)]";
/** The learning pages read in longer sessions, so they sit a little tighter than the marketing sheets. */
export const sectionCompact = "py-[clamp(40px,5.5vw,80px)]";

/**
 * The opening of a subpage. Deliberately not the home page's hero: the contour
 * field and the traverse belong to the first viewport of the site, and
 * repeating them on every route would spend the one image the site has.
 * A subpage opens with a ruled statement instead.
 */
/** A step up the site, for pages that sit inside another (a lesson inside a course). */
export type Crumb = { label: string; href: string };

export function PageHead({
  notation,
  pair,
  cta = true,
  crumbs,
  current,
  compact = false,
  meta,
}: {
  notation: string;
  pair: Pair;
  /**
   * The pages above this one, outermost first. The last is the parent: the
   * back link goes there, one step at a time, rather than to the top.
   */
  crumbs?: readonly Crumb[];
  /** This page's name at the end of the trail. */
  current?: string;
  /** Less air above and below, for the learning pages. */
  compact?: boolean;
  /** A line of small facts under the heading, such as an article's read time. */
  meta?: ReactNode;
  /** The "Register your interest" button. The learning pages leave it off: their reader is a student. */
  cta?: boolean;
}) {
  return (
    <header
      className={`border-b border-line bg-ground-2 ${
        compact
          ? "pb-[clamp(34px,4.5vw,60px)] pt-[clamp(36px,5vw,72px)]"
          : "pb-[clamp(50px,7vw,90px)] pt-[clamp(54px,8vw,110px)]"
      }`}
    >
      <div className={shell}>
        {crumbs && crumbs.length > 0 && <Trail crumbs={crumbs} current={current ?? notation} />}
        <Reveal variant="label" className="notation">
          {notation}
        </Reveal>
        <HeadingPair pair={pair} as="h1" size="page" className="mt-4" />
        {meta && <div className="mt-6">{meta}</div>}
        {cta && (
          <Reveal className="mt-[26px]">
            <InterestButton />
          </Reveal>
        )}
      </div>
    </header>
  );
}

function Trail({ crumbs, current }: { crumbs: readonly Crumb[]; current: string }) {
  const parent = crumbs[crumbs.length - 1];
  return (
    <nav aria-label="Breadcrumb" className="mb-[clamp(22px,3vw,34px)] flex flex-wrap items-center gap-x-4 gap-y-2.5">
      <Link
        href={parent.href}
        className="inline-flex items-center gap-2 rounded-control border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-fg-2 transition-colors hover:border-survey-2 hover:text-fg"
      >
        <span aria-hidden="true">←</span>
        <span>
          <span className="sr-only">Back to </span>
          {parent.label}
        </span>
      </Link>
      <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tracking-[0.04em] text-fg-3">
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <Link href={crumb.href} className="transition-colors hover:text-fg">
              {crumb.label}
            </Link>
            <span aria-hidden="true">/</span>
          </li>
        ))}
        <li aria-current="page" className="text-fg-2">
          {current}
        </li>
      </ol>
    </nav>
  );
}
