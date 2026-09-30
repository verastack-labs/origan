"use client";

import { useEffect, useRef } from "react";
import type { MeshRow } from "@/lib/mesh";
import { STATIONS, stationDelays, traversePath } from "@/lib/traverse";

const DRAW_MS = 2200;
/** One pass of the wave from the far rows to the near ones. */
const WAVE_MS = 7000;

/**
 * The hero's drawing: a surface model of the ground, with the route across it.
 *
 * This replaced a full-bleed contour field. Contours at hero density were even
 * texture with no direction to read in, and no amount of masking made them
 * anything other than wallpaper behind a headline. A surface model has a
 * horizon, a ridge and a foreground, so the eye has somewhere to go, and it is
 * framed to leave the lower left empty rather than veiled.
 *
 * Two depth planes: the cross lines sit behind and dim, the profile lines in
 * front with the traverse. A drawing has depth of field. It does not have
 * glass.
 */
export function SurfaceField({ rows, columns }: { rows: MeshRow[]; columns: MeshRow[] }) {
  const back = useRef<SVGGElement>(null);
  const front = useRef<SVGGElement>(null);
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

    const planes = [back.current, front.current];
    if (planes.some((p) => !p)) return;

    const reach = [12, 26];
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
        const driftX = Math.sin(t * (0.036 + i * 0.011) + i * 1.4) * (7 + i * 4);
        const driftY = Math.cos(t * (0.044 + i * 0.008) + i * 0.7) * (4 + i * 3);
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

  const delays = stationDelays();

  return (
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* The surface dissolves at the horizon rather than stopping on a
            hard edge, which is the difference between ground going away from
            you and a shape sitting on a page. */}
        <linearGradient id="mesh-horizon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.2" stopColor="white" stopOpacity="1" />
          <stop offset="1" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="mesh-horizon-mask">
          <rect x="0" y="0" width="1440" height="900" fill="url(#mesh-horizon)" />
        </mask>

        {/* And again on the left. Every row begins at the same x, so without
            this the surface ends on a ruled diagonal that reads as a crop mark
            rather than as terrain running out of frame. */}
        <linearGradient id="mesh-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0.28" stopColor="white" stopOpacity="0" />
          <stop offset="0.52" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="mesh-edge-mask">
          <rect x="0" y="0" width="1440" height="900" fill="url(#mesh-edge)" />
        </mask>
      </defs>

      {/* The masks wrap the terrain only. The route is the subject of the
          drawing, not part of the ground it crosses, so it keeps its full
          weight from the first station to the last. Fading it with the terrain
          lost stations I and II, which is the half of the story that says
          preparation starts in first year. */}
      <g ref={back} mask="url(#mesh-horizon-mask)" opacity={0.34}>
        <g mask="url(#mesh-edge-mask)">
          {columns.map((line, i) => (
            <path
              key={`c${i}`}
              className="wave"
              style={{
                animationDuration: `${WAVE_MS}ms`,
                animationDelay: `${-line.t * WAVE_MS}ms`,
              }}
              d={line.d}
              fill="none"
              stroke="var(--color-line)"
              strokeWidth={0.9}
            />
          ))}
        </g>
      </g>

      <g ref={front}>
        <g mask="url(#mesh-horizon-mask)">
          <g mask="url(#mesh-edge-mask)">
            {rows.map((line, i) => (
              <path
                key={`r${i}`}
                className="wave"
                style={{
                  animationDuration: `${WAVE_MS}ms`,
                  // Negative delay starts each row mid-cycle, so the
                  // brightening travels from the horizon toward the viewer as
                  // one pass rather than every row pulsing together.
                  animationDelay: `${-line.t * WAVE_MS}ms`,
                }}
                d={line.d}
                fill="none"
                stroke="var(--color-survey-2)"
                // Nearer rows carry more weight, which is most of the depth.
                strokeWidth={0.7 + line.t * 1.05}
                strokeLinecap="round"
              />
            ))}
          </g>
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
