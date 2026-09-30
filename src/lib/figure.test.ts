import { describe, expect, it } from "vitest";
import {
  arcPath,
  bearingArc,
  datum,
  rangeArcs,
  sightLines,
  STATIONS,
  stationDelays,
  traversePath,
} from "./figure";

const numbers = (d: string) => d.match(/-?\d+(\.\d+)?/g)!.map(Number);

describe("the figure's placement", () => {
  it("stays in the right of the frame, clear of the headline", () => {
    // The whole point of this version. The headline owns the left of the
    // 1440-wide field; a mark to the left of this is a mark in the words.
    for (const s of STATIONS) {
      expect(s.x, `station ${s.year} is too far left`).toBeGreaterThan(820);
    }
  });

  it("keeps every station inside the band a slice always shows", () => {
    // A wide viewport crops the field top and bottom, a narrow one crops the
    // sides. These bounds are what survives both.
    for (const s of STATIONS) {
      expect(s.x, `station ${s.year} runs off the right`).toBeLessThan(1380);
      expect(s.y).toBeGreaterThan(270);
      expect(s.y).toBeLessThan(680);
    }
  });

  it("rises, one year to the next", () => {
    for (let i = 1; i < STATIONS.length; i += 1) {
      expect(STATIONS[i].y, `${STATIONS[i].year} does not rise`).toBeLessThan(STATIONS[i - 1].y);
      expect(STATIONS[i].x).toBeGreaterThan(STATIONS[i - 1].x);
    }
  });

  it("marks exactly one terminal station, and it is the last", () => {
    expect(STATIONS.filter((s) => s.terminal)).toHaveLength(1);
    expect(STATIONS[STATIONS.length - 1].terminal).toBe(true);
  });

  it("does not put the stations on one straight line", () => {
    // The bug this replaced. Four collinear stations meant every closing
    // sight lay exactly along a leg already drawn, so the figure closed no
    // triangle, and every bearing arc swept a full circle instead of an angle.
    const [a, , , d] = STATIONS;
    const slope = (d.y - a.y) / (d.x - a.x);

    const offsets = STATIONS.slice(1, 3).map((s) => s.y - (a.y + slope * (s.x - a.x)));
    for (const offset of offsets) {
      expect(Math.abs(offset), "a station sits on the line from I to IV").toBeGreaterThan(18);
    }
    // And they must fall on opposite sides, or the figure bows rather than
    // doglegs and the two sights end up nearly parallel to the legs again.
    expect(Math.sign(offsets[0])).not.toBe(Math.sign(offsets[1]));
  });

  it("stays minimal", () => {
    // The count is the design. Two previous versions failed by drawing
    // dozens of lines; if this creeps back up, it has failed the same way.
    const marks = rangeArcs().length + sightLines().length + STATIONS.length + 1;
    expect(marks).toBeLessThanOrEqual(12);
  });
});

describe("traversePath", () => {
  it("visits the entry and every station in order", () => {
    const n = numbers(traversePath());
    expect(n).toHaveLength((STATIONS.length + 1) * 2);
    expect(n.slice(2)).toEqual(STATIONS.flatMap((s) => [s.x, s.y]));
  });

  it("is deterministic", () => {
    expect(traversePath()).toBe(traversePath());
  });
});

describe("stationDelays", () => {
  it("gives one fraction per station, increasing, ending at the last", () => {
    const delays = stationDelays();
    expect(delays).toHaveLength(STATIONS.length);
    for (let i = 1; i < delays.length; i += 1) {
      expect(delays[i]).toBeGreaterThan(delays[i - 1]);
    }
    expect(delays[delays.length - 1]).toBeCloseTo(1);
  });

  it("starts after the line has begun drawing", () => {
    expect(stationDelays()[0]).toBeGreaterThan(0);
  });
});

