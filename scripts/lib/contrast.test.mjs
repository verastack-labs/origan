import { describe, expect, it } from "vitest";
import { channel, luminance, parseTokens, ratio } from "./contrast.mjs";

describe("luminance", () => {
  it("is 0 for black and 1 for white", () => {
    expect(luminance("#000000")).toBeCloseTo(0, 6);
    expect(luminance("#ffffff")).toBeCloseTo(1, 6);
  });

  it("never exceeds 1, which the first version of this did", () => {
    for (const hex of ["#e2b24a", "#5fd9a8", "#ff0000", "#00ff00", "#0000ff", "#13251f"]) {
      expect(luminance(hex)).toBeGreaterThanOrEqual(0);
      expect(luminance(hex)).toBeLessThanOrEqual(1);
    }
  });

  it("weights the channels per WCAG, green heaviest and blue lightest", () => {
    expect(luminance("#00ff00")).toBeGreaterThan(luminance("#ff0000"));
    expect(luminance("#ff0000")).toBeGreaterThan(luminance("#0000ff"));
  });

  it("linearises the blue channel rather than using it raw", () => {
    // Pure blue's luminance is the blue coefficient times its linearised value,
    // which is well under 0.1. Using the raw channel gave roughly 18.
    expect(luminance("#0000ff")).toBeCloseTo(0.0722, 3);
  });
});

describe("channel", () => {
  it("uses the linear segment below the threshold", () => {
    expect(channel(0)).toBe(0);
    expect(channel(5)).toBeCloseTo(5 / 255 / 12.92, 8);
  });

  it("returns a normalised value, never a 0-255 one", () => {
    for (let v = 0; v <= 255; v += 17) {
      expect(channel(v)).toBeLessThanOrEqual(1);
    }
  });
});

describe("ratio", () => {
  it("is 21:1 for black against white", () => {
    expect(ratio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });

  it("is 1:1 for a colour against itself", () => {
    expect(ratio("#5fd9a8", "#5fd9a8")).toBeCloseTo(1, 6);
  });

  it("does not care which argument is the background", () => {
    expect(ratio("#13251f", "#e2b24a")).toBeCloseTo(ratio("#e2b24a", "#13251f"), 10);
  });

  it("agrees with the known AA boundary grey on white", () => {
    // #767676 on white is the canonical 4.54:1 example.
    expect(ratio("#767676", "#ffffff")).toBeGreaterThan(4.5);
    expect(ratio("#767676", "#ffffff")).toBeLessThan(4.6);
  });
});

describe("parseTokens", () => {
  it("reads colour tokens and ignores everything else", () => {
    const css = `@theme {
      --color-ground: #0d1815;
      --color-survey-2: #3e7f6b;
      --radius-panel: 3px;
      --font-mono: var(--font-azeret);
    }`;
    expect(parseTokens(css)).toEqual({ ground: "#0d1815", "survey-2": "#3e7f6b" });
  });
});
