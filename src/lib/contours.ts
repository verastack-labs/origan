/**
 * The ground the hero is drawn from.
 *
 * One height function, sampled by `mesh.ts` to build the surface model and by
 * `traverse.ts` to place the route's summit. Keeping it here, alone, means the
 * drawing and the route cannot disagree about where the hill is.
 *
 * This file used to also march contour lines across the field. That drawing
 * was replaced by the surface model, so the marcher went with it; the terrain
 * it traced is still what everything else reads from.
 *
 * Deterministic by design: the same input always gives the same height, so the
 * server render and the client hydration agree.
 */

/** Where the ground rises to, in the 1440x900 hero field. */
export const SUMMIT = { x: 1070, y: 250 } as const;

/**
 * The relief the hero is drawn from.
 *
 * Rolling ground from three sinusoids, plus one clear summit in the upper
 * right. The summit matters: without it the field is even texture, the eye has
 * nothing to land on, and the whole thing reads as wallpaper behind a headline.
 * Its concentric rings give the composition a focus, and they sit where the
 * traverse ends, which is the point of the drawing.
 */
export function height(x: number, y: number): number {
  const rolling =
    Math.sin(x * 0.0051) * Math.cos(y * 0.0074) * 0.78 +
    Math.sin((x + y * 1.3) * 0.0029) * 0.5 +
    Math.cos(x * 0.0018 - y * 0.0036) * 0.4;

  const dx = (x - SUMMIT.x) / 430;
  const dy = (y - SUMMIT.y) / 360;
  const peak = 1.35 * Math.exp(-(dx * dx + dy * dy));

  return rolling + peak;
}
