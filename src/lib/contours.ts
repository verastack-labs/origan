/**
 * Contour generation for the hero field.
 *
 * A contour joins points of equal height. This walks the field in columns and,
 * for each column, finds where the height function crosses a given level,
 * interpolating between samples so the line is smooth rather than stepped. The
 * result is an ordinary SVG path per level, which means no canvas, no WebGL,
 * and nothing that depends on a browser feature a dean's machine might lack.
 *
 * Deterministic by design: the same options always produce the same lines, so
 * the server render and the client hydration agree.
 */

export type ContourLine = {
  /** SVG path data. */
  d: string;
  /** Every fourth line is drawn heavier, the way a survey plan indexes them. */
  major: boolean;
};

export type ContourOptions = {
  width: number;
  height: number;
  /** Lowest and highest levels to trace. */
  from?: number;
  to?: number;
  /** Vertical interval between lines. Smaller means denser linework. */
  interval?: number;
  /** Horizontal sampling step in user units. Smaller is smoother and slower. */
  stepX?: number;
  /** Vertical sampling step used when hunting for a crossing. */
  stepY?: number;
};

/** Where the ground rises to, in the 1440x900 hero field. */
export const SUMMIT = { x: 1070, y: 250 } as const;

/**
 * The relief the hero is drawn from.
 *
 * Rolling ground from three sinusoids, plus one clear summit in the upper
 * right. The summit matters: without it the field is even texture, the eye has
 * nothing to land on, and the whole thing reads as wallpaper behind a headline.
 * Its concentric rings give the composition a focus, and they sit where the
 * traverse ends, which is the point of the drawing.
 */
export function height(x: number, y: number): number {
  const rolling =
    Math.sin(x * 0.0051) * Math.cos(y * 0.0074) * 0.78 +
    Math.sin((x + y * 1.3) * 0.0029) * 0.5 +
    Math.cos(x * 0.0018 - y * 0.0036) * 0.4;

  const dx = (x - SUMMIT.x) / 430;
  const dy = (y - SUMMIT.y) / 360;
  const peak = 1.35 * Math.exp(-(dx * dx + dy * dy));

  return rolling + peak;
}

export function contourLines({
  width,
  height: h,
  from = -1.7,
  to = 2.7,
  interval = 0.17,
  stepX = 5,
  stepY = 4,
}: ContourOptions): ContourLine[] {
  const lines: ContourLine[] = [];
  let index = 0;

  for (let level = from; level <= to; level += interval) {
    let d = "";
    let open = false;

    for (let x = 0; x <= width; x += stepX) {
      let crossing: number | null = null;

      // Stop where the next sample would fall outside the field. Reading past
      // the edge lets the interpolated crossing land beyond it, which puts
      // points outside the viewBox.
      for (let y = 0; y + stepY <= h; y += stepY) {
        const a = height(x, y) - level;
        const b = height(x, y + stepY) - level;
        if (a === 0 || a * b < 0) {
          crossing = y + stepY * (a / (a - b));
          break;
        }
      }

      if (crossing === null) {
        open = false;
        continue;
      }

      d += `${open ? "L" : "M"}${x} ${crossing.toFixed(1)}`;
      open = true;
    }

    if (d) lines.push({ d, major: index % 4 === 0 });
    index += 1;
  }

  return lines;
}
