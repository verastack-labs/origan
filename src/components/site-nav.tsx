"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { chainageFromProgress } from "@/lib/chainage";
import { pages, sheetFor, site } from "@/data/site";
import { BenchmarkMark } from "./benchmark-mark";
import { ThemeToggle } from "./theme-toggle";
import { InterestButton } from "./interest";

/**
 * The header carries the pages, centred, because that is the primary
 * axis: a dean or a TPO arriving from a search expects to find the whole site
 * in the bar at the top. Where you are *within* a page is secondary wayfinding
 * and lives in the section index at the foot of the viewport.
 *
 * The chainage readout is the page expressing scroll position in its own
 * notation rather than with a progress bar. `CH 1+250` is a surveyor's way of
 * writing 1km and 250m along a route.
 *
 * Links go through `next/link` rather than bare anchors: the site is served
 * from `/origan`, and only the router knows to prefix that.
 */
export function SiteNav() {
  const [chainage, setChainage] = useState("0+000");
  const frame = useRef(0);
  const pathname = usePathname();
  const here = pathname.endsWith("/") ? pathname : `${pathname}/`;

  useEffect(() => {
    const measure = () => {
      frame.current = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setChainage(chainageFromProgress(max > 0 ? window.scrollY / max : 0));
    };

    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <nav data-sticky-top className="sticky top-0 z-50 border-b border-line-2 bg-ground md:bg-ground/85 md:backdrop-blur-[10px]">
      {/* Three tracks of equal weight, so the centre column is centred against
          the viewport rather than against whatever the sides happen to
          measure. */}
      <div className="mx-auto grid h-[62px] max-w-[1240px] grid-cols-[1fr_auto] items-center gap-4 px-[clamp(18px,4vw,60px)] lg:grid-cols-[1fr_auto_1fr]">
        {/* The readout sits by the wordmark: the right of the bar is the
            theme switch and the call to action, and three controls there do
            not fit beside five page labels. */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[18px] font-bold tracking-[-0.02em]"
          >
            <span className="text-survey">
              <BenchmarkMark size={17} />
            </span>
            {site.name}
          </Link>
          <div
            className="hidden rounded-control border border-line px-2.5 py-1.5 font-mono text-[10px] tracking-[0.09em] tabular-nums whitespace-nowrap text-fg-2 xl:block"
            title="Chainage: distance along a route, written as kilometres plus metres. Here it tracks how far down the page you are."
          >
            <span className="sr-only">Chainage</span>
            <span aria-hidden="true">CH </span>
            <b className="font-medium text-survey">{chainage}</b>
          </div>
        </div>

        {/* The overview is the wordmark's job, so five labels fit rather than six. */}
        <div className="hidden items-center justify-center gap-[clamp(14px,1.45vw,22px)] lg:flex">
          {pages.map((sheet) => {
            const current = sheetFor(here)?.href === sheet.href;

            return (
              <Link
                key={sheet.href}
                href={sheet.href}
                aria-current={current ? "page" : undefined}
                className={`relative py-1 text-[13.5px] font-medium transition-colors ${
                  current
                    ? "text-survey after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-survey after:content-['']"
                    : "text-fg hover:text-survey"
                }`}
              >
                {sheet.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2.5 sm:gap-4">
          <ThemeToggle />

          <InterestButton tone="nav">
            {/* Six pages leave the header less room than five did, so the
                short label holds until there is plenty. */}
            <span className="xl:hidden">Register</span>
            <span className="hidden whitespace-nowrap xl:inline">Register your interest</span>
          </InterestButton>
        </div>
      </div>
    </nav>
  );
}
