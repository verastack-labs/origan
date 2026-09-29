import { SUMMIT } from "./contours";

/**
 * The traverse: the route a survey party actually walks, straight legs between
 * fixed stations, ending on the summit.
 *
 * This is the object the hero was missing. Contours alone are texture; a
 * traverse across them is a journey, with the four years as its stations and
 * placement as the point it climbs to. It draws itself on load, which is also
 * the only motion in the hero that does not wait for a pointer.
 */

export type Station = {
  /** Year numeral, as a survey drawing would letter it. */
  year: string;
  name: string;
  x: number;
  y: number;
  /** The last station is the destination and is drawn solid. */
  terminal: boolean;
};

/** Where the party starts, off the left edge, because first year begins before us. */
const ENTRY = { x: -60, y: 812 } as const;

export const STATIONS: Station[] = [
  { year: "I", name: "Direction", x: 236, y: 726, terminal: false },
  { year: "II", name: "Practice", x: 522, y: 604, terminal: false },
  { year: "III", name: "Readiness", x: 806, y: 448, terminal: false },
  { year: "IV", name: "Season", x: SUMMIT.x, y: SUMMIT.y + 8, terminal: true },
];

/** The legs, as one polyline. Straight between stations, as a traverse is. */
export function traversePath(): string {
  const points = [ENTRY, ...STATIONS];
  return points.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join("");
}

/**
 * Cumulative length of each leg as a fraction of the whole, so the station
 * markers can appear as the line reaches them rather than all at once.
 */
export function stationDelays(): number[] {
  const points = [ENTRY, ...STATIONS];
  const legs: number[] = [];
  let total = 0;

  for (let i = 1; i < points.length; i += 1) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    const length = Math.hypot(dx, dy);
    total += length;
    legs.push(total);
  }

  return legs.map((cumulative) => cumulative / total);
}
