import { afterEach, describe, expect, it, vi } from "vitest";
import {
  demoAny,
  demoBox,
  demoBuiltIn,
  demoConstraint,
  demoCourier,
  demoDefault,
  demoExplicit,
  demoFirst,
  demoGetField,
  demoPair,
  inferenceChecks,
  last,
  mapBox,
  swap,
} from "./lesson7-generics";

afterEach(() => vi.restoreAllMocks());

/** What a demo printed, one entry per console.log. */
function printed(run: () => unknown): string[] {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  run();
  return log.mock.calls.map((call) => call.join(" "));
}

describe("lesson 7: the demos", () => {
  it("the courier hands back exactly what it was given", () => {
    expect(printed(demoCourier)).toEqual(["LADDOO", "43"]);
  });

  it("the any version works too, which is exactly the problem", () => {
    expect(printed(demoAny)).toEqual(["43"]);
  });

  it("first keeps the item type, and admits an empty list", () => {
    expect(printed(demoFirst)).toEqual(["90", "ASHA"]);
    expect(printed(demoExplicit)).toEqual([""]);
  });

  it("pair keeps one type per slot", () => {
    expect(demoPair()).toEqual(["Asha", 21]);
  });

  it("a constraint lets longest read length", () => {
    expect(printed(demoConstraint)).toEqual(["coffee", "1,2,3"]);
  });

  it("getField reads a property by name", () => {
    expect(printed(demoGetField)).toEqual(["Asha", "21"]);
  });

  it("a Box holds whatever you say it holds", () => {
    expect(printed(demoBox)).toEqual(["8", "CALL AMMA"]);
  });

  it("the built-in generic types are generics too", () => {
    const { scores, ages, later } = demoBuiltIn();
    expect(scores).toEqual([90, 85]);
    expect(ages.get("Asha")).toBe(21);
    return expect(later).resolves.toBe("done");
  });

  it("a default type fills in when none is given", () => {
    expect(demoDefault()).toEqual({
      text: { ok: true, value: "saved" },
      count: { ok: true, value: 3 },
    });
  });

  it("inference gives each call the type the lesson says", () => {
    expect(inferenceChecks()).toEqual([true, true, true, true]);
  });
});

describe("lesson 7: the practice solutions", () => {
  it("last gives the final item, or undefined", () => {
    expect(last([1, 2, 3])).toBe(3);
    expect(last(["a", "b"])).toBe("b");
    expect(last([])).toBeUndefined();
  });

  it("swap flips a pair and flips the types with it", () => {
    expect(swap(["Asha", 21])).toEqual([21, "Asha"]);
  });

  it("mapBox changes what is inside and keeps the box", () => {
    expect(mapBox({ value: 21 }, (n) => n + 1)).toEqual({ value: 22 });
    expect(mapBox({ value: "chai" }, (s) => s.length)).toEqual({ value: 4 });
  });
});
