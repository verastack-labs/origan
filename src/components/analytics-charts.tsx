"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { analyticsPage } from "@/data/analytics";
import { GlyphChain } from "./survey-glyphs";

/**
 * Datum's views, drawn in the site's own notation.
 *
 * Axis text and marks are HTML positioned over the plot rather than text inside
 * an SVG. A viewBox scaled down to a phone shrinks its type with it, and an
 * eleven-point label at desktop becomes five points at 343px. Positioned HTML
 * keeps every label at its real size at every width, and the only thing the
 * SVG draws is the line itself.
 *
 * Entrances are gated on `data-in`, set once the chart is seen, and the
 * stylesheet only hides anything under `html.js`. Without JavaScript, or with
 * reduced motion, every chart is simply drawn.
 */
function useSeen<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.in = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.in = "true";
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

/** The ruled frame every view sits in, labelled as illustrative on its face. */
export function ChartFrame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="mt-[clamp(24px,3.4vw,44px)] overflow-hidden rounded-panel border border-line bg-panel">
      <figcaption className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-line px-4 py-[11px]">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-fg-2">
          {caption}
        </span>
        <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-warn">
          {analyticsPage.disclaimer}
        </span>
      </figcaption>
      {children}
    </figure>
  );
}

const tone = {
  survey: { line: "var(--color-survey)", dot: "border-survey", text: "text-survey" },
  "fg-3": { line: "var(--color-fg-3)", dot: "border-fg-3", text: "text-fg-2" },
} as const;

/* ------------------------------------------------------------ trajectory */

