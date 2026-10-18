import { describe, expect, it } from "vitest";
import { outcome, probes, ROW, searchSteps, TARGETS } from "./binary-search";

/**
 * The expected middles are the ones `rust/rust-dsa/src/stepper_checks.rs`
 * records by running the lesson's `find` loop on the same row, and asserts. If
 * either side changes, the other fails.
 */
const RUST_PROBES: Record<number, number[]> = {
  45: [5, 8, 7],
  2: [5, 2, 1, 0],
  91: [5, 8, 10],
  40: [5, 8, 7, 6],
};

describe("binary search steps", () => {
  it.each(TARGETS)("looks at the same middles as the Rust loop for %i", (target) => {
    expect(probes(searchSteps(ROW, target))).toEqual(RUST_PROBES[target]);
  });

  it.each(TARGETS)("ends where a plain scan says for %i", (target) => {
    const { found, at } = outcome(searchSteps(ROW, target));
    const scan = ROW.indexOf(target as never);
    expect(found).toBe(scan >= 0);
    expect(at).toBe(scan >= 0 ? scan : ROW.filter((v) => v < target).length);
  });

  it("is right for every number from 0 to 100, not just the four on offer", () => {
    for (let target = 0; target <= 100; target++) {
      const steps = searchSteps(ROW, target);
      const { found, at } = outcome(steps);
      const scan = ROW.indexOf(target as never);
      expect(found).toBe(scan >= 0);
      expect(at).toBe(found ? scan : ROW.filter((v) => v < target).length);
      // Halving: eleven numbers never need more than four looks.
      expect(probes(steps).length).toBeLessThanOrEqual(4);
    }
  });

  it("keeps lo and hi inside the row, and in order while it is still looking", () => {
    for (const target of [0, 45, 100]) {
      for (const step of searchSteps(ROW, target)) {
        expect(step.lo).toBeGreaterThanOrEqual(0);
        expect(step.hi).toBeLessThanOrEqual(ROW.length);
        if (step.kind === "look") expect(step.lo).toBeLessThan(step.hi);
      }
    }
  });

  it("matches the lesson's worked example: 45 in three looks", () => {
    const steps = searchSteps(ROW, 45);
    expect(steps).toHaveLength(4); // the start, then three looks
    expect(steps[1]).toMatchObject({ mid: 5, value: 23, result: "too-small" });
    expect(steps[2]).toMatchObject({ lo: 6, hi: 11, mid: 8, value: 56, result: "too-big" });
    expect(steps[3]).toMatchObject({ lo: 6, hi: 8, mid: 7, value: 45, result: "found" });
  });
});
