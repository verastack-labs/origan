import { describe, expect, it } from "vitest";
import { chainageFromProgress, formatChainage, TOTAL_METRES } from "./chainage";

describe("formatChainage", () => {
  it("pads metres to three digits", () => {
    expect(formatChainage(0)).toBe("0+000");
    expect(formatChainage(7)).toBe("0+007");
    expect(formatChainage(70)).toBe("0+070");
  });

  it("rolls over at each kilometre", () => {
    expect(formatChainage(999)).toBe("0+999");
    expect(formatChainage(1000)).toBe("1+000");
    expect(formatChainage(2184)).toBe("2+184");
  });

  it("clamps to the surveyed length rather than running past it", () => {
    expect(formatChainage(-500)).toBe("0+000");
    expect(formatChainage(TOTAL_METRES + 500)).toBe("3+000");
  });
});

describe("chainageFromProgress", () => {
  it("maps the ends of the page to the ends of the line", () => {
    expect(chainageFromProgress(0)).toBe("0+000");
    expect(chainageFromProgress(1)).toBe("3+000");
  });

  it("maps the middle to the middle", () => {
    expect(chainageFromProgress(0.5)).toBe("1+500");
  });

  it("survives a division by zero upstream", () => {
    expect(chainageFromProgress(Number.NaN)).toBe("0+000");
    expect(chainageFromProgress(Number.POSITIVE_INFINITY)).toBe("3+000");
  });
});
