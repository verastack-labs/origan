import { describe, expect, it } from "vitest";
import { layoutShiftScore, rate } from "../../../ts/off-the-syllabus/core-web-vitals";
import { AD_H, adShift, FRAME, GAP, layout, moved, shiftOf } from "./cls-demo";

describe("the layout shift demo", () => {
  it("leaves the blocks above the ad where they were, and moves everything below it", () => {
    const before = layout({ adArrived: false, reserved: false });
    const after = layout({ adArrived: true, reserved: false });
    expect(moved(before, after).map((m) => m.id)).toEqual(["seat", "pay", "cancel"]);
    for (const m of moved(before, after)) expect(m.dy).toBe(AD_H + GAP);
  });

  it("does not move anything when the space was reserved", () => {
    const before = layout({ adArrived: false, reserved: true });
    const after = layout({ adArrived: true, reserved: true });
    expect(after).toEqual(before);
    expect(moved(before, after)).toEqual([]);
    const s = adShift(true);
    expect(s.score).toBe(0);
    expect(s.rating).toBe("good");
  });

  it("scores the shift as impact fraction times distance fraction, using the article's function", () => {
    const s = adShift(false);
    expect(s.score).toBeCloseTo(layoutShiftScore(s.impact, s.distance), 12);
    expect(s.rating).toBe(rate("CLS", s.score));
  });

  it("works the numbers out by hand: the moving blocks, the share of the frame, the distance", () => {
    // Seat, pay and cancel sit at 124 to 220, 232 to 276 and 288 to 324. The ad pushes each down by 90 + 12 = 102.
    const before = layout({ adArrived: false, reserved: false });
    const after = layout({ adArrived: true, reserved: false });
    const spans = (boxes: typeof before) => boxes.filter((b) => ["seat", "pay", "cancel"].includes(b.id)).map((b) => [b.y, b.y + b.h]);
    expect(spans(before)).toEqual([[124, 220], [232, 276], [288, 324]]);
    expect(spans(after)).toEqual([[226, 322], [334, 378], [390, 426]]);
    // Everything the three covered, before and after, clipped to the 400-high frame:
    // 124 to 220 (96), then 226 to 324 where the moved seat meets the old cancel (98),
    // then the moved pay, 334 to 378 (44), then the moved cancel, 390 to the frame's bottom (10).
    const covered = 96 + 98 + 44 + 10;
    const impact = (covered * 248) / (FRAME.w * FRAME.h);
    expect(shiftOf(before, after).impact).toBeCloseTo(impact, 12);
    expect(shiftOf(before, after).distance).toBeCloseTo(102 / 400, 12);
    // About 0.55 of the frame, times about 0.26 of the way: 0.14.
    expect(shiftOf(before, after).score).toBeCloseTo(0.1403, 3);
  });

  it("is past the good line without reserved space, so the demo shows what it means to", () => {
    const s = adShift(false);
    expect(s.score).toBeGreaterThan(0.1);
    expect(s.rating).toBe("needs improvement");
  });

  it("keeps the Pay button inside the frame before and after the ad, so the jump can be seen", () => {
    for (const adArrived of [false, true]) {
      const pay = layout({ adArrived, reserved: false }).find((b) => b.id === "pay");
      expect(pay && pay.y + pay.h).toBeLessThan(FRAME.h);
    }
  });
});
