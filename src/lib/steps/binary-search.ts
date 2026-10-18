/**
 * The steps of the binary search stepper in the Oxidise lesson on binary
 * search: the lesson's own algorithm (`find` in lesson14_binary_search.rs),
 * run one pass of its loop at a time.
 *
 * `lo..hi` is half-open, `hi` one past the end, exactly as the lesson says.
 * `binary-search.test.ts` checks the probes against the numbers the Rust test
 * (`stepper_checks.rs`) asserts for the same row, and against a plain scan.
 */
export const ROW = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91] as const;

/** The numbers the reader can hunt for: a middle one, the two ends, and one that is missing. */
export const TARGETS = [45, 2, 91, 40] as const;

export type SearchStep =
  | { kind: "start"; lo: number; hi: number }
  | {
      kind: "look";
      lo: number;
      hi: number;
      mid: number;
      value: number;
      /** What the look decided. */
      result: "found" | "too-small" | "too-big";
    }
  | { kind: "gone"; lo: number; hi: number };

/** Every state the search passes through for `target`, in order. */
export function searchSteps(row: readonly number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  let lo = 0;
  let hi = row.length;
  steps.push({ kind: "start", lo, hi });

  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const value = row[mid];
    if (value === target) {
      steps.push({ kind: "look", lo, hi, mid, value, result: "found" });
      return steps;
    }
    if (value < target) {
      steps.push({ kind: "look", lo, hi, mid, value, result: "too-small" });
      lo = mid + 1;
    } else {
      steps.push({ kind: "look", lo, hi, mid, value, result: "too-big" });
      hi = mid;
    }
  }

  steps.push({ kind: "gone", lo, hi });
  return steps;
}

/** The index of each middle the search looked at, in order. */
export const probes = (steps: readonly SearchStep[]): number[] =>
  steps.flatMap((s) => (s.kind === "look" ? [s.mid] : []));

/** Where the search ended: the position of the target, or the gap where it would go. */
export function outcome(steps: readonly SearchStep[]): { found: boolean; at: number } {
  const end = steps[steps.length - 1];
  if (end.kind === "look") return { found: true, at: end.mid };
  return { found: false, at: end.lo };
}
