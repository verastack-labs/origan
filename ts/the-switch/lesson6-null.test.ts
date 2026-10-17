import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cityLabel,
  demoFind,
  demoNonNull,
  demoNonNullSafer,
  demoNullish,
  demoOptionalChain,
  demoTiffin,
  narrowingChecks,
  payTo,
  scoreLine,
} from "./lesson6-null";

afterEach(() => vi.restoreAllMocks());

/** What a demo printed, one entry per console.log. */
function printed(run: () => unknown): string[] {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  run();
  return log.mock.calls.map((call) => call.join(" "));
}

describe("lesson 6: the demos", () => {
  it("an empty tiffin is checked before it is opened", () => {
    expect(printed(demoTiffin)).toEqual(["The tiffin is empty"]);
  });

  it("find may give nothing, and the code says what then", () => {
    expect(printed(demoFind)).toEqual(["Asha", "No such student"]);
  });

  it("optional chaining gives undefined instead of crashing", () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    demoOptionalChain();
    expect(log.mock.calls).toEqual([["Pune"], [undefined]]);
  });

  it("?? keeps a zero, because zero is a real score", () => {
    expect(printed(demoNullish)).toEqual(["Runs: 82", "Runs: 0", "Runs: did not bat"]);
  });

  it("! is fair after the row was just created", () => {
    expect(printed(demoNonNull)).toEqual(["1", "2"]);
  });

  it("?? 0 gives the same answer with no promise to keep", () => {
    expect(printed(demoNonNullSafer)).toEqual(["1", "2"]);
  });

  it("narrowing leaves exactly the type the lesson says", () => {
    expect(narrowingChecks()).toEqual([true, true, true, true]);
  });
});

describe("lesson 6: the practice solutions", () => {
  it("cityLabel survives a missing address or city", () => {
    expect(cityLabel({ name: "Asha", address: { city: "Pune" } })).toBe("Pune");
    expect(cityLabel({ name: "Ravi" })).toBe("Unknown city");
    expect(cityLabel({ name: "Meena", address: {} })).toBe("Unknown city");
  });

  it("scoreLine keeps a duck as a score", () => {
    expect(scoreLine({ name: "Kohli", runs: 0 })).toBe("Kohli: 0");
    expect(scoreLine({ name: "Bumrah" })).toBe("Bumrah: did not bat");
  });

  it("payTo says so when there is no such contact", () => {
    expect(payTo("Asha")).toBe("Paying asha@upi");
    expect(payTo("Meena")).toBe("No contact named Meena");
  });
});
