import { describe, expect, it } from "vitest";
import { CUMULATIVE, profileGeometry } from "./profile";

describe("CUMULATIVE", () => {
  it("covers nine boundaries, entry plus eight semesters", () => {
    expect(CUMULATIVE).toHaveLength(9);
  });

  it("starts at entry and ends fully prepared", () => {
    expect(CUMULATIVE[0]).toBe(0);
    expect(CUMULATIVE[8]).toBe(1);
  });

  it("never goes backwards, because preparation does not unaccumulate", () => {
    for (let i = 1; i < CUMULATIVE.length; i += 1) {
      expect(CUMULATIVE[i]).toBeGreaterThan(CUMULATIVE[i - 1]);
    }
  });
});

describe("profileGeometry", () => {
  const g = profileGeometry();

  it("spans the plot area exactly", () => {
    expect(g.boundaries[0]).toBe(g.plot.left);
    expect(g.boundaries[8]).toBeCloseTo(g.plot.left + g.plot.width, 5);
  });

  it("puts a centre inside every semester band", () => {
    expect(g.centres).toHaveLength(8);
    g.centres.forEach((c, i) => {
      expect(c).toBeGreaterThan(g.boundaries[i]);
      expect(c).toBeLessThan(g.boundaries[i + 1]);
    });
  });

  it("rises from left to right, since y grows downward in SVG", () => {
    const ys = g.points.map((p) => p.y);
    for (let i = 1; i < ys.length; i += 1) {
      expect(ys[i]).toBeLessThan(ys[i - 1]);
    }
  });

  it("marks a benchmark on each year boundary", () => {
    expect(g.points.map((p) => p.semester)).toEqual([2, 4, 6, 8]);
  });

  it("emits path data with no NaN", () => {
    expect(g.ground.startsWith("M")).toBe(true);
    expect(g.ground).not.toMatch(/NaN|undefined/);
    expect(g.groundFill.endsWith("Z")).toBe(true);
  });

  it("starts campus training in the final semester, not before", () => {
    expect(g.training.x1).toBe(g.boundaries[7]);
    expect(g.training.x2).toBeGreaterThan(g.training.x1);
  });

  it("keeps the curve inside the plot", () => {
    const top = g.plot.top;
    const bottom = g.plot.top + g.plot.height;
    for (const p of g.points) {
      expect(p.y).toBeGreaterThanOrEqual(top);
      expect(p.y).toBeLessThanOrEqual(bottom);
    }
  });

  it("scales with the viewport it is given", () => {
    const wide = profileGeometry({ width: 2400 });
    expect(wide.plot.width).toBeGreaterThan(g.plot.width);
  });
});
