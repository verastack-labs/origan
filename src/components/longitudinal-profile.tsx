"use client";

import { useEffect, useRef, useState } from "react";
import { benchmarks, semesters } from "@/data/content";
import { CUMULATIVE, profileGeometry } from "@/lib/profile";

const VIEW = { width: 1200, height: 320 };
const g = profileGeometry(VIEW);

/**
 * The longitudinal section: the drawing a surveyor makes along a route, ground
 * level plotted against distance. Here the distance is eight semesters.
 *
 * It is operable. Each semester is a hit zone, and selecting one moves the
 * marker and swaps the reading below, which is how the section carries eight
 * paragraphs of copy without showing eight paragraphs of copy.
 */
export function LongitudinalProfile() {
  const [selected, setSelected] = useState(0);
  const lineRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const readingRef = useRef<HTMLParagraphElement>(null);

  // Draw the ground line on first sight.
  useEffect(() => {
    const line = lineRef.current;
    const fill = fillRef.current;
    const svg = svgRef.current;
    if (!line || !fill || !svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();

        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
        fill.style.opacity = "0";
        void line.getBoundingClientRect();
        line.style.transition = "stroke-dashoffset 1600ms var(--ease-survey)";
        fill.style.transition = "opacity 900ms 600ms ease-out";
        line.style.strokeDashoffset = "0";
        fill.style.opacity = "1";
      },
      { threshold: 0.3 },
    );

    io.observe(svg);
    return () => io.disconnect();
  }, []);

  // Replay the swap animation whenever the reading changes.
  useEffect(() => {
    const el = readingRef.current;
    if (!el) return;
    el.classList.remove("swap");
    void el.offsetHeight;
    el.classList.add("swap");
  }, [selected]);

  const current = semesters[selected];
  const marker = { x: g.boundaries[selected + 1], y: 0 };
  marker.y =
    g.plot.top + g.plot.height - g.plot.height * CUMULATIVE[selected + 1] * 0.93;

  return (
    <div className="mt-[clamp(26px,3.6vw,46px)] overflow-hidden rounded-panel border border-line bg-panel">
      <div className="flex justify-between gap-3 border-b border-line px-4 py-[11px]">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg-3">
          Preparation plotted against time
        </span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg-3">
          One cohort · Entry to placement
        </span>
      </div>

      <svg
        ref={svgRef}
        className="block h-auto w-full"
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        role="img"
        aria-label="A rising ground profile across eight semesters, with benchmark markers on each year boundary."
      >
        {/* horizontal grid, heaviest at the datum */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = g.plot.top + (g.plot.height * i) / 4;
          return (
            <line
              key={`h${i}`}
              x1={g.plot.left}
              y1={y}
              x2={g.plot.left + g.plot.width}
              y2={y}
              stroke={i === 4 ? "var(--color-survey-2)" : "var(--color-line-2)"}
              strokeWidth={i === 4 ? 1.2 : 0.8}
            />
          );
        })}

        {/* chainage ticks on every semester boundary */}
        {g.boundaries.map((x, i) => (
          <g key={`b${i}`}>
            <line
              x1={x}
              y1={g.plot.top}
              x2={x}
              y2={g.plot.top + g.plot.height}
              stroke="var(--color-panel-2)"
              strokeWidth={0.8}
            />
            <line
              x1={x}
              y1={g.plot.top + g.plot.height}
              x2={x}
              y2={g.plot.top + g.plot.height + 7}
              stroke="var(--color-survey-2)"
              strokeWidth={1}
            />
          </g>
        ))}

        <path ref={fillRef} d={g.groundFill} fill="var(--color-survey)" fillOpacity={0.07} />
        <path
          ref={lineRef}
          d={g.ground}
          fill="none"
          stroke="var(--color-survey)"
          strokeWidth={2.1}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* where a two-week programme would begin */}
        <path
          d={`M${g.training.x1} ${g.training.y}L${g.training.x2} ${g.training.y}`}
          fill="none"
          stroke="var(--color-warn)"
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <text
          x={g.training.x1 - 9}
          y={g.training.y - 11}
          fill="var(--color-warn)"
          fontSize={11}
          fontFamily="var(--font-mono)"
          textAnchor="end"
          letterSpacing="0.8"
        >
          TRAINING BEGINS
        </text>

        {/* benchmarks on year boundaries */}
        {benchmarks.map((b) => {
          const x = g.boundaries[b.semester];
          const y = g.plot.top + g.plot.height - g.plot.height * CUMULATIVE[b.semester] * 0.93;
          const solid = b.semester === 8;
          const colour = solid ? "var(--color-fg)" : "var(--color-survey)";
          return (
            <g key={b.year}>
              <path
                d={`M${x} ${y - 13}l7.5 13h-15z`}
                fill={solid ? colour : "none"}
                stroke={colour}
                strokeWidth={1.5}
              />
              {!solid && <circle cx={x} cy={y - 3.4} r={1.7} fill={colour} />}
              <text
                x={x}
                y={y - 21}
                fill={solid ? "var(--color-fg)" : "var(--color-fg-2)"}
                fontSize={11}
                fontFamily="var(--font-mono)"
                textAnchor="middle"
                letterSpacing="1"
              >
                {b.year}
              </text>
            </g>
          );
        })}

        <text
          x={g.plot.left - 11}
          y={g.plot.top + 8}
          fill="var(--color-fg-3)"
          fontSize={10.5}
          fontFamily="var(--font-mono)"
          textAnchor="end"
        >
          READY
        </text>
        <text
          x={g.plot.left - 11}
          y={g.plot.top + g.plot.height + 4}
          fill="var(--color-fg-3)"
          fontSize={10.5}
          fontFamily="var(--font-mono)"
          textAnchor="end"
        >
          ENTRY
        </text>

        <circle
          cx={marker.x}
          cy={marker.y}
          r={4.5}
          fill="var(--color-survey)"
          style={{ transition: "cx 500ms var(--ease-survey), cy 500ms var(--ease-survey)" }}
        />

        {/* hit zones, one per semester */}
        {semesters.map((s, i) => (
          <g
            key={s.key}
            role="button"
            tabIndex={0}
            aria-label={`Semester ${i + 1}, ${s.title}`}
            aria-pressed={selected === i}
            className="cursor-pointer outline-none"
            onClick={() => setSelected(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(i);
              }
            }}
          >
            <rect
              x={g.boundaries[i]}
              y={g.plot.top}
              width={g.plot.width / 8}
              height={g.plot.height}
              fill={selected === i ? "var(--color-survey)" : "transparent"}
              fillOpacity={selected === i ? 0.07 : 0}
              className="hover:fill-survey hover:fill-opacity-[0.07]"
            />
            <text
              x={g.centres[i]}
              y={g.plot.top + g.plot.height + 24}
              fill={selected === i ? "var(--color-survey)" : "var(--color-fg-3)"}
              fontSize={11}
              fontFamily="var(--font-mono)"
              textAnchor="middle"
              letterSpacing="1"
            >
              {s.key}
            </text>
          </g>
        ))}
      </svg>

      <div
        className="grid min-h-[86px] grid-cols-[78px_1fr] items-start gap-[18px] border-t border-line px-[18px] py-4"
        aria-live="polite"
      >
        <span className="pt-[3px] font-mono text-[10px] tracking-[0.1em] text-survey">
          {current.key}
        </span>
        <p ref={readingRef} className="max-w-[62ch] text-[16px] text-fg-2">
          <b className="font-semibold text-fg">{current.title}.</b> {current.body}
        </p>
      </div>
    </div>
  );
}
