"use client";

import { useEffect, useRef } from "react";
import type { ContourLine } from "@/lib/contours";
import { STATIONS, stationDelays, traversePath } from "@/lib/traverse";

const DRAW_MS = 2200;

/**
 * The hero's drawing: a surveyed landform with the route across it.
 *
 * Contours alone were texture, and texture behind a headline is wallpaper. The
 * ground now rises to a summit, and a traverse climbs to it through four
 * stations, one per year. That gives the viewport an object to read, a focus to
 * land on, and motion on arrival that does not wait for a pointer.
 *
 * Three depth planes: the far one blurred and dim, the near one crisp and
 * carrying the traverse. A drawing has depth of field. It does not have glass.
 */
export function ContourField({ lines }: { lines: ContourLine[] }) {
  const far = useRef<SVGGElement>(null);
  const mid = useRef<SVGGElement>(null);
  const near = useRef<SVGGElement>(null);
  const route = useRef<SVGPathElement>(null);

  // Draw the traverse once, on load. The stations reveal themselves through a
  // CSS animation with a per-station delay, so nothing here needs state.
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

  // Parallax and drift.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const planes = [far.current, mid.current, near.current];
    if (planes.some((p) => !p)) return;

    const reach = [9, 19, 34];
    const target = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let frame = 0;
    const start = performance.now();

    const onPointer = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth - 0.5;
      target.y = e.clientY / window.innerHeight - 0.5;
    };

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      eased.x += (target.x - eased.x) * 0.045;
      eased.y += (target.y - eased.y) * 0.045;

      planes.forEach((plane, i) => {
        const driftX = Math.sin(t * (0.033 + i * 0.009) + i * 1.4) * (8 + i * 4);
        const driftY = Math.cos(t * (0.041 + i * 0.006) + i * 0.7) * (5 + i * 3);
        plane!.setAttribute(
          "transform",
          `translate(${(driftX - eased.x * reach[i]).toFixed(2)},${(driftY - eased.y * reach[i]).toFixed(2)})`,
        );
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const minor = lines.filter((l) => !l.major);
  const farLines = minor.filter((_, i) => i % 3 === 0);
  const midLines = minor.filter((_, i) => i % 3 !== 0);
  const nearLines = lines.filter((l) => l.major);
  const delays = stationDelays();

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g ref={far} style={{ filter: "blur(1.7px)" }} opacity={0.5}>
        {farLines.map((l, i) => (
          <path key={`f${i}`} d={l.d} fill="none" stroke="var(--color-line)" strokeWidth={0.8} />
        ))}
      </g>

      <g ref={mid} opacity={0.44}>
        {midLines.map((l, i) => (
          <path key={`m${i}`} d={l.d} fill="none" stroke="var(--color-survey-2)" strokeWidth={0.9} />
        ))}
      </g>

      <g ref={near}>
        <g opacity={0.92}>
          {nearLines.map((l, i) => (
            <path
              key={`n${i}`}
              d={l.d}
              fill="none"
              stroke="var(--color-survey-2)"
              strokeWidth={1.35}
            />
          ))}
        </g>

        {/* The route. Straight legs between fixed stations, as a traverse is. */}
        <path
          ref={route}
          d={traversePath()}
          fill="none"
          stroke="var(--color-survey)"
          strokeWidth={2.2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

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
              <path d={`M${s.x} ${s.y - 15}l8.5 15h-17z`} fill="var(--color-fg)" />
            ) : (
              <>
                <circle
                  cx={s.x}
                  cy={s.y}
                  r={5.5}
                  fill="var(--color-ground)"
                  stroke="var(--color-survey)"
                  strokeWidth={1.8}
                />
                <circle cx={s.x} cy={s.y} r={1.6} fill="var(--color-survey)" />
              </>
            )}
            <text
              x={s.x}
              y={s.y - (s.terminal ? 24 : 15)}
              fill={s.terminal ? "var(--color-fg)" : "var(--color-survey)"}
              fontSize={13}
              fontFamily="var(--font-mono)"
              textAnchor="middle"
              letterSpacing="1.5"
            >
              {s.year}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
