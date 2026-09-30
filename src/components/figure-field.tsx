"use client";

import { useEffect, useRef } from "react";
import {
  bearingArc,
  datum,
  rangeArcs,
  sightLines,
  STATIONS,
  stationDelays,
  traversePath,
} from "@/lib/figure";

const DRAW_MS = 2000;

/**
 * The first viewport's drawing: a triangulation figure, set out once and then
 * left alone.
 *
 * It is deliberately quiet. Two earlier versions filled the frame with ruled
 * linework, and both read as texture behind the headline rather than as
 * something drawn. What replaced them is about a dozen marks: four stations,
 * the legs between them, two sights closing the figure, three range arcs and
 * one measured datum. Everything else on the sheet is empty, which is what
 * makes the marks look placed rather than generated.
 *
 * The motion is the same restraint. The figure sets itself out on load, in the
 * order a survey party would actually work, and then holds. Only the arcs keep
 * moving, on periods slow enough to read as light rather than as animation.
 */
export function FigureField() {
  const route = useRef<SVGPathElement>(null);
  const plane = useRef<SVGGElement>(null);

  // Draw the traverse once, on load. Stations and sights follow on CSS delays,
  // so none of the sequencing needs state or a second render.
  useEffect(() => {
    const line = route.current;
    if (!line) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const length = line.getTotalLength();
    line.style.strokeDasharray = `${length}`;
    line.style.strokeDashoffset = `${length}`;
    void line.getBoundingClientRect();
    line.style.transition = `stroke-dashoffset ${DRAW_MS}ms var(--ease-survey)`;
    line.style.strokeDashoffset = "0";
  }, []);

  // One plane of parallax, not three. With this few marks, depth cueing has
  // nothing to cue: the whole figure is on one sheet and should move as one.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const g = plane.current;
    if (!g) return;

    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let frame = 0;

    const onPointer = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    };

    const tick = () => {
      eased.x += (target.x - eased.x) * 0.04;
      eased.y += (target.y - eased.y) * 0.04;
      g.setAttribute(
        "transform",
        `translate(${(-eased.x * 22).toFixed(2)},${(-eased.y * 16).toFixed(2)})`,
      );
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const delays = stationDelays();
  const arcs = rangeArcs();
  const sights = sightLines();
  const { line: datumLine, ticks } = datum();

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g ref={plane}>
        {/* Range arcs. Struck about the destination, opening back down the
            route, so the composition has a centre without becoming a target. */}
        {arcs.map((arc, i) => (
          <path
            key={`a${i}`}
            className="range"
            style={{
              animationDuration: `${11 + i * 4}s`,
              animationDelay: `${i * -3.5}s`,
            }}
            d={arc.d}
            fill="none"
            stroke="var(--color-survey-2)"
            strokeWidth={1}
          />
        ))}

        {/* The datum: the one line on the sheet that is simply a measure. */}
        <g className="set-out" style={{ animationDelay: `${DRAW_MS + 260}ms` }} opacity={0.75}>
          <path d={datumLine} stroke="var(--color-line)" strokeWidth={1} fill="none" />
          {ticks.map((tick, i) => (
            <path key={`t${i}`} d={tick} stroke="var(--color-line)" strokeWidth={1} fill="none" />
          ))}
        </g>

        {/* The sights that close the figure. Dashed, because an observation
            back to a fixed point is a check rather than a route. */}
        {sights.map((d, i) => (
          <path
            key={`s${i}`}
            className="set-out"
            style={{ animationDelay: `${DRAW_MS + 120 + i * 180}ms` }}
            d={d}
            fill="none"
            stroke="var(--color-survey-2)"
            strokeWidth={1}
            strokeDasharray="5 7"
            opacity={0.8}
          />
        ))}

        {/* The traverse. Straight legs between fixed stations. */}
        <path
          ref={route}
          d={traversePath()}
          fill="none"
          stroke="var(--color-survey)"
          strokeWidth={1.8}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Bearings observed at the two intermediate stations: the mark that
            says the angle was measured rather than assumed. */}
        {[1, 2].map((i) => (
          <path
            key={`b${i}`}
            className="set-out"
            style={{ animationDelay: `${DRAW_MS + 360 + i * 140}ms` }}
            d={bearingArc(i)}
            fill="none"
            stroke="var(--color-survey)"
            strokeWidth={1.2}
            opacity={0.75}
          />
        ))}

        {STATIONS.map((s, i) => (
          <g
            key={s.year}
            className="station"
            style={{
              animationDelay: `${Math.round(delays[i] * DRAW_MS * 0.92)}ms`,
              transformOrigin: `${s.x}px ${s.y}px`,
            }}
          >
            {s.terminal ? (
              <path d={`M${s.x} ${s.y - 14}l8 14h-16z`} fill="var(--color-fg)" />
            ) : (
              <>
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={5}
                  fill="var(--color-ground)"
                  stroke="var(--color-survey)"
                  strokeWidth={1.5}
                />
                <circle cx={s.x} cy={s.y} r={1.5} fill="var(--color-survey)" />
              </>
            )}
            <text
              x={s.x + 15}
              y={s.y + (s.terminal ? -20 : 4)}
              fill={s.terminal ? "var(--color-fg)" : "var(--color-survey)"}
              fontSize={12}
              fontFamily="var(--font-mono)"
              letterSpacing="1.6"
            >
              {s.year}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
