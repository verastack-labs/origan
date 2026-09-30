import { height } from "./contours";

/**
 * A wireframe model of the same ground the contours were traced from.
 *
 * Contour lines are what a surveyor *plots*, but at the density a full-bleed
 * hero needs they read as texture rather than as terrain, which is a polite
 * way of saying wallpaper. A surface model is what a surveyor *builds* from
 * the same readings, and it has the one thing the contours never had: a
 * direction to look in. Rows recede, the relief reads as relief, and the ridge
 * the traverse climbs is visible as a ridge.
 *
 * Everything is in the 1440x900 field the hero draws into, and everything is
 * deterministic, so the server render and the client hydration agree.
 */

export type MeshRow = {
  /** SVG path data for one profile line across the surface. */
  d: string;
  /** 0 at the farthest row, 1 at the nearest. Drives depth cueing. */
  t: number;
};

export type MeshOptions = {
  /** Profile lines across the surface, far to near. */
  rows?: number;
  /** Samples along each profile. Higher is smoother and heavier. */
  columns?: number;
};

/**
 * The frame the surface sits in.
 *
 * It leans right and stops well short of the lower left, because that corner
 * belongs to the headline. Composing the drawing to leave room is worth more
 * than masking it out afterwards: there is no veil over the words, and no
 * half-faded linework running behind them.
 */
const FRAME = {
  /** Screen y of the farthest and nearest rows. */
  yFar: 118,
  yNear: 560,
  /** Horizontal centre of the farthest and nearest rows. */
  centreFar: 940,
  centreNear: 1180,
  /** Half the width of the farthest and nearest rows. */
  halfFar: 360,
  halfNear: 560,
  /** How much relief is expressed, far and near. */
  amplitudeFar: 46,
  amplitudeNear: 104,
  /** The band of the terrain the rows sample, in field coordinates. */
  worldTop: 120,
  worldBottom: 760,
} as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Rows bunch up toward the horizon rather than spacing evenly, which is what
 * makes the surface read as receding rather than as a stack of lines.
 */
function depthEase(t: number): number {
  return t ** 1.55;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/** The profile lines, far to near. */
export function meshRows({ rows = 26, columns = 64 }: MeshOptions = {}): MeshRow[] {
  if (rows < 2 || columns < 2) {
    throw new Error("A surface needs at least two rows and two columns.");
  }

  const out: MeshRow[] = [];

  for (let r = 0; r < rows; r += 1) {
    const t = r / (rows - 1);
    const points: string[] = [];

    for (let c = 0; c < columns; c += 1) {
      const u = c / (columns - 1);
      const { x, y } = project(u, t);
      points.push(`${round(x)} ${round(y)}`);
    }

    out.push({ d: `M${points.join("L")}`, t });
  }

  return out;
}

/**
 * The cross lines. Far fewer than the rows: enough to read as a mesh rather
 * than as contour bands, not so many that the surface turns back into texture.
 */
export function meshColumns({ rows = 26, columns = 9 }: MeshOptions = {}): MeshRow[] {
  if (rows < 2 || columns < 2) {
    throw new Error("A surface needs at least two rows and two columns.");
  }

  const out: MeshRow[] = [];

  for (let c = 0; c < columns; c += 1) {
    const u = c / (columns - 1);
    const points: string[] = [];

    for (let r = 0; r < rows; r += 1) {
      const { x, y } = project(u, r / (rows - 1));
      points.push(`${round(x)} ${round(y)}`);
    }

    out.push({ d: `M${points.join("L")}`, t: u });
  }

  return out;
}

/**
 * Put one sample of the surface on the sheet.
 *
 * `u` runs left to right across a row, `t` runs from the farthest row to the
 * nearest. Exported so the tests can assert the framing directly rather than
 * by parsing path strings back apart.
 */
export function project(u: number, t: number): { x: number; y: number } {
  const d = depthEase(t);

  const centre = lerp(FRAME.centreFar, FRAME.centreNear, d);
  const half = lerp(FRAME.halfFar, FRAME.halfNear, d);
  const base = lerp(FRAME.yFar, FRAME.yNear, d);
  const amplitude = lerp(FRAME.amplitudeFar, FRAME.amplitudeNear, d);

  const worldX = u * 1440;
  const worldY = lerp(FRAME.worldTop, FRAME.worldBottom, t);

  return {
    x: centre + (u - 0.5) * 2 * half,
    y: base - height(worldX, worldY) * amplitude,
  };
}

/**
 * Where the surface's left edge sits at its widest, which is the number that
 * decides whether the drawing collides with the headline. Exported so a test
 * can hold the composition to it.
 */
export function nearestLeftEdge(): number {
  return project(0, 1).x;
}
