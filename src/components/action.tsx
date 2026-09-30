import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex items-center gap-2.5 rounded-control px-[22px] py-[13px] font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-[background-color,border-color,color,transform] duration-200 ease-survey";

const tones = {
  primary: "bg-survey text-survey-ink hover:bg-survey/85 hover:-translate-y-px",
  secondary: "border border-line text-fg-2 hover:border-survey-2 hover:text-fg",
} as const;

export function Action({
  href,
  tone = "primary",
  children,
}: {
  href: string;
  tone?: keyof typeof tones;
  children: ReactNode;
}) {
  const className = `${base} ${tones[tone]}`;

  // A route needs the router to prefix `basePath`; the site is served from
  // `/origan`, so a bare anchor would send the reader to the domain root.
  // An in-page anchor must stay a plain anchor so smooth scrolling still works.
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
