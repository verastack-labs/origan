import { describe, expect, it } from "vitest";
import { climbed, HEAP, isMinHeap, PUSHES, pushSteps } from "./heap";

/**
 * `rust/rust-dsa/src/stepper_checks.rs` records the row of the lesson's
 * min-heap loop before and after each swap, for these same pushes. These are
 * its literals: the row at the start, with the value added, and after each swap.
 */
const RUST_ROWS: Record<number, number[][]> = {
  5: [
    [10, 20, 15, 40, 30, 25, 50],
    [10, 20, 15, 40, 30, 25, 50, 5],
    [10, 20, 15, 5, 30, 25, 50, 40],
    [10, 5, 15, 20, 30, 25, 50, 40],
    [5, 10, 15, 20, 30, 25, 50, 40],
  ],
  12: [
    [10, 20, 15, 40, 30, 25, 50],
    [10, 20, 15, 40, 30, 25, 50, 12],
    [10, 20, 15, 12, 30, 25, 50, 40],
    [10, 12, 15, 20, 30, 25, 50, 40],
  ],
  60: [
    [10, 20, 15, 40, 30, 25, 50],
    [10, 20, 15, 40, 30, 25, 50, 60],
  ],
};

/** The distinct rows a stepper passes through, in order. */
const rowsOf = (value: number) => {
  const rows: number[][] = [];
  for (const step of pushSteps(HEAP, value)) {
    const last = rows[rows.length - 1];
    if (!last || last.join() !== step.row.join()) rows.push(step.row);
  }
  return rows;
};

describe("heap push steps", () => {
  it.each(PUSHES)("passes through the same rows as the Rust loop when %i is pushed", (value) => {
    expect(rowsOf(value)).toEqual(RUST_ROWS[value]);
  });

  it("is the lesson's worked example: 5 floats up three levels to the top", () => {
    const steps = pushSteps(HEAP, 5);
    expect(climbed(steps)).toBe(3);
    expect(steps.map((s) => s.kind)).toEqual(["start", "add", "compare", "compare", "compare", "top"]);
    expect(steps[2]).toMatchObject({ i: 7, parent: 3, swap: true });
    expect(steps[3]).toMatchObject({ i: 3, parent: 1, swap: true });
    expect(steps[4]).toMatchObject({ i: 1, parent: 0, swap: true });
  });

  it("stops the moment the value is no smaller than its parent", () => {
    const steps = pushSteps(HEAP, 12);
    expect(climbed(steps)).toBe(2);
    const end = steps[steps.length - 1];
    expect(end).toMatchObject({ kind: "compare", i: 1, parent: 0, swap: false });
    expect(pushSteps(HEAP, 60).map((s) => s.kind)).toEqual(["start", "add", "compare"]);
  });

  it("ends in a valid min-heap, for every value from 0 to 99", () => {
    expect(isMinHeap(HEAP)).toBe(true);
    for (let value = 0; value < 100; value++) {
      const steps = pushSteps(HEAP, value);
      const end = steps[steps.length - 1].row;
      expect(isMinHeap(end), `pushing ${value}`).toBe(true);
      expect([...end].sort((a, b) => a - b)).toEqual([...HEAP, value].sort((a, b) => a - b));
    }
  });

  it("does not mutate the heap it was given", () => {
    const before = [...HEAP];
    pushSteps(HEAP, 5);
    expect([...HEAP]).toEqual(before);
  });
});
