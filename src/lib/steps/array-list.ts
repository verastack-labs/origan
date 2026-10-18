/**
 * The steps of the growth stepper in the Filter Coffee lesson on ArrayList:
 * the lesson's own `TinyList` (Lesson3ArrayList.java), which starts with four
 * slots and, when full, grows to `length + length / 2 + 1`.
 *
 * `array-list.test.ts` checks the capacities against what the Java test
 * (`Lesson3ArrayListTest`) asserts after each add.
 */
export const START_CAPACITY = 4;

/** What gets added, in order. Eight is enough to see the array grow twice. */
export const ITEMS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

/** The size of the bigger array, exactly as `growIfFull` works it out. */
export const grownCapacity = (capacity: number) => capacity + Math.floor(capacity / 2) + 1;

export type GrowthStep = {
  kind: "start" | "add" | "full" | "copied";
  /** The slots of the array in use now. `null` is an empty slot. */
  slots: (string | null)[];
  /** The array just left behind, while it is being replaced. */
  old: (string | null)[] | null;
  /** The item being added, if there is one. */
  value: string | null;
  size: number;
  capacity: number;
  /** Items copied from one array to another so far, over the whole run. */
  copied: number;
};

export function growthSteps(items: readonly string[] = ITEMS): GrowthStep[] {
  let slots: (string | null)[] = Array(START_CAPACITY).fill(null);
  let size = 0;
  let copied = 0;
  const snap = (kind: GrowthStep["kind"], value: string | null, old: (string | null)[] | null = null): GrowthStep => ({
    kind,
    slots: [...slots],
    old: old && [...old],
    value,
    size,
    capacity: slots.length,
    copied,
  });

  const steps: GrowthStep[] = [snap("start", null)];
  for (const value of items) {
    if (size === slots.length) {
      // Full: the lesson's `growIfFull`. A bigger array is made, and every item is copied across.
      const old = slots;
      steps.push(snap("full", value));
      slots = [...old, ...Array(grownCapacity(old.length) - old.length).fill(null)];
      copied += size;
      steps.push(snap("copied", value, old));
    }
    slots[size] = value;
    size++;
    steps.push(snap("add", value));
  }
  return steps;
}
