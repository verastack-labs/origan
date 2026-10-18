import { describe, expect, it } from "vitest";
import { bands, GOOD_MS, PIECE_MS, PIECES, POOR_MS, position, ratingOf, SCALE_MS, show, WORK_MS } from "./inp-demo";

describe("the slow-tap demo", () => {
  it("does the same total work whether or not it yields", () => {
    expect(PIECES * PIECE_MS).toBe(WORK_MS);
  });

  it("uses the article's lines: 200 ms is good, 500 ms is poor", () => {
    expect(GOOD_MS).toBe(200);
    expect(POOR_MS).toBe(500);
    expect(ratingOf(200)).toBe("good");
    expect(ratingOf(201)).toBe("needs improvement");
    expect(ratingOf(500)).toBe("needs improvement");
    expect(ratingOf(501)).toBe("poor");
  });

  it("blocks long enough to be poor, and each piece is short enough to be good", () => {
    expect(ratingOf(WORK_MS)).toBe("poor");
    expect(ratingOf(PIECE_MS)).toBe("good");
  });

  it("puts a reading on the meter in proportion, and never off the ends", () => {
    expect(position(0)).toBe(0);
    expect(position(SCALE_MS / 2)).toBe(50);
    expect(position(SCALE_MS * 3)).toBe(100);
    expect(position(-5)).toBe(0);
  });

  it("draws three bands that fill the meter exactly", () => {
    const [good, middle, poor] = bands();
    expect(good + middle + poor).toBeCloseTo(100, 10);
    expect(good).toBeCloseTo(25, 10);
    expect(good + middle).toBeCloseTo(62.5, 10);
  });

  it("shows whole milliseconds", () => {
    expect(show(312.4)).toBe("312 ms");
    expect(show(24.6)).toBe("25 ms");
  });
});
