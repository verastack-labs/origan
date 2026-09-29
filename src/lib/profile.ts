/**
 * Geometry for the longitudinal section: the rising ground line that plots
 * preparation against eight semesters, the benchmarks on each year boundary,
 * and the short flat stub showing where campus training begins.
 *
 * Pure arithmetic, no DOM, so the shape can be asserted in tests rather than
 * eyeballed in a screenshot.
 */

export type ProfileGeometry = {
  /** Plot area in the SVG's own coordinate space. */
  plot: { left: number; top: number; width: number; height: number };
  /** The ground line, as SVG path data. */
  ground: string;
  /** The same line closed down to the datum, for the tint beneath it. */
  groundFill: string;
  /** One x position per semester boundary, nine in total including the origin. */
  boundaries: number[];
  /** Centre x of each semester band, for labels and hit zones. */
  centres: number[];
  /** Where a benchmark marker sits, keyed by the semester it follows. */
  points: { semester: number; x: number; y: number }[];
  /** The flat line showing a two-week programme arriving at the end. */
  training: { x1: number; x2: number; y: number };
};

/**
 * Cumulative preparation at each semester boundary, 0 at entry and 1 at
 * placement. Illustrative, and deliberately not linear: the middle years are
 * where the curve does its work.
 */
export const CUMULATIVE = [0, 0.1, 0.22, 0.33, 0.46, 0.6, 0.75, 0.88, 1] as const;

export type ProfileOptions = {
  width?: number;
  height?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  /** Fraction of plot height the full curve is allowed to use. */
  headroom?: number;
};

export function profileGeometry({
  width = 1200,
  height = 320,
  left = 76,
  right = 38,
  top = 34,
  bottom = 58,
  headroom = 0.93,
}: ProfileOptions = {}): ProfileGeometry {
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const baseline = top + plotHeight;

  const boundaries = CUMULATIVE.map((_, i) => left + (plotWidth * i) / 8);
  const centres = Array.from({ length: 8 }, (_, i) => left + (plotWidth * (i + 0.5)) / 8);

  const yFor = (v: number) => baseline - plotHeight * v * headroom;

  const ground = CUMULATIVE.map(
    (v, i) => `${i ? "L" : "M"}${boundaries[i].toFixed(1)} ${yFor(v).toFixed(1)}`,
  ).join("");

  const groundFill = `${ground}L${(width - right).toFixed(1)} ${baseline}L${left.toFixed(1)} ${baseline}Z`;

  const points = [2, 4, 6, 8].map((semester) => ({
    semester,
    x: boundaries[semester],
    y: yFor(CUMULATIVE[semester]),
  }));

  return {
    plot: { left, top, width: plotWidth, height: plotHeight },
    ground,
    groundFill,
    boundaries,
    centres,
    points,
    training: { x1: boundaries[7], x2: width - right, y: baseline - plotHeight * 0.15 },
  };
}
