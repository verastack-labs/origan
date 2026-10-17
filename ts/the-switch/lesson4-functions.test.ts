import { afterEach, describe, expect, it, vi } from "vitest";
import {
  demoCallbacks,
  demoFunctionType,
  demoGreet,
  demoOptionalParam,
  demoRest,
  demoScores,
  demoTuple,
  high,
  low,
  minMax,
  padLeft,
  total,
} from "./lesson4-functions";

afterEach(() => vi.restoreAllMocks());

/** What a demo printed, one entry per console.log. */
function printed(run: () => unknown): string[] {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  run();
  return log.mock.calls.map((call) => call.join(" "));
}

describe("lesson 4: the demos", () => {
  it("scores adds up to a number, not a string", () => {
    expect(printed(demoScores)).toEqual(["324"]);
  });

  it("a tuple destructures into its two parts", () => {
    expect(printed(demoTuple)).toEqual(["B2, seat 14"]);
  });

  it("greet has a default greeting", () => {
    expect(printed(demoGreet)).toEqual(["Hello, Asha", "Namaste, Asha"]);
  });

  it("callbacks get their parameter types from the array", () => {
    const { doubled, labels, checks } = demoCallbacks();
    expect(doubled).toEqual([20, 40, 60]);
    expect(labels).toEqual(["Rs 10", "Rs 20", "Rs 30"]);
    expect(checks).toEqual([true, true]);
  });

  it("a function can be passed as a value", () => {
    expect(printed(demoFunctionType)).toEqual(["180"]);
  });

  it("an optional parameter may be left out", () => {
    expect(printed(demoOptionalParam)).toEqual(["Asha", "Asha Rao"]);
  });

  it("a rest parameter gathers the rest", () => {
    expect(printed(demoRest)).toEqual(["10"]);
  });
});

describe("lesson 4: the practice solutions", () => {
  it("total adds a list of prices", () => {
    expect(total([10, 20, 30])).toBe(60);
    expect(total([])).toBe(0);
  });

  it("minMax returns the smallest and largest as a pair", () => {
    expect(minMax([3, 1, 2])).toEqual([1, 3]);
    expect(minMax([5])).toEqual([5, 5]);
    expect([low, high]).toEqual([1, 3]);
  });

  it("padLeft fills to the width, with a space unless told otherwise", () => {
    expect(padLeft("7", 3, "0")).toBe("007");
    expect(padLeft("7", 3)).toBe("  7");
    expect(padLeft("abc", 2)).toBe("abc");
  });

  it("padLeft treats an empty fill as an empty fill, which a default does not replace", () => {
    expect(padLeft("7", 3, "")).toBe("7");
  });
});
