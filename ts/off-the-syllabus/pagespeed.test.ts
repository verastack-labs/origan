import { describe, expect, it } from "vitest";
import { coreWebVitalsAssessment, median, performanceScore, scoreBand, weights } from "./pagespeed";

describe("the lab score bands", () => {
  it("is green from 90, orange from 50, red below", () => {
    expect(scoreBand(100)).toBe("good");
    expect(scoreBand(90)).toBe("good");
    expect(scoreBand(89)).toBe("needs improvement");
    expect(scoreBand(50)).toBe("needs improvement");
    expect(scoreBand(49)).toBe("poor");
    expect(scoreBand(0)).toBe("poor");
  });
});

describe("the Lighthouse 10 weights", () => {
  it("are the ones in the scoring docs and add up to a whole", () => {
    expect(weights).toEqual({ FCP: 0.1, SI: 0.1, LCP: 0.25, TBT: 0.3, CLS: 0.25 });
    expect(Object.values(weights).reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
  });

  it("gives 100 for perfect metrics and 0 for none", () => {
    expect(performanceScore({ FCP: 1, SI: 1, LCP: 1, TBT: 1, CLS: 1 })).toBe(100);
    expect(performanceScore({ FCP: 0, SI: 0, LCP: 0, TBT: 0, CLS: 0 })).toBe(0);
  });

  it("is a weighted average, so Total Blocking Time moves it most", () => {
    const base = { FCP: 1, SI: 1, LCP: 1, TBT: 1, CLS: 1 };
    expect(performanceScore({ ...base, TBT: 0 })).toBe(70);
    expect(performanceScore({ ...base, FCP: 0 })).toBe(90);
    expect(performanceScore({ ...base, LCP: 0 })).toBe(75);
  });

  it("works out a mixed example", () => {
    // 0.1*0.9 + 0.1*0.8 + 0.25*0.5 + 0.3*0.6 + 0.25*0.9 = 0.7
    expect(performanceScore({ FCP: 0.9, SI: 0.8, LCP: 0.5, TBT: 0.6, CLS: 0.9 })).toBe(70);
  });
});

describe("the Core Web Vitals assessment", () => {
  it("passes when all three are good", () => {
    expect(coreWebVitalsAssessment({ LCP: "good", CLS: "good", INP: "good" })).toBe("passed");
  });

  it("fails when any one is not good", () => {
    expect(coreWebVitalsAssessment({ LCP: "good", CLS: "good", INP: "needs improvement" })).toBe("failed");
    expect(coreWebVitalsAssessment({ LCP: "poor", CLS: "good", INP: "good" })).toBe("failed");
    expect(coreWebVitalsAssessment({ LCP: "good", CLS: "needs improvement", INP: "good" })).toBe("failed");
  });

  it("lets LCP and CLS decide when there is not enough INP data", () => {
    expect(coreWebVitalsAssessment({ LCP: "good", CLS: "good" })).toBe("passed");
    expect(coreWebVitalsAssessment({ LCP: "poor", CLS: "good" })).toBe("failed");
  });

  it("cannot be assessed without LCP or CLS", () => {
    expect(coreWebVitalsAssessment({ CLS: "good", INP: "good" })).toBe("cannot be assessed");
    expect(coreWebVitalsAssessment({ LCP: "good", INP: "good" })).toBe("cannot be assessed");
    expect(coreWebVitalsAssessment({})).toBe("cannot be assessed");
  });
});

describe("the median of several runs", () => {
  it("is the middle run", () => {
    expect(median([71, 64, 88, 70, 69])).toBe(70);
  });

  it("is the mean of the middle two for an even number of runs", () => {
    expect(median([60, 70, 80, 90])).toBe(75);
  });

  it("does not move when one run is wild, which a mean would", () => {
    expect(median([70, 71, 69, 70, 12])).toBe(70);
  });

  it("is undefined for no runs, and does not change its input", () => {
    expect(median([])).toBeUndefined();
    const runs = [3, 1, 2];
    median(runs);
    expect(runs).toEqual([3, 1, 2]);
  });
});
