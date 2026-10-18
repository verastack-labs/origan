import { layoutShiftScore, rate, type Rating } from "../../../ts/off-the-syllabus/core-web-vitals";

/**
 * The geometry behind the layout shift demo in the Core Web Vitals article: a
 * small mock page in a fixed frame, an ad that arrives late, and the score the
 * shift earns by the article's own definition (impact fraction times distance
 * fraction, from `ts/off-the-syllabus/core-web-vitals.ts`, the function the
 * article prints and tests).
 *
 * The sizes are made up and in "demo pixels". The page the reader sees is
 * built from these same numbers, so what is drawn and what is scored cannot
 * disagree. It shows the idea. It is not a measurement of anything real.
 */
export const FRAME = { w: 280, h: 400 } as const;

/** The space between one block and the next, and the ad's own height. */
export const GAP = 12;
export const AD_H = 90;

/** How wide the content is inside the frame (the frame has 16px of padding each side). */
export const CONTENT_W = 248;

export type Box = { id: "header" | "title" | "ad" | "seat" | "pay" | "cancel"; y: number; h: number };

const HEIGHTS: Record<Box["id"], number> = { header: 44, title: 56, ad: 0, seat: 96, pay: 44, cancel: 36 };
const ORDER: Box["id"][] = ["header", "title", "ad", "seat", "pay", "cancel"];

/**
 * Where every block sits. An ad that has not arrived takes no room unless the
 * space for it was reserved, in which case it holds its full height from the
 * start. Once it has arrived it always has its full height.
 */
export function layout({ adArrived, reserved }: { adArrived: boolean; reserved: boolean }): Box[] {
  let y = 0;
  return ORDER.map((id) => {
    const h = id === "ad" ? (adArrived || reserved ? AD_H : 0) : HEIGHTS[id];
    const box = { id, y, h };
    // A block with no height has no gap after it either.
    y += h > 0 ? h + GAP : 0;
    return box;
  });
}

/** The blocks that move, and how far, when `after` replaces `before`. */
export function moved(before: readonly Box[], after: readonly Box[]): { id: Box["id"]; dy: number }[] {
  return before.flatMap((b, i) => (after[i].id === b.id && after[i].y !== b.y && b.h > 0 ? [{ id: b.id, dy: after[i].y - b.y }] : []));
}

/** The length of the union of some vertical spans, each clipped to 0..limit. */
function unionLength(spans: readonly [number, number][], limit: number): number {
  const clipped = spans
    .map(([a, b]) => [Math.max(0, a), Math.min(limit, b)] as [number, number])
    .filter(([a, b]) => b > a)
    .sort((p, q) => p[0] - q[0]);
  let total = 0;
  let end = -Infinity;
  for (const [a, b] of clipped) {
    if (a > end) {
      total += b - a;
      end = b;
    } else if (b > end) {
      total += b - end;
      end = b;
    }
  }
  return total;
}

export type Shift = {
  /** How much of the frame the moving blocks covered, before and after. */
  impact: number;
  /** How far the biggest mover went, as a share of the frame's longer side. */
  distance: number;
  score: number;
  rating: Rating;
};

/** The score of the shift from `before` to `after`, by the article's definition. */
export function shiftOf(before: readonly Box[], after: readonly Box[]): Shift {
  const movers = moved(before, after);
  const ids = new Set(movers.map((m) => m.id));
  const spans: [number, number][] = [];
  for (const [i, b] of before.entries()) {
    if (!ids.has(b.id)) continue;
    spans.push([b.y, b.y + b.h], [after[i].y, after[i].y + after[i].h]);
  }
  // Every block is as wide as the content, so the covered area is the covered height times that width.
  const covered = unionLength(spans, FRAME.h) * CONTENT_W;
  const impact = covered / (FRAME.w * FRAME.h);
  const distance = Math.max(0, ...movers.map((m) => Math.abs(m.dy))) / Math.max(FRAME.w, FRAME.h);
  const score = layoutShiftScore(impact, distance);
  return { impact, distance, score, rating: rate("CLS", score) };
}

/** The shift that the ad's arrival causes, with the space reserved or not. */
export const adShift = (reserved: boolean) =>
  shiftOf(layout({ adArrived: false, reserved }), layout({ adArrived: true, reserved }));
