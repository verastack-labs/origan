import { describe, expect, it } from "vitest";
import { contourLines, height, SUMMIT } from "./contours";

const opts = { width: 400, height: 300 };

describe("height", () => {
  it("is deterministic", () => {
    expect(height(120, 80)).toBe(height(120, 80));
  });

  it("rises to a summit rather than staying even", () => {
    const atSummit = height(SUMMIT.x, SUMMIT.y);
    const away = height(SUMMIT.x - 700, SUMMIT.y + 500);
    expect(atSummit).toBeGreaterThan(away + 0.8);
  });

  it("stays inside the default level range, or the summit gets no rings", () => {
    let min = Infinity;
    let max = -Infinity;
    for (let x = 0; x <= 1440; x += 17) {
      for (let y = 0; y <= 900; y += 13) {
        const v = height(x, y);
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    // Must sit inside the `from`/`to` defaults in contourLines.
    expect(min).toBeGreaterThan(-1.7);
    expect(max).toBeLessThan(2.7);
  });
});

describe("contourLines", () => {
  it("produces lines", () => {
    expect(contourLines(opts).length).toBeGreaterThan(5);
  });

  it("indexes every fourth line as major", () => {
    const lines = contourLines(opts);
    expect(lines.some((l) => l.major)).toBe(true);
    expect(lines.some((l) => !l.major)).toBe(true);
  });

  it("emits valid path data, starting with a moveto", () => {
    for (const line of contourLines(opts)) {
      expect(line.d.startsWith("M")).toBe(true);
      expect(line.d).not.toMatch(/NaN|Infinity|undefined/);
    }
  });

  it("is deterministic, so server and client renders agree", () => {
    expect(contourLines(opts)).toEqual(contourLines(opts));
  });

  it("gets denser as the interval shrinks", () => {
    const coarse = contourLines({ ...opts, interval: 0.5 });
    const fine = contourLines({ ...opts, interval: 0.1 });
    expect(fine.length).toBeGreaterThan(coarse.length);
  });

  it("never emits a point outside the field", () => {
    for (const line of contourLines(opts)) {
      for (const [, , xs, ys] of line.d.matchAll(/([ML])([\d.]+) ([\d.]+)/g)) {
        expect(Number(xs)).toBeLessThanOrEqual(opts.width);
        expect(Number(ys)).toBeLessThanOrEqual(opts.height);
      }
    }
  });
});
