/**
 * Chainage is how a survey names distance along a line: kilometres, a plus,
 * then metres padded to three digits. The nav readout uses it to express
 * scroll position, which is the page's small joke and also genuinely legible.
 */

/** Total distance the page represents, in metres. Four years, 3km. */
export const TOTAL_METRES = 3000;

/** Format a distance in metres as `k+mmm`. */
export function formatChainage(metres: number): string {
  const clamped = Math.max(0, Math.min(TOTAL_METRES, Math.round(metres)));
  const km = Math.floor(clamped / 1000);
  const m = String(clamped % 1000).padStart(3, "0");
  return `${km}+${m}`;
}

/**
 * Convert a 0..1 scroll fraction to a formatted chainage.
 *
 * NaN means the caller divided by a zero scroll range, which happens on a page
 * shorter than the viewport, and the honest answer there is the start of the
 * line. Infinity is just an out-of-range number and clamps like any other.
 */
export function chainageFromProgress(progress: number): string {
  const p = Number.isNaN(progress) ? 0 : progress;
  return formatChainage(Math.max(0, Math.min(1, p)) * TOTAL_METRES);
}
