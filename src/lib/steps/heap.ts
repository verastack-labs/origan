/**
 * The steps of the heap stepper in the Oxidise lesson on heaps: the lesson's
 * own `MinHeap::push` (lesson8_heap.rs), one comparison at a time, on the
 * seven-value heap from the lesson's picture.
 *
 * `heap.test.ts` checks the rows against what `stepper_checks.rs` asserts for
 * the same pushes, and checks that every finished row is a valid min-heap.
 */
export const HEAP = [10, 20, 15, 40, 30, 25, 50] as const;

/** Values to push: one that floats to the top, one that stops partway, one that stays put. */
export const PUSHES = [5, 12, 60] as const;

export type HeapStep =
  | { kind: "start"; row: number[] }
  /** The new value has been put in the next free slot, `i`. */
  | { kind: "add"; row: number[]; i: number }
  /** The value at `i` is compared with its parent. If `swap`, they trade places at the next step. */
  | { kind: "compare"; row: number[]; i: number; parent: number; swap: boolean }
  /** The value reached slot 0, so there is no parent left to compare with. */
  | { kind: "top"; row: number[]; i: 0 };

export const parentOf = (i: number) => Math.floor((i - 1) / 2);

export function pushSteps(start: readonly number[], value: number): HeapStep[] {
  const row = [...start];
  const steps: HeapStep[] = [{ kind: "start", row: [...row] }];

  row.push(value);
  let i = row.length - 1;
  steps.push({ kind: "add", row: [...row], i });

  while (i > 0) {
    const parent = parentOf(i);
    const swap = row[i] < row[parent];
    steps.push({ kind: "compare", row: [...row], i, parent, swap });
    if (!swap) return steps;
    [row[i], row[parent]] = [row[parent], row[i]];
    i = parent;
  }

  steps.push({ kind: "top", row: [...row], i: 0 });
  return steps;
}

/** How many levels the new value climbed. */
export const climbed = (steps: readonly HeapStep[]) =>
  steps.filter((s) => s.kind === "compare" && s.swap).length;

/** Whether a row obeys the min-heap rule: no child is smaller than its parent. */
export function isMinHeap(row: readonly number[]): boolean {
  return row.every((v, i) => i === 0 || row[parentOf(i)] <= v);
}
