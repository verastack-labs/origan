import { describe, expect, it } from "vitest";
import { height, SUMMIT } from "./contours";

describe("height", () => {
  it("is deterministic", () => {
    expect(height(120, 80)).toBe(height(120, 80));
  });

  it("rises to a summit rather than staying even", () => {
    const atSummit = height(SUMMIT.x, SUMMIT.y);
    const away = height(SUMMIT.x - 700, SUMMIT.y + 500);
    expect(atSummit).toBeGreaterThan(away + 0.8);
  });

  it("stays inside the default level range, or the summit gets no rings", () => {
    let min = Infinity;
    let max = -Infinity;
    for (let x = 0; x <= 1440; x += 17) {
      for (let y = 0; y <= 900; y += 13) {
        const v = height(x, y);
        if (v < min) min = v;
        if (v > max) max = v;
      }
    }
    // The mesh scales relief by these bounds, so a runaway value would
    // push a row off the sheet.
    expect(min).toBeGreaterThan(-1.7);
    expect(max).toBeLessThan(2.7);
  });
});
