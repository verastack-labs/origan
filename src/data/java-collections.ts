import { site } from "./site";
import type { CurriculumEntry } from "./rust-dsa";

/**
 * The "Java Collections" section: its name, its routes and the whole of the
 * plan (`origan-internal/docs/java-collections-plan.md`).
 *
 * This is the plan, not the list of what is live. A lesson is live when its
 * MDX file exists in `src/content/learn/java-collections/`, and
 * `java-lessons.test.ts` fails if a file and an entry here disagree. The rest
 * show on the index as "Coming next", without links.
 */
export const javaCollections = {
  name: "Java Collections",
  path: "/learn/java-collections/",
  // Said plainly, because it is also the search term.
  description:
    "The Java Collections Framework, taught to beginners. Each lesson has an idea, a small working example, how it works underneath, a cost table, practice problems with hints, and interview notes. Every code sample is compiled and tested.",
  provider: {
    name: site.studio,
    url: site.labsUrl,
  },
  partNames: { 1: "The framework" } as Record<number, string>,
} as const;

/** Thirteen lessons, in order. Slugs are the URL, so they do not change once published. */
export const javaCurriculum: readonly CurriculumEntry[] = [
  { order: 0, slug: "setup", title: "Setting up, and how to read these pages", angle: "JDK 21, javac, java, jshell" },
  { order: 1, slug: "the-big-picture", title: "The big picture", angle: "Collection, List, Set, Queue, Map" },
  { order: 2, slug: "generics", title: "Generics, just enough", angle: "List<String>, the diamond, boxing" },
  { order: 3, slug: "arraylist", title: "ArrayList", angle: "A growing array, and the cost of the middle" },
  { order: 4, slug: "linkedlist", title: "LinkedList", angle: "Nodes, and why it is rarely the right choice" },
  { order: 5, slug: "iterating-safely", title: "Iterating safely", angle: "for-each, Iterator, ConcurrentModificationException" },
  { order: 6, slug: "hashset-and-hashmap", title: "HashSet and HashMap", angle: "Hashing, buckets, getOrDefault, merge" },
  { order: 7, slug: "equals-and-hashcode", title: "equals and hashCode", angle: "The contract, and the bug when you break it" },
  { order: 8, slug: "ordered-collections", title: "Ordered collections", angle: "LinkedHashMap, TreeMap, Comparable, Comparator" },
  { order: 9, slug: "queues-and-deques", title: "Queues and deques", angle: "ArrayDeque as stack and queue, PriorityQueue" },
  { order: 10, slug: "the-helpers", title: "The helpers", angle: "Collections, Arrays, List.of immutability" },
  { order: 11, slug: "choosing-a-collection", title: "Choosing a collection", angle: "A decision guide to bookmark" },
  { order: 12, slug: "interview-round-up", title: "Interview round-up", angle: "Fail-fast, concurrent collections, common traps" },
];

/**
 * The seven parts every Java lesson has, in order. Same shape as DSA in Rust,
 * with the two middle parts named for what a Java lesson does: use the
 * collection, then look inside it.
 */
export const javaParts = [
  { id: "what", label: "What it is" },
  { id: "idea", label: "The idea" },
  { id: "use", label: "Use it" },
  { id: "inside", label: "How it works" },
  { id: "cost", label: "Cost" },
  { id: "practise", label: "Practise" },
  { id: "interview", label: "Interview notes" },
] as const;
