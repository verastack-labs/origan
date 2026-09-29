/**
 * WCAG 2.1 relative luminance and contrast ratio.
 *
 * Split out of the check script so it can be tested. The first version of this
 * lived inline and shipped a bug: the blue term multiplied the raw 0-255
 * channel instead of its linearised value, which inflated every luminance by
 * roughly an order of magnitude and produced two confident false failures.
 * Formulas that look obviously right are exactly the ones worth testing.
 */

/** Linearise one 0-255 channel. */
export function channel(value) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance of a #rrggbb colour, 0 for black through 1 for white. */
export function luminance(hex) {
  const n = Number.parseInt(hex.slice(1), 16);
  return (
    0.2126 * channel((n >> 16) & 255) +
    0.7152 * channel((n >> 8) & 255) +
    0.0722 * channel(n & 255)
  );
}

/** Contrast ratio between two colours, 1 through 21. Order does not matter. */
export function ratio(a, b) {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Parse `--color-*` tokens out of a stylesheet. */
export function parseTokens(css) {
  return Object.fromEntries(
    [...css.matchAll(/--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]),
  );
}
