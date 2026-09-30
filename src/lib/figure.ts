/**
 * The hero's drawing: a triangulation figure.
 *
 * This is the third attempt at the first viewport, and the first two failed
 * the same way. A contour field and then a surface mesh both put dozens of
 * long lines across the whole frame, which is texture rather than a drawing,
 * and texture behind a headline is wallpaper however finely it is ruled.
 *
 * Triangulation is the other half of the discipline, and it is the geometric
 * half: a small number of fixed points, straight sights between them, and arcs
 * struck at measured distances. Perhaps a dozen marks in total, most of the
 * sheet left empty. Precision reads as expensive; density reads as busy.
 *
 * Everything is in the 1440x900 field the hero draws into, everything is a
 * straight line or a circular arc, and everything is deterministic, so the
 * server render and the client hydration agree.
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

/**
 * The four years, rising.
 *
 * Placed in the right of the frame rather than across it. The headline owns
 * the left, and a figure that has to be masked out of the words is a figure in
 * the wrong place. Kept inside x 820-1380 and y 270-680 so neither edge of the
 * slice crops a station at the viewport shapes this actually meets.
 *
 * They rise, but they do not rise in a straight line, and that is load
 * bearing rather than decorative. The first version of this put all four on
 * one slope, which meant every sight closing the figure lay exactly on top of
 * a leg already drawn and every bearing arc swept a full circle. A traverse
 * that runs dead straight has nothing to triangulate.
 */
export const STATIONS: Station[] = [
  { year: "I", name: "Direction", x: 868, y: 648, terminal: false },
  { year: "II", name: "Practice", x: 1032, y: 558, terminal: false },
  { year: "III", name: "Readiness", x: 1106, y: 402, terminal: false },
  { year: "IV", name: "Season", x: 1288, y: 292, terminal: true },
];

/** Where the party starts. Off the figure, because first year begins before us. */
export const ENTRY = { x: 742, y: 752 } as const;

/** The legs, as one polyline. Straight between stations, as a traverse is. */
export function traversePath(): string {
  return [ENTRY, ...STATIONS].map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join("");
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
    const length = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    total += length;
    legs.push(total);
  }

  return legs.map((cumulative) => cumulative / total);
}

/**
 * The sights that close the figure.
 *
 * A traverse on its own is a chain of measurements with nothing checking it.
 * Observing back to the stations you have already fixed is what turns it into
 * triangulation, and it is what makes the drawing read as geometry rather than
 * as a line chart with a route drawn on it. Two of them, not five: the point
 * is the triangle, not the web.
 */
export function sightLines(): string[] {
  const [one, two, three, four] = STATIONS;
  return [
    `M${four.x} ${four.y}L${two.x} ${two.y}`,
    `M${three.x} ${three.y}L${one.x} ${one.y}`,
  ];
}

/** An arc of `radius` about a centre, swept between two angles in degrees. */
export function arcPath(
  cx: number,
  cy: number,
  radius: number,
  fromDeg: number,
  toDeg: number,
): string {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const at = (deg: number) => ({
    x: round(cx + radius * Math.cos(rad(deg))),
    y: round(cy + radius * Math.sin(rad(deg))),
  });

  const start = at(fromDeg);
  const end = at(toDeg);
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
  const sweep = toDeg > fromDeg ? 1 : 0;

  return `M${start.x} ${start.y}A${radius} ${radius} 0 ${large} ${sweep} ${end.x} ${end.y}`;
}

/**
 * Range arcs struck about the terminal station: the distances measured out to
 * where the figure closes. Three, opening back down the route, which gives the
 * composition a focus without turning into a target.
 */
export function rangeArcs(): { d: string; radius: number }[] {
  const four = STATIONS[3];
  return [118, 214, 322].map((radius) => ({
    radius,
    d: arcPath(four.x, four.y, radius, 104, 238),
  }));
}

/**
 * The bearing observed at a station: the small arc a drawing puts between two
 * legs to say the angle between them was measured, not assumed.
 */
export function bearingArc(index: number, radius = 27): string {
  const points = [ENTRY, ...STATIONS];
  const here = points[index + 1];
  const back = points[index];
  const on = points[index + 2];

  const angle = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;

  const from = angle(here, on);
  // Sweep the interior angle, never the reflex one. An arc that goes the long
  // way round a nearly straight station draws a circle, which is how the
  // collinear version of this figure ended up with rings on it.
  let delta = angle(here, back) - from;
  while (delta <= -180) delta += 360;
  while (delta > 180) delta -= 360;

  return arcPath(here.x, here.y, radius, from, from + delta);
}

/**
 * The datum: one ruled line with ticks, low and to the right. A drawing of
 * measurements needs one line that is simply a measure, or nothing on the
 * sheet has a scale.
 */
export function datum(): { line: string; ticks: string[] } {
  // Kept well inside the field: a slice crops the bottom first, and the
  // earlier placement at y=806 put this line off the sheet at every viewport
  // shape the page actually meets.
  const y = 716;
  const from = 846;
  const to = 1352;
  const count = 8;

  const ticks: string[] = [];
  for (let i = 0; i <= count; i += 1) {
    const x = round(from + ((to - from) * i) / count);
    // Every fourth tick is drawn longer, the way a scale bar indexes itself.
    const length = i % 4 === 0 ? 11 : 6;
    ticks.push(`M${x} ${y}L${x} ${y - length}`);
  }

  return { line: `M${from} ${y}L${to} ${y}`, ticks };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