describe("arcPath", () => {
  it("starts and ends on the circle it describes", () => {
    // M sx sy A rx ry rotation large sweep ex ey
    const [sx, sy, r, , , , , ex, ey] = numbers(arcPath(100, 100, 40, 0, 90));
    expect(r).toBe(40);
    expect(Math.hypot(sx - 100, sy - 100)).toBeCloseTo(40, 1);
    expect(Math.hypot(ex - 100, ey - 100)).toBeCloseTo(40, 1);
  });

  it("sets the large-arc flag only past a half turn", () => {
    expect(arcPath(0, 0, 10, 0, 90)).toContain("0 1 ");
    expect(arcPath(0, 0, 10, 0, 270)).toContain("1 1 ");
  });
});

describe("rangeArcs", () => {
  it("strikes increasing radii about the terminal station", () => {
    const radii = rangeArcs().map((a) => a.radius);
    expect(radii).toEqual([...radii].sort((a, b) => a - b));
    expect(new Set(radii).size).toBe(radii.length);
  });

  it("keeps the widest arc on the sheet", () => {
    const four = STATIONS[3];
    const widest = Math.max(...rangeArcs().map((a) => a.radius));
    // Swept down and to the left, so the right edge is the one at risk.
    expect(four.x + widest).toBeLessThan(1700);
    expect(four.y - widest).toBeGreaterThan(-120);
  });
});

describe("sightLines", () => {
  it("closes the figure between stations that exist", () => {
    const coordinates = new Set(STATIONS.map((s) => `${s.x},${s.y}`));
    for (const line of sightLines()) {
      const [ax, ay, bx, by] = numbers(line);
      expect(coordinates.has(`${ax},${ay}`)).toBe(true);
      expect(coordinates.has(`${bx},${by}`)).toBe(true);
    }
  });

  it("does not simply retrace a leg of the traverse", () => {
    // A sight between consecutive stations is already drawn as a leg, and
    // doubling it just thickens a line rather than closing a triangle.
    const order = new Map(STATIONS.map((s, i) => [`${s.x},${s.y}`, i]));
    for (const line of sightLines()) {
      const [ax, ay, bx, by] = numbers(line);
      const gap = Math.abs(order.get(`${ax},${ay}`)! - order.get(`${bx},${by}`)!);
      expect(gap).toBeGreaterThan(1);
    }
  });
});

describe("bearingArc", () => {
  it("sits on the station it belongs to", () => {
    const [sx, sy, r] = numbers(bearingArc(1));
    expect(Math.hypot(sx - STATIONS[1].x, sy - STATIONS[1].y)).toBeCloseTo(r, 1);
  });

  it("sweeps the interior angle, never the reflex one", () => {
    // A bearing arc that takes the long way round draws a ring rather than an
    // angle, which is exactly what it did before the sweep was normalised.
    for (const index of [1, 2]) {
      const [, , , , , large] = numbers(bearingArc(index));
      expect(large, `station ${index} sweeps past a half turn`).toBe(0);
    }
  });

  it("opens wide enough to read as an angle", () => {
    for (const index of [1, 2]) {
      const [sx, sy, r, , , , , ex, ey] = numbers(bearingArc(index));
      const chord = Math.hypot(ex - sx, ey - sy);
      // Chord over radius: below about 0.5 the arc is a smudge on the station.
      expect(chord / r, `station ${index} has a near-zero bearing`).toBeGreaterThan(0.5);
    }
  });
});

describe("datum", () => {
  it("stays inside the band a slice always shows", () => {
    const [, y] = numbers(datum().line);
    expect(y).toBeLessThan(740);
  });

  it("rules one line with ticks standing on it", () => {
    const { line, ticks } = datum();
    const [, y] = numbers(line);
    expect(ticks.length).toBeGreaterThan(4);
    for (const tick of ticks) {
      const [tx, ty, tx2, ty2] = numbers(tick);
      expect(tx).toBe(tx2);
      expect(ty).toBe(y);
      // Ticks stand up off the line, never hang below it.
      expect(ty2).toBeLessThan(ty);
    }
  });

  it("indexes every fourth tick longer", () => {
    const lengths = datum().ticks.map((t) => {
      const [, ty, , ty2] = numbers(t);
      return ty - ty2;
    });
    expect(lengths[0]).toBeGreaterThan(lengths[1]);
    expect(lengths[4]).toBe(lengths[0]);
  });
});
