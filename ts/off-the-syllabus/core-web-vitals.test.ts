import { describe, expect, it } from "vitest";
import {
  cumulativeLayoutShift,
  interactionToNextPaint,
  layoutShiftScore,
  percentile75,
  rate,
  thresholds,
} from "./core-web-vitals";

describe("the published thresholds", () => {
  it("are the web.dev numbers", () => {
    expect(thresholds.LCP).toEqual({ good: 2500, poor: 4000 });
    expect(thresholds.INP).toEqual({ good: 200, poor: 500 });
    expect(thresholds.CLS).toEqual({ good: 0.1, poor: 0.25 });
  });

  it("rates LCP: good up to 2.5 s, poor above 4 s", () => {
    expect(rate("LCP", 2500)).toBe("good");
    expect(rate("LCP", 2501)).toBe("needs improvement");
    expect(rate("LCP", 4000)).toBe("needs improvement");
    expect(rate("LCP", 4001)).toBe("poor");
  });

  it("rates INP: good up to 200 ms, poor above 500 ms", () => {
    expect(rate("INP", 200)).toBe("good");
    expect(rate("INP", 201)).toBe("needs improvement");
    expect(rate("INP", 500)).toBe("needs improvement");
    expect(rate("INP", 501)).toBe("poor");
  });

  it("rates CLS: good up to 0.1, poor above 0.25", () => {
    expect(rate("CLS", 0.1)).toBe("good");
    expect(rate("CLS", 0.11)).toBe("needs improvement");
    expect(rate("CLS", 0.25)).toBe("needs improvement");
    expect(rate("CLS", 0.26)).toBe("poor");
  });
});

describe("a layout shift", () => {
  it("is the impact fraction times the distance fraction", () => {
    expect(layoutShiftScore(0.6, 0.25)).toBeCloseTo(0.15, 10);
    expect(rate("CLS", layoutShiftScore(0.6, 0.25))).toBe("needs improvement");
  });
});

describe("cumulativeLayoutShift", () => {
  const shift = (startTime: number, value: number, hadRecentInput = false) => ({ startTime, value, hadRecentInput });

  it("is 0 when nothing moved", () => {
    expect(cumulativeLayoutShift([])).toBe(0);
  });

  it("adds shifts that come less than a second apart", () => {
    expect(cumulativeLayoutShift([shift(100, 0.05), shift(600, 0.04), shift(1400, 0.03)])).toBeCloseTo(0.12, 10);
  });

  it("starts a new burst after a gap of a second, and reports the biggest burst", () => {
    const shifts = [shift(100, 0.05), shift(2000, 0.08), shift(2500, 0.04)];
    expect(cumulativeLayoutShift(shifts)).toBeCloseTo(0.12, 10);
  });

  it("closes a burst after five seconds even if the shifts keep coming", () => {
    // Shifts at 0, 900, 1800 ... 6300. The burst that began at 0 stops taking shifts
    // after 5000, so 0 to 4500 (six shifts) are one burst and 5400 and later start another.
    const steady = Array.from({ length: 8 }, (_, i) => shift(i * 900, 0.01));
    expect(cumulativeLayoutShift(steady)).toBeCloseTo(0.06, 10);
  });

  it("ignores shifts that follow a tap or a key press", () => {
    expect(cumulativeLayoutShift([shift(100, 0.5, true), shift(300, 0.02)])).toBeCloseTo(0.02, 10);
  });
});

describe("interactionToNextPaint", () => {
  it("has nothing to say when nobody interacted", () => {
    expect(interactionToNextPaint([])).toBeUndefined();
  });

  it("is the slowest interaction when there are fewer than 50", () => {
    expect(interactionToNextPaint([40, 380, 120])).toBe(380);
  });

  it("forgives one outlier per 50 interactions", () => {
    const fortyEight = Array.from({ length: 48 }, () => 100);
    expect(interactionToNextPaint([...fortyEight, 900])).toBe(900);
    const fiftyTwo = [...Array.from({ length: 50 }, () => 100), 900, 700];
    expect(interactionToNextPaint(fiftyTwo)).toBe(700);
  });
});

describe("percentile75", () => {
  it("takes the visit three quarters of the way from best to worst", () => {
    expect(percentile75([1, 2, 3, 4])).toBe(3);
    expect(percentile75([10, 20, 30, 40, 50, 60, 70, 80])).toBe(60);
  });

  it("is a visit that really happened", () => {
    expect(percentile75([5])).toBe(5);
    expect(percentile75([])).toBeUndefined();
  });
});
