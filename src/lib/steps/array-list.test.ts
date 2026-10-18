import { describe, expect, it } from "vitest";
import { grownCapacity, growthSteps, ITEMS, START_CAPACITY } from "./array-list";

/**
 * `java/java-collections/test/Lesson3ArrayListTest.java` adds "A" to "H" to
 * the lesson's `TinyList` and asserts its `capacity()` after each add. This is
 * the same list of numbers.
 */
const JAVA_CAPACITY_AFTER_EACH_ADD = [4, 4, 4, 4, 7, 7, 7, 11];

describe("ArrayList growth steps", () => {
  const steps = growthSteps();

  it("has the capacity the real TinyList has after every add", () => {
    expect(steps.filter((s) => s.kind === "add").map((s) => s.capacity)).toEqual(JAVA_CAPACITY_AFTER_EACH_ADD);
  });

  it("follows the lesson's growth rule: the old length plus half of it, plus one", () => {
    expect(START_CAPACITY).toBe(4);
    expect([4, 7, 11, 17].map(grownCapacity)).toEqual([7, 11, 17, 26]);
    // The lesson's own demo: five items do not fit in four slots, so it grows from 4 to 7.
    expect(grownCapacity(4)).toBe(7);
  });

  it("grows only when it is full, and only by copying everything it holds", () => {
    const grows = steps.filter((s) => s.kind === "copied");
    expect(grows).toHaveLength(2);
    expect(grows.map((s) => [s.old?.length, s.capacity, s.size])).toEqual([
      [4, 7, 4],
      [7, 11, 7],
    ]);
    // Every item in the old array is in the new one, in the same slots.
    for (const g of grows) expect(g.slots.slice(0, g.size)).toEqual(g.old?.slice(0, g.size));
  });

  it("copies 4 + 7 items in total over eight adds, which is about one copy per add", () => {
    expect(steps[steps.length - 1].copied).toBe(11);
  });

  it("ends holding every item in order, with spare room", () => {
    const end = steps[steps.length - 1];
    expect(end.slots.filter((s) => s !== null)).toEqual([...ITEMS]);
    expect(end.size).toBe(8);
    expect(end.capacity).toBe(11);
  });

  it("shows the 'full' step before the copy: same array, nothing moved yet", () => {
    const at = steps.findIndex((s) => s.kind === "full");
    expect(steps[at].slots.every((s) => s !== null)).toBe(true);
    expect(steps[at + 1].kind).toBe("copied");
    expect(steps[at + 2]).toMatchObject({ kind: "add", value: "E", size: 5 });
  });
});
