// Article 2: Reading a PageSpeed Insights report without panicking. The page
// text is src/content/learn/off-the-syllabus/reading-pagespeed.mdx.
//
// The rules here are the ones the PageSpeed Insights and Lighthouse docs state,
// written as code so that the edge cases are tested and not just described.

// region: bands
export type Band = "good" | "needs improvement" | "poor";

// The colours of the lab score: 90 to 100 green, 50 to 89 orange, below 50 red.
export function scoreBand(score: number): Band {
  if (score >= 90) return "good";
  if (score >= 50) return "needs improvement";
  return "poor";
}
// endregion

// region: weights
// How much each lab metric counts towards the score, for Lighthouse 10.
export const weights = {
  FCP: 0.1, // First Contentful Paint
  SI: 0.1, // Speed Index
  LCP: 0.25, // Largest Contentful Paint
  TBT: 0.3, // Total Blocking Time
  CLS: 0.25, // Cumulative Layout Shift
} as const;

export type Metric = keyof typeof weights;

// Each metric is first turned into its own score from 0 to 1. The performance
// score is the weighted average of those, shown out of 100.
export function performanceScore(metricScores: Record<Metric, number>): number {
  let total = 0;
  for (const metric of Object.keys(weights) as Metric[]) {
    total += weights[metric] * metricScores[metric];
  }
  return Math.round(total * 100);
}
// endregion

// region: assessment
// What the field data says about one metric at the 75th percentile, or
// undefined when there were not enough real visits to say.
export type Field = { LCP?: Band; CLS?: Band; INP?: Band };
export type Assessment = "passed" | "failed" | "cannot be assessed";

export function coreWebVitalsAssessment(field: Field): Assessment {
  // Without LCP or CLS there is nothing to judge.
  if (field.LCP === undefined || field.CLS === undefined) return "cannot be assessed";

  // INP may be missing, and then the other two decide. When it is there, it counts.
  const judged = [field.LCP, field.CLS, ...(field.INP === undefined ? [] : [field.INP])];
  return judged.every((band) => band === "good") ? "passed" : "failed";
}
// endregion

// region: median
// Lighthouse scores wobble from run to run. Run it several times and take the middle one.
export function median(values: readonly number[]): number | undefined {
  if (values.length === 0) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}
// endregion
