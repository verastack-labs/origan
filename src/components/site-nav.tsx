"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { chainageFromProgress } from "@/lib/chainage";
import { sheets, site } from "@/data/site";
import { BenchmarkMark } from "./benchmark-mark";

/**
 * The header carries the three pages, centred, because that is the primary
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
    <nav className="sticky top-0 z-50 border-b border-line-2 bg-ground/85 backdrop-blur-[10px]">
      {/* Three tracks of equal weight, so the centre column is centred against
          the viewport rather than against whatever the sides happen to
          measure. */}
      <div className="mx-auto grid h-[62px] max-w-[1240px] grid-cols-[1fr_auto] items-center gap-4 px-[clamp(18px,4vw,60px)] md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[18px] font-bold tracking-[-0.02em]"
        >
          <span className="text-survey">
            <BenchmarkMark size={17} />
          </span>
          {site.name}
        </Link>

        <div className="hidden items-center justify-center gap-[26px] md:flex">
          {sheets.map((sheet) => {
            const current = here === sheet.href;

            return (
              <Link
                key={sheet.href}
                href={sheet.href}
                aria-current={current ? "page" : undefined}
                className={`relative py-1 text-[13.5px] transition-colors ${
                  current
                    ? "text-survey after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-survey after:content-['']"
                    : "text-fg-2 hover:text-fg"
                }`}
              >
                {sheet.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-4">
          <div
            className="hidden rounded-control border border-line px-2.5 py-1.5 font-mono text-[10px] tracking-[0.09em] tabular-nums text-fg-3 lg:block"
            title="Chainage: distance along a route, written as kilometres plus metres. Here it tracks how far down the page you are."
          >
            <span className="sr-only">Chainage</span>
            <span aria-hidden="true">CH </span>
            <b className="font-medium text-survey">{chainage}</b>
          </div>

          <a
            href="#talk"
            className="rounded-control border border-survey-2 px-4 py-2.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-survey transition-colors hover:bg-survey hover:text-survey-ink"
          >
            <span className="sm:hidden">Talk</span>
            <span className="hidden sm:inline">Request a conversation</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
