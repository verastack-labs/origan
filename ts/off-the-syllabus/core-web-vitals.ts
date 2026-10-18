// Article 1: LCP, CLS and INP in plain words. The page text is
// src/content/learn/off-the-syllabus/core-web-vitals.mdx.
//
// The numbers are the "good" and "poor" boundaries published at web.dev. The
// functions are small on purpose: they are the definitions, written as code.

// region: thresholds
export type Vital = "LCP" | "CLS" | "INP";
export type Rating = "good" | "needs improvement" | "poor";

// LCP and INP are in milliseconds. CLS is a score with no unit.
export const thresholds = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
} as const;

export function rate(vital: Vital, value: number): Rating {
  const { good, poor } = thresholds[vital];
  if (value <= good) return "good";
  if (value <= poor) return "needs improvement";
  return "poor";
}
// endregion

// region: shift-score
// One layout shift: how much of the screen was involved, times how far it moved.
export function layoutShiftScore(impactFraction: number, distanceFraction: number): number {
  return impactFraction * distanceFraction;
}
// endregion

// region: cls
export type Shift = { startTime: number; value: number; hadRecentInput: boolean };

// CLS is the biggest "burst": shifts less than a second apart, in a window
// that lasts at most five seconds. Shifts right after a tap or key press
// (hadRecentInput) are expected, so they are left out.
export function cumulativeLayoutShift(shifts: readonly Shift[]): number {
  let biggest = 0;
  let burst = 0;
  let burstStart = 0;
  let previous = 0;
  let open = false;

  for (const shift of shifts) {
    if (shift.hadRecentInput) continue;

    const newBurst = !open || shift.startTime - previous >= 1000 || shift.startTime - burstStart > 5000;
    if (newBurst) {
      burst = 0;
      burstStart = shift.startTime;
      open = true;
    }
    burst += shift.value;
    previous = shift.startTime;
    biggest = Math.max(biggest, burst);
  }
  return biggest;
}
// endregion

// region: inp
// One page visit: the slowest interaction, but with one outlier forgiven for
// every 50 interactions. The number reported for a page is then the 75th
// percentile of this value across all its visits.
export function interactionToNextPaint(durations: readonly number[]): number | undefined {
  if (durations.length === 0) return undefined;
  const slowestFirst = [...durations].sort((a, b) => b - a);
  const forgiven = Math.floor(durations.length / 50);
  return slowestFirst[Math.min(forgiven, slowestFirst.length - 1)];
}
// endregion

// region: percentile
// Line the visits up from best to worst and take the one three quarters along.
export function percentile75(values: readonly number[]): number | undefined {
  if (values.length === 0) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(sorted.length * 0.75) - 1];
}
// endregion

// region: watch
// Browser only. A PerformanceObserver is the browser telling your code about
// things it measured. `buffered: true` also replays what happened before you
// started watching.
type LayoutShiftEntry = PerformanceEntry & { value: number; hadRecentInput: boolean };

export function watchPaintAndShifts(report: (what: string, value: number) => void): void {
  new PerformanceObserver((list) => {
    // The browser may name several candidates. The last one is the LCP so far.
    const last = list.getEntries().at(-1);
    if (last) report("LCP candidate (ms)", Math.round(last.startTime));
  }).observe({ type: "largest-contentful-paint", buffered: true });

  new PerformanceObserver((list) => {
    for (const entry of list.getEntries() as LayoutShiftEntry[]) {
      if (!entry.hadRecentInput) report("layout shift", Number(entry.value.toFixed(4)));
    }
  }).observe({ type: "layout-shift", buffered: true });
}
// endregion
