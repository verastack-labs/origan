import { describe, expect, it } from "vitest";
import { adjacency, bfsSteps, ROADS, VERTICES } from "./bfs";

/**
 * `rust/rust-dsa/src/stepper_checks.rs` runs the lesson's BFS on this town and
 * asserts the vertex taken at each step and the queue left behind. These are
 * the same literals.
 */
const RUST_TRACE: [number, number[]][] = [
  [0, [1, 2, 3]],
  [1, [2, 3, 4]],
  [2, [3, 4, 5, 6]],
  [3, [4, 5, 6, 7]],
  [4, [5, 6, 7]],
  [5, [6, 7]],
  [6, [7]],
  [7, []],
];

describe("breadth-first search steps", () => {
  const adj = adjacency(VERTICES, ROADS);
  const steps = bfsSteps(adj, 0);

  it("builds the same adjacency lists as the lesson", () => {
    expect(adj).toEqual([[1, 2, 3], [0, 4], [0, 5, 6], [0, 7], [1], [2], [2], [3]]);
  });

  it("takes the same vertex and leaves the same queue as the Rust loop at every step", () => {
    expect(steps.slice(1).map((s) => [s.current, s.queue])).toEqual(RUST_TRACE);
  });

  it("starts with only the start waiting, and visits in the order the lesson prints", () => {
    expect(steps[0]).toMatchObject({ current: null, queue: [0], taken: [] });
    expect(steps[steps.length - 1].taken).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(steps[steps.length - 1].queue).toEqual([]);
  });

  it("finishes each ring before the next: the distances are 0, then 1s, then 2s", () => {
    const end = steps[steps.length - 1].distance;
    expect(end).toEqual({ 0: 0, 1: 1, 2: 1, 3: 1, 4: 2, 5: 2, 6: 2, 7: 2 });
    const order = steps[steps.length - 1].taken.map((v) => end[v]);
    expect(order).toEqual([...order].sort((a, b) => a - b));
  });

  it("never puts a vertex in the queue twice, and only new vertices join", () => {
    const joined = steps.flatMap((s) => s.fresh);
    expect(joined.sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("copes with a graph in pieces: only the start's piece is reached", () => {
    const pieces = adjacency(5, [[0, 1], [2, 3]]);
    expect(bfsSteps(pieces, 0).pop()?.taken).toEqual([0, 1]);
  });
});
