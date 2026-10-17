import { describe, expect, it } from "vitest";
import { rows } from "./lesson12-cheatsheet";

describe("lesson 12: the cheat sheet rows", () => {
  it("has a row for every pattern on the page", () => {
    expect(rows.length).toBeGreaterThanOrEqual(30);
  });

  it.each(rows.map((row) => [row.name, row] as const))("%s runs without crashing", (_, row) => {
    expect(() => row()).not.toThrow();
  });

  it("the rows give the answers the sheet claims", async () => {
    const byName = Object.fromEntries(rows.map((row) => [row.name, row]));
    expect(byName.rowUnion()).toEqual(["B2", "No. 14"]);
    expect(byName.rowNullish()).toEqual(["Runs: 0", "Runs: did not bat"]);
    expect(byName.rowFind()).toEqual(["Asha", "No such student"]);
    expect(byName.rowNever()).toEqual([10, 20]);
    expect(byName.rowConstraint()).toEqual(["coffee", [1, 2]]);
    expect(byName.rowGuard()).toEqual([true, false]);
    expect(byName.rowCast()).toBe(12);
    expect(byName.rowPickOmit()).toEqual([
      { id: 1, name: "Asha" },
      { id: 1, name: "Asha" },
    ]);
  });
});
