import { describe, expect, it } from "vitest";
import { BUCKETS, floorMod, javaStringHash, PUTS, putSteps } from "./hash-map";

/**
 * `java/java-collections/test/Lesson6HashSetAndHashMapTest.java` puts these
 * keys into the lesson's real `TinyHashMap` and asserts the bucket for each
 * and the chain in every bucket, read back from the class. These are the same
 * literals.
 */
const JAVA_HASHES: Record<string, number> = {
  Asha: 2050251,
  Ravi: 2539842,
  Meera: 74220700,
  Kiran: 72504801,
  Divya: 66044729,
};
const JAVA_BUCKETS: Record<string, number> = { Asha: 3, Ravi: 2, Meera: 4, Kiran: 1, Divya: 1 };
const JAVA_CHAINS: string[][] = [[], ["Divya", "Kiran"], ["Ravi"], ["Asha"], ["Meera"], [], [], []];

describe("hash map steps", () => {
  const steps = putSteps();
  const end = steps[steps.length - 1];

  it("computes String.hashCode the way Java does", () => {
    for (const [key, hash] of Object.entries(JAVA_HASHES)) expect(javaStringHash(key), key).toBe(hash);
    // And for a long word that overflows 32 bits. This one is famous for landing exactly on Integer.MIN_VALUE.
    expect(javaStringHash("polygenelubricants")).toBe(-2147483648);
    expect(javaStringHash("")).toBe(0);
  });

  it("chooses the same buckets as the real TinyHashMap", () => {
    for (const [key, bucket] of Object.entries(JAVA_BUCKETS)) {
      expect(floorMod(javaStringHash(key), BUCKETS), key).toBe(bucket);
    }
  });

  it("floorMod keeps a negative hash inside the table", () => {
    expect(floorMod(-1, 8)).toBe(7);
    expect(floorMod(-8, 8)).toBe(0);
    expect(floorMod(13, 8)).toBe(5);
  });

  it("ends with the same chain in every bucket, newest first", () => {
    expect(end.table.map((chain) => chain.map((e) => e.key))).toEqual(JAVA_CHAINS);
  });

  it("has exactly one collision, and one replace that does not grow the map", () => {
    const outcomes = steps.filter((s) => s.kind === "put").map((s) => s.outcome);
    expect(outcomes).toEqual(["new", "new", "new", "new", "collision", "replace"]);
    expect(end.size).toBe(5);
    expect(PUTS).toHaveLength(6);
  });

  it("replaces the value in place when the key is already there", () => {
    expect(end.table[3]).toEqual([{ key: "Asha", value: "98450 33333" }]);
  });

  it("never fills past the lesson's growth point: more than 6 entries would make it grow", () => {
    expect(end.size).toBeLessThanOrEqual(BUCKETS * 0.75);
  });
});
