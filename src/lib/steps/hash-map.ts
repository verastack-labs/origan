/**
 * The steps of the hash map stepper in the Filter Coffee lesson on HashSet
 * and HashMap: the lesson's own `TinyHashMap` (Lesson6HashSetAndHashMap.java),
 * with its eight buckets, `Math.floorMod(key.hashCode(), 8)` to choose one,
 * and each new entry put at the front of its bucket's chain.
 *
 * `hash-map.test.ts` checks the hash codes and buckets against what the Java
 * test (`Lesson6HashSetAndHashMapTest`) asserts by running the real class.
 */
export const BUCKETS = 8;

/** Java's `String.hashCode()`: s[0]*31^(n-1) + ... + s[n-1], wrapped to a 32-bit int. */
export function javaStringHash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (Math.imul(h, 31) + text.charCodeAt(i)) | 0;
  return h;
}

/** `Math.floorMod`: the answer is always from 0 to `count - 1`, even for a negative hash. */
export const floorMod = (n: number, count: number) => ((n % count) + count) % count;

/** What is put, in order. Kiran and Divya land in the same bucket; the last one is a key already there. */
export const PUTS: readonly (readonly [string, string])[] = [
  ["Asha", "98450 11111"],
  ["Ravi", "98450 22222"],
  ["Meera", "98450 44444"],
  ["Kiran", "98450 55555"],
  ["Divya", "98450 66666"],
  ["Asha", "98450 33333"],
];

export type Entry = { key: string; value: string };

export type PutStep = {
  kind: "start" | "put";
  key: string | null;
  value: string | null;
  hash: number | null;
  bucket: number | null;
  /** `new` goes in an empty bucket, `collision` joins a bucket that already has someone, `replace` is a key already there. */
  outcome: "new" | "collision" | "replace" | null;
  /** Each bucket's chain, front first. */
  table: Entry[][];
  size: number;
};

export function putSteps(puts: readonly (readonly [string, string])[] = PUTS, buckets = BUCKETS): PutStep[] {
  const table: Entry[][] = Array.from({ length: buckets }, () => []);
  let size = 0;
  const snap = (extra: Partial<PutStep>): PutStep => ({
    kind: "put",
    key: null,
    value: null,
    hash: null,
    bucket: null,
    outcome: null,
    table: table.map((chain) => chain.map((e) => ({ ...e }))),
    size,
    ...extra,
  });

  const steps: PutStep[] = [snap({ kind: "start" })];
  for (const [key, value] of puts) {
    const hash = javaStringHash(key);
    const bucket = floorMod(hash, buckets);
    const found = table[bucket].find((e) => e.key === key);
    let outcome: PutStep["outcome"];
    if (found) {
      found.value = value; // same key: replace, never add a second one
      outcome = "replace";
    } else {
      outcome = table[bucket].length === 0 ? "new" : "collision";
      table[bucket].unshift({ key, value }); // the new node goes in front, as in the lesson
      size++;
    }
    steps.push(snap({ key, value, hash, bucket, outcome }));
  }
  return steps;
}
