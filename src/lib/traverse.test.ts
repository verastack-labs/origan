import { describe, expect, it } from "vitest";
import { SUMMIT } from "./contours";
import { STATIONS, stationDelays, traversePath } from "./traverse";

describe("STATIONS", () => {
  it("has one station per year", () => {
    expect(STATIONS.map((s) => s.year)).toEqual(["I", "II", "III", "IV"]);
  });

  it("climbs the whole way, since y grows downward", () => {
    for (let i = 1; i < STATIONS.length; i += 1) {
      expect(STATIONS[i].y).toBeLessThan(STATIONS[i - 1].y);
      expect(STATIONS[i].x).toBeGreaterThan(STATIONS[i - 1].x);
    }
  });

  it("ends on the summit the contours are drawn around", () => {
    const last = STATIONS[STATIONS.length - 1];
    expect(last.terminal).toBe(true);
    expect(Math.abs(last.x - SUMMIT.x)).toBeLessThan(40);
    expect(Math.abs(last.y - SUMMIT.y)).toBeLessThan(40);
  });

  it("marks exactly one terminal station", () => {
    expect(STATIONS.filter((s) => s.terminal)).toHaveLength(1);
  });
});

describe("traversePath", () => {
  it("is a polyline through entry and every station", () => {
    const d = traversePath();
    expect(d.startsWith("M")).toBe(true);
    expect(d.match(/L/g)).toHaveLength(STATIONS.length);
    expect(d).not.toMatch(/NaN|undefined/);
  });
});

describe("stationDelays", () => {
  const delays = stationDelays();

  it("gives one fraction per station", () => {
    expect(delays).toHaveLength(STATIONS.length);
  });

  it("increases along the route and ends at the end", () => {
    for (let i = 1; i < delays.length; i += 1) {
      expect(delays[i]).toBeGreaterThan(delays[i - 1]);
    }
    expect(delays[delays.length - 1]).toBeCloseTo(1, 10);
  });

  it("stays within the drawing of the line", () => {
    delays.forEach((d) => {
      expect(d).toBeGreaterThan(0);
      expect(d).toBeLessThanOrEqual(1);
    });
  });
});
