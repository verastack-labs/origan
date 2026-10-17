import { afterEach, describe, expect, it, vi } from "vitest";
import {
  countVowels,
  demoAnnotations,
  demoAnyHole,
  demoFunctionLabels,
  demoInference,
  describePrice,
  toFahrenheit,
} from "./lesson2-types";

afterEach(() => vi.restoreAllMocks());

describe("lesson 2: the demos", () => {
  it("annotations and inference give the values the lesson shows", () => {
    expect(demoAnnotations()).toEqual([499, "Chai", true]);
    // The inferred types themselves are checked by tsc: see `Equal` in the file.
    expect(demoInference()).toEqual([true, true, true, true]);
  });

  it("area prints 20", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    expect(demoFunctionLabels()).toEqual([true]);
    expect(log).toHaveBeenCalledWith(20);
  });

  it("any switches the check off, and the crash comes back at runtime", () => {
    expect(() => demoAnyHole()).toThrow(TypeError);
    expect(() => demoAnyHole()).toThrow(/toFixed is not a function/);
  });
});

describe("lesson 2: the practice solutions", () => {
  it("toFahrenheit converts Celsius", () => {
    expect(toFahrenheit(100)).toBe(212);
    expect(toFahrenheit(0)).toBe(32);
    expect(toFahrenheit(-40)).toBe(-40);
  });

  it("describePrice says what it costs, and when it is sold out", () => {
    expect(describePrice("Chai", 15, true)).toBe("Chai costs 15");
    expect(describePrice("Samosa", 10, false)).toBe("Samosa costs 10 (sold out)");
  });

  it("countVowels counts a, e, i, o and u in either case", () => {
    expect(countVowels("Origan")).toBe(3);
    expect(countVowels("RHYTHM")).toBe(0);
    expect(countVowels("")).toBe(0);
    expect(countVowels("AEIOU aeiou")).toBe(10);
  });
});