export function TrajectoryChart() {
  const ref = useSeen<HTMLDivElement>();
  const { series, marker, unit } = analyticsPage.trajectory;
  const count = series[0].values.length;
  const x = (i: number) => (i / (count - 1)) * 100;
  const y = (v: number) => 100 - v;
  const grid = [25, 50, 75, 100];

  return (
    <ChartFrame caption={analyticsPage.trajectory.caption}>
      <div className="px-[clamp(16px,2.6vw,28px)] pb-6 pt-5">
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {series.map((s) => (
            <li key={s.key} className="flex items-center gap-2.5 text-[13.5px] text-fg-2">
              <span
                aria-hidden="true"
                className="h-0.5 w-5"
                style={{ background: tone[s.tone].line }}
              />
              {s.label}
            </li>
          ))}
        </ul>

        <div ref={ref} className="relative mt-6 h-[clamp(210px,30vw,300px)] pl-9 sm:pr-11">
          {/* Value gridlines and their readings. */}
          {grid.map((g) => (
            <div key={g} className="absolute inset-x-0 left-9 border-t border-line-2" style={{ top: `${y(g)}%` }}>
              <span className="absolute -left-9 -top-[7px] w-7 text-right font-mono text-[10px] tabular-nums text-fg-3">
                {g}
              </span>
            </div>
          ))}
          <div className="absolute bottom-0 left-9 right-0 border-t border-line" />

          <div className="relative h-full">
            {/* Where a fortnight's programme would start. */}
            <div
              className="absolute inset-y-0 border-l border-dashed border-warn/70"
              style={{ left: `${x(marker.semester - 1)}%` }}
            >
              <span className="absolute right-2 top-0 w-[16ch] text-right font-mono text-[9.5px] uppercase leading-[1.4] tracking-[0.08em] text-warn">
                {marker.label}
              </span>
            </div>

            <div className="pen-in absolute inset-0">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full overflow-visible"
                aria-hidden="true"
              >
                {series.map((s) => (
                  <polyline
                    key={s.key}
                    fill="none"
                    stroke={tone[s.tone].line}
                    strokeWidth={s.tone === "survey" ? 2 : 1.5}
                    strokeDasharray={s.tone === "survey" ? undefined : "5 4"}
                    vectorEffect="non-scaling-stroke"
                    points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}
                  />
                ))}
              </svg>

              {/* Station marks, one per semester per series. */}
              {series.map((s) =>
                s.values.map((v, i) => (
                  <span
                    key={`${s.key}-${i}`}
                    aria-hidden="true"
                    className={`absolute h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] bg-panel ${tone[s.tone].dot}`}
                    style={{ left: `${x(i)}%`, top: `${y(v)}%` }}
                  />
                )),
              )}

              {/* The last reading of each line, printed where it ends. */}
              {series.map((s) => {
                const last = s.values[count - 1];
                return (
                  <span
                    key={`${s.key}-end`}
                    aria-hidden="true"
                    className={`absolute right-0 translate-x-[calc(100%+8px)] -translate-y-1/2 font-mono text-[11px] font-semibold tabular-nums ${tone[s.tone].text} hidden sm:block`}
                    style={{ top: `${y(last)}%` }}
                  >
                    {last}
                    {unit}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Semester readings sit under their own station, at the same
            percentage, rather than in equal columns that drift off them. */}
        <div className="pl-9 sm:pr-11">
          <div className="relative mt-2.5 h-4">
            {series[0].values.map((_, i) => (
              <span
                key={i}
                className="absolute -translate-x-1/2 font-mono text-[10px] tabular-nums text-fg-3"
                style={{ left: `${x(i)}%` }}
              >
                S{i + 1}
              </span>
            ))}
          </div>
        </div>

        <table className="sr-only">
          <caption>{analyticsPage.trajectory.caption}, illustrative data</caption>
          <thead>
            <tr>
              <th scope="col">Semester</th>
              {series.map((s) => (
                <th key={s.key} scope="col">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {series[0].values.map((_, i) => (
              <tr key={i}>
                <th scope="row">Semester {i + 1}</th>
                {series.map((s) => (
                  <td key={s.key}>
                    {s.values[i]}
                    {unit}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartFrame>
  );
}

/* -------------------------------------------------------------- branches */

export function BranchBars() {
  const ref = useSeen<HTMLDivElement>();
  const { rows, caption } = analyticsPage.branches;

  return (
    <ChartFrame caption={caption}>
      <div ref={ref} className="px-[clamp(16px,2.6vw,28px)] py-5">
        <dl className="grid gap-y-3.5">
          {rows.map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 sm:grid-cols-[170px_minmax(0,1fr)_44px]"
            >
              <dt className="text-[14.5px] text-fg-2">{row.label}</dt>
              <dd className="order-last col-span-2 sm:order-none sm:col-span-1">
                <div className="h-2 overflow-hidden rounded-control bg-line-2">
                  <div
                    className="bar-fill h-full rounded-control bg-survey"
                    style={{ width: `${row.value}%`, transitionDelay: `${i * 70}ms` }}
                  />
                </div>
              </dd>
              <dd className="text-right font-mono text-[12px] font-semibold tabular-nums text-survey">
                {row.value}%
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </ChartFrame>
  );
}

/* ---------------------------------------------------------------- topics */

/**
 * Below half, a cell takes the warm hue: that is where the next term's work
 * goes. Above it, the survey tint deepens with the value. The tint is capped
 * at 40 per cent so the number printed on it keeps AA contrast, and the number
 * is always printed, so colour never carries the reading on its own.
 */
function cellStyle(v: number) {
  if (v < 50) {
    return { background: "color-mix(in srgb, var(--color-warn) 22%, var(--color-panel))" };
  }
  const k = Math.round(8 + ((v - 50) / 30) * 32);
  return {
    background: `color-mix(in srgb, var(--color-survey) ${Math.min(40, k)}%, var(--color-panel))`,
  };
}

export function TopicGrid() {
  const { years, rows, caption, notYet } = analyticsPage.topics;

  return (
    <ChartFrame caption={caption}>
      <div className="overflow-x-auto px-[clamp(12px,2.6vw,28px)] py-5">
        <table className="w-full min-w-[320px] border-separate border-spacing-[3px] text-left">
          <thead>
            <tr>
              <th scope="col" className="sr-only">
                Topic
              </th>
              {years.map((year) => (
                <th
                  key={year}
                  scope="col"
                  className="pb-1.5 text-center font-mono text-[9.5px] font-normal uppercase tracking-[0.08em] text-fg-3"
                >
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <th scope="row" className="pr-3 text-[13.5px] font-normal text-fg-2 sm:text-[14.5px]">
                  {row.label}
                </th>
                {row.values.map((v, i) => (
                  <td
                    key={i}
                    className="h-10 rounded-control text-center font-mono text-[12px] tabular-nums text-fg"
                    style={v === null ? undefined : cellStyle(v)}
                  >
                    {v === null ? (
                      <span className="text-fg-3" title={notYet}>
                        <span aria-hidden="true">·</span>
                        <span className="sr-only">{notYet}</span>
                      </span>
                    ) : (
                      `${v}%`
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.08em] text-fg-3">
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-3 rounded-[2px]" style={cellStyle(40)} />
            Below half: next term&apos;s focus
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-3 rounded-[2px]" style={cellStyle(78)} />
            Secure
          </span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true">·</span>
            {notYet}
          </span>
        </p>
      </div>
    </ChartFrame>
  );
}

/* ---------------------------------------------------------------- report */

/**
 * A corner of a report rather than the whole of one, fading off the foot of
 * the frame. Nothing exists to screenshot, and a partial view promises less.
 */
export function ReportSheet() {
  const r = analyticsPage.report;

  return (
    <ChartFrame caption={r.title}>
      <div className="[mask-image:linear-gradient(to_bottom,black_68%,transparent)]">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line-2 px-[clamp(16px,2.6vw,28px)] py-4">
          <span className="text-[18px] font-bold tracking-[-0.02em]">Your college</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.09em] text-fg-3">
            {r.period}
          </span>
        </div>

        <dl className="grid grid-cols-1 border-b border-line-2 sm:grid-cols-3">
          {r.readings.map((reading) => (
            <div
              key={reading.label}
              className="border-b border-line-2 px-[clamp(16px,2.6vw,28px)] py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
            >
              <dd className="font-mono text-[clamp(20px,2.6vw,26px)] font-semibold tabular-nums tracking-[-0.02em] text-survey">
                {reading.value}
              </dd>
              <dt className="mt-1 text-[13px] text-fg-3">{reading.label}</dt>
            </div>
          ))}
        </dl>

        <div className="grid gap-px bg-line-2 md:grid-cols-2">
          {[r.observed, r.next].map((block) => (
            <div key={block.label} className="bg-panel px-[clamp(16px,2.6vw,28px)] py-5">
              <h4 className="font-mono text-[10px] uppercase tracking-[0.11em] text-survey">
                {block.label}
              </h4>
              <ul className="mt-3.5 grid gap-3">
                {block.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[14.5px] text-fg-2">
                    <span className="mt-[3px] shrink-0 text-survey-2">
                      <GlyphChain size={14} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </ChartFrame>
  );
}
