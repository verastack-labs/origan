"use client";

import { useEffect, useRef } from "react";
import { consultant } from "@/data/content";

/**
 * Figures count up once, on first sight. They are small numbers, so this is a
 * beat rather than a spectacle, and the final value is in the markup from the
 * start in case the animation never runs.
 */
export function ConsultantStats() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = ref.current;
    if (!box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        box.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const end = Number(el.dataset.count);
          const prefix = el.dataset.prefix ?? "";
          const suffix = el.dataset.suffix ?? "";
          let start: number | null = null;

          const step = (now: number) => {
            start ??= now;
            const k = Math.min(1, (now - start) / 700);
            el.textContent = `${prefix}${Math.round(end * (1 - Math.pow(1 - k, 3)))}${suffix}`;
            if (k < 1) requestAnimationFrame(step);
          };

          requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 },
    );

    io.observe(box);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mt-[clamp(24px,3.4vw,44px)] grid grid-cols-2 rounded-panel border border-line bg-panel md:grid-cols-4"
    >
      {consultant.stats.map((stat) => (
        <div
          key={stat.label}
          className="border-b border-line-2 p-[22px] last:border-r-0 md:border-b-0 md:border-r [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r"
        >
          <div
            className="font-mono text-[clamp(22px,3.2vw,34px)] font-semibold tabular-nums tracking-[-0.02em] text-survey"
            data-count={stat.countTo}
            data-prefix={"prefix" in stat ? stat.prefix : ""}
            data-suffix={"suffix" in stat ? stat.suffix : ""}
          >
            {stat.value}
          </div>
          <div className="mt-[7px] text-[13.5px] leading-[1.35] text-fg-3">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
