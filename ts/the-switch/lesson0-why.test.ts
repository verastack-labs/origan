import { afterEach, describe, expect, it, vi } from "vitest";
import { area, demoRuntime, demoStrip, double, greet } from "./lesson0-why";

afterEach(() => vi.restoreAllMocks());

describe("lesson 0: the runtime demo", () => {
  it("compiles, and still crashes, because types are gone by the time it runs", () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    expect(() => demoRuntime()).toThrow(TypeError);
    expect(() => demoRuntime()).toThrow(/toUpperCase/);
  });
});

describe("lesson 0: the type strip demo", () => {
  it("prints the total of two cups of chai", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    demoStrip();
    expect(log.mock.calls).toEqual([[30]]);
  });
});

describe("lesson 0: the practice solutions", () => {
  it("double adds a number to itself", () => {
    expect(double(21)).toBe(42);
    expect(double(0)).toBe(0);
    expect(double(-4)).toBe(-8);
  });

  it("area multiplies width by height", () => {
    expect(area(5, 4)).toBe(20);
    expect(area(0, 9)).toBe(0);
  });

  it("greet says hello to a name", () => {
    expect(greet("Asha")).toBe("Hello, Asha");
    expect(greet("")).toBe("Hello, ");
  });
});
