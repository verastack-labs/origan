import { afterEach, describe, expect, it, vi } from "vitest";
import {
  demoCombine,
  demoMapped,
  demoOmit,
  demoOmitLoose,
  demoPartial,
  demoPick,
  demoReadonly,
  demoRecord,
  demoRequired,
  demoReturnType,
  patch,
  priceOf,
  publicCard,
  utilityChecks,
} from "./lesson8-utility";

afterEach(() => vi.restoreAllMocks());

/** The arguments of every console.log a demo made, one entry per call. */
function logged(run: () => unknown): unknown[] {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  run();
  return log.mock.calls.map((args) => (args.length === 1 ? args[0] : args));
}

describe("lesson 8: the demos", () => {
  it("Partial lets an update carry only what changed", () => {
    expect(logged(demoPartial)).toEqual(["Asha Rao", "asha@example.com"]);
  });

  it("Partial is a mapped type that makes every property optional", () => {
    expect(demoMapped()).toEqual({ name: "Asha Rao" });
  });

  it("Required fills in every setting", () => {
    expect(logged(demoRequired)).toEqual([
      { theme: "dark", fontSize: 14 },
      { theme: "dark", fontSize: 18 },
    ]);
  });

  it("Pick keeps only the named properties", () => {
    expect(logged(demoPick)).toEqual([{ id: 1, name: "Asha" }]);
  });

  it("Omit describes a profile without the password, and toPublic really removes it", () => {
    expect(logged(demoOmit)).toEqual([{ id: 1, name: "Asha", email: "asha@example.com" }]);
  });

  it("Record needs every key", () => {
    expect(logged(demoRecord)).toEqual([30]);
  });

  it("Readonly can still be read", () => {
    expect(logged(demoReadonly)).toEqual(["Asha"]);
  });

  it("ReturnType borrows the type of a function result", () => {
    expect(logged(demoReturnType)).toEqual([{ table: 4, items: [], paid: false }]);
  });

  it("types can be combined", () => {
    expect(logged(demoCombine)).toEqual([{ email: "new@example.com" }]);
  });

  it("a typo in Omit removes nothing", () => {
    expect(demoOmitLoose()).toBe(true);
  });

  it("each utility type is exactly the type the lesson says", () => {
    expect(utilityChecks()).toEqual([true, true, true, true, true, true, true, true]);
  });
});

describe("lesson 8: the practice solutions", () => {
  it("patch changes only what it is given", () => {
    expect(patch({ name: "Asha", city: "Pune", phone: "98450" }, { city: "Mumbai" })).toEqual({
      name: "Asha",
      city: "Mumbai",
      phone: "98450",
    });
  });

  it("publicCard leaves out the phone and the password", () => {
    const card = publicCard({ id: 1, name: "Asha", phone: "98450", password: "chai123" });
    expect(card).toEqual({ id: 1, name: "Asha" });
    expect(Object.keys(card)).not.toContain("password");
  });

  it("priceOf reads the table", () => {
    expect(priceOf("small")).toBe(10);
    expect(priceOf("large")).toBe(20);
  });
});
