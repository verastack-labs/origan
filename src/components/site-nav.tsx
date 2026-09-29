"use client";

import { useEffect, useRef, useState } from "react";
import { chainageFromProgress } from "@/lib/chainage";
import { nav, site } from "@/data/site";
import { BenchmarkMark } from "./benchmark-mark";

/**
 * The nav carries a live chainage readout, which is the page expressing scroll
 * position in its own notation rather than with a progress bar. The same
 * listener drives the section underline, so there is one scroll handler and one
 * rAF for both.
 */
export function SiteNav() {
  const [chainage, setChainage] = useState("0+000");
  const [active, setActive] = useState(-1);
  const frame = useRef(0);

  useEffect(() => {
    const sections = nav.map((n) => document.querySelector<HTMLElement>(n.href));

    const measure = () => {
      frame.current = 0;

      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setChainage(chainageFromProgress(max > 0 ? window.scrollY / max : 0));

      let current = -1;
      sections.forEach((section, i) => {
        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.42) {
          current = i;
        }
      });
      setActive(current);
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
      <div className="mx-auto flex h-[62px] max-w-[1240px] items-center justify-between gap-4 px-[clamp(18px,4vw,60px)]">
        <a
          href="#top"
          className="flex items-center gap-2.5 text-[18px] font-bold tracking-[-0.02em]"
        >
          <span className="text-survey">
            <BenchmarkMark size={17} />
          </span>
          {site.name}
        </a>

        <div className="hidden items-center gap-[22px] lg:flex">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative py-1 text-[13.5px] transition-colors ${
                active === i
                  ? "text-survey after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-survey after:content-['']"
                  : "text-fg-2 hover:text-fg"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div
          className="hidden rounded-control border border-line px-2.5 py-1.5 font-mono text-[10px] tracking-[0.09em] tabular-nums text-fg-3 sm:block"
          aria-hidden="true"
        >
          CH <b className="font-medium text-survey">{chainage}</b>
        </div>

        <a
          href="#talk"
          className="rounded-control border border-survey-2 px-4 py-2.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.08em] text-survey transition-colors hover:bg-survey hover:text-survey-ink"
        >
          Request a conversation
        </a>
      </div>
    </nav>
  );
}
