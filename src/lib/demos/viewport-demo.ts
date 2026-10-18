/**
 * The numbers behind the phone in the svh article: one screen, two heights.
 *
 * With the browser's address bar showing, the visible area is the small
 * viewport (`svh`). With it slid away, the visible area is the large viewport
 * (`lvh`). Plain `vh` is the large one, as MDN says and the article quotes, and
 * `dvh` is whichever is true right now. The sizes are made up, in CSS pixels,
 * and only have to be consistent with each other.
 */
export const PHONE = { large: 740, bar: 56, width: 390 } as const;

export type Bar = "shown" | "hidden";

export const svh = PHONE.large - PHONE.bar;
export const lvh = PHONE.large;

/** What the reader can see of the page, top to bottom, in this state. */
export const visible = (bar: Bar) => (bar === "shown" ? svh : lvh);

/** What each unit means for a `100` of it, in this state. */
export function units(bar: Bar) {
  return { vh: lvh, svh, lvh, dvh: visible(bar) };
}

/** How a box of a given height sits in the visible area: how much hangs off the bottom, and how much room is left over. */
export function fit(height: number, bar: Bar) {
  const room = visible(bar);
  return { overflow: Math.max(0, height - room), spare: Math.max(0, room - height) };
}
