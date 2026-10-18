import { rate, thresholds, type Rating } from "../../../ts/off-the-syllabus/core-web-vitals";

/**
 * The numbers behind the slow-tap demo in the Core Web Vitals article: how much
 * work a press does, how it can be cut into pieces, and where a reading lands
 * on the meter. The good and poor lines are the article's own
 * (`ts/off-the-syllabus/core-web-vitals.ts`).
 */

/** The work a press does before the page can show anything, in milliseconds of busy waiting. */
export const WORK_MS = 600;

/** The same work cut into this many pieces when the page yields to the browser between them. */
export const PIECES = 6;
export const PIECE_MS = WORK_MS / PIECES;

/** The meter runs from nothing to this, in milliseconds. */
export const SCALE_MS = 800;

export const GOOD_MS = thresholds.INP.good;
export const POOR_MS = thresholds.INP.poor;

/** Where a reading sits along the meter, as a percentage of its width. Clamped to the ends. */
export const position = (ms: number) => Math.min(100, Math.max(0, (ms / SCALE_MS) * 100));

/** The three bands of the meter as percentages of its width: good, needs improvement, poor. */
export const bands = (): [number, number, number] => [
  position(GOOD_MS),
  position(POOR_MS) - position(GOOD_MS),
  100 - position(POOR_MS),
];

export const ratingOf = (ms: number): Rating => rate("INP", ms);

/** A reading as shown: whole milliseconds. */
export const show = (ms: number) => `${Math.round(ms)} ms`;
