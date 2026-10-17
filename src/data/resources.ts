import { javaCollections } from "./java-collections";
import { rustDsa } from "./rust-dsa";

/**
 * What the Resources page lists. Add an entry here and it appears on the page,
 * as a card with its name, a line and a count. Oxidise (DSA in Rust) is first, then Filter Coffee (Java Collections).
 */
export type Resource = {
  id: string;
  /** The brand name. */
  name: string;
  /** The plain name, shown as a label above the brand. */
  descriptor: string;
  /** One line. */
  summary: string;
  href: string;
  /** What the count counts, singular and plural. */
  unit: readonly [string, string];
  /** Short topic names, shown as pills so a reader sees what is inside before opening it. */
  topics: readonly string[];
};

export const resources: readonly Resource[] = [
  {
    id: "dsa-in-rust",
    name: rustDsa.name,
    descriptor: rustDsa.descriptor,
    summary: "Data structures and algorithms, taught in Rust, with code that is compiled and tested.",
    href: rustDsa.path,
    unit: ["lesson", "lessons"],
    topics: [
      "Vec", "Strings", "Linked lists", "Stacks", "Queues", "Hash maps", "Trees", "Heaps",
      "Ordered maps", "Graphs", "Tries", "Union-find", "Sorting", "Binary search",
      "Two pointers", "Backtracking", "BFS and DFS", "Shortest paths", "Dynamic programming",
    ],
  },
  {
    id: "java-collections",
    name: javaCollections.name,
    descriptor: javaCollections.descriptor,
    summary: "The Java Collections Framework, taught to beginners, with code that is compiled and tested.",
    href: javaCollections.path,
    unit: ["lesson", "lessons"],
    topics: [
      "Generics", "ArrayList", "LinkedList", "Iterators", "HashMap", "HashSet",
      "equals and hashCode", "TreeMap", "Comparator", "ArrayDeque", "PriorityQueue",
      "Collections helpers", "Choosing a collection",
    ],
  },
];

export const resourcesPage = {
  notation: "Resources",
  heading: "Free [study] material",
  sub: "Made by VeraStack Labs. Open to anyone, no sign-up.",
  description:
    "Free study material for engineering students, made by VeraStack Labs. Oxidise is DSA in Rust: data structures and algorithms in Rust. Filter Coffee is Java Collections: the Java Collections Framework. Every code sample is compiled and tested.",
};
