import { describe, expect, it } from "vitest";
import { meshColumns, meshRows, nearestLeftEdge, project } from "./mesh";

const numbers = (d: string) => d.replace(/^M/, "").split(/[L\s]/).map(Number);

describe("project", () => {
  it("is deterministic", () => {
    expect(project(0.3, 0.7)).toEqual(project(0.3, 0.7));
  });

  it("widens as rows come forward", () => {
    const far = project(1, 0).x - project(0, 0).x;
    const near = project(1, 1).x - project(0, 1).x;
    expect(near).toBeGreaterThan(far);
  });

  it("brings rows down the sheet as they come forward", () => {
    // Compared at the row baselines rather than at a sample, since relief can
    // lift any individual point above the row it belongs to.
    expect(project(0.5, 1).y).toBeGreaterThan(project(0.5, 0).y);
  });

  it("bunches rows toward the horizon", () => {
    // The gap between the two farthest rows must be smaller than between the
    // two nearest, or the surface reads as a flat stack rather than as ground
    // receding.
    const farGap = project(0.5, 0.1).y - project(0.5, 0).y;
    const nearGap = project(0.5, 1).y - project(0.5, 0.9).y;
    expect(nearGap).toBeGreaterThan(farGap);
  });
});

describe("the composition", () => {
  it("keeps the surface clear of the headline", () => {
    // The hero's text block occupies the lower left. The drawing is framed to
    // avoid it rather than masked out of it afterwards, so this is the number
    // that keeps linework out of the words. 1440-wide field.
    expect(nearestLeftEdge()).toBeGreaterThan(520);
  });

  it("stays inside the field", () => {
    for (const row of meshRows()) {
      const n = numbers(row.d);
      for (let i = 0; i < n.length; i += 2) {
        expect(Number.isFinite(n[i])).toBe(true);
        expect(Number.isFinite(n[i + 1])).toBe(true);
        // Generous on the right: the hero oversizes the SVG and slices, so the
        // surface is meant to run off that edge. Never off the top, though.
        expect(n[i + 1]).toBeGreaterThan(-40);
        expect(n[i + 1]).toBeLessThan(900);
      }
    }
  });
});

describe("meshRows", () => {
  it("returns one path per row, far to near", () => {
    const rows = meshRows({ rows: 8, columns: 10 });
    expect(rows).toHaveLength(8);
    expect(rows[0].t).toBe(0);
    expect(rows[7].t).toBe(1);
  });

  it("samples each row the requested number of times", () => {
    expect(numbers(meshRows({ rows: 4, columns: 12 })[0].d)).toHaveLength(24);
  });

  it("is deterministic", () => {
    expect(meshRows({ rows: 6, columns: 8 })).toEqual(meshRows({ rows: 6, columns: 8 }));
  });

  it("refuses a degenerate surface", () => {
    expect(() => meshRows({ rows: 1 })).toThrow(/at least two/);
    expect(() => meshRows({ columns: 1 })).toThrow(/at least two/);
  });
});

describe("meshColumns", () => {
  it("returns one path per cross line", () => {
    expect(meshColumns({ rows: 10, columns: 5 })).toHaveLength(5);
  });

  it("walks every row, so a cross line spans the whole surface", () => {
    expect(numbers(meshColumns({ rows: 10, columns: 5 })[0].d)).toHaveLength(20);
  });

  it("refuses a degenerate surface", () => {
    expect(() => meshColumns({ rows: 1 })).toThrow(/at least two/);
  });
});
