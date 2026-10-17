import { javaCollections } from "./java-collections";
import { rustDsa } from "./rust-dsa";
import { theSwitch } from "./the-switch";

/**
 * What the Resources page lists. Add an entry here and it appears on the page,
 * as a card with its name, a line and a count. DSA in Rust is first, then Java Collections,
 * then The Switch.
 */
export type Resource = {
  id: string;
  name: string;
  /** What it teaches, shown beside the name where the name alone would not say. */
  descriptor?: string;
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
    summary: "The Java Collections Framework, taught to beginners, with code that is compiled and tested.",
    href: javaCollections.path,
    unit: ["lesson", "lessons"],
    topics: [
      "Generics", "ArrayList", "LinkedList", "Iterators", "HashMap", "HashSet",
      "equals and hashCode", "TreeMap", "Comparator", "ArrayDeque", "PriorityQueue",
      "Collections helpers", "Choosing a collection",
    ],
  },
  {
    id: "the-switch",
    name: theSwitch.name,
    descriptor: theSwitch.descriptor,
    summary: "JavaScript to TypeScript, one lesson at a time, with the costs as plain as the benefits.",
    href: theSwitch.path,
    unit: ["lesson", "lessons"],
    topics: [
      "Why switch", "Setup", "Types", "Objects", "Functions", "Unions", "Narrowing",
      "null and undefined", "Generics", "Utility types", "unknown vs any", "Migrating",
      "Cheat sheet",
    ],
  },
];

export const resourcesPage = {
  notation: "Resources",
  heading: "Free [study] material",
  sub: "Made by VeraStack Labs. Open to anyone, no sign-up.",
  description:
    "Free study material for engineering students, made by VeraStack Labs. DSA in Rust teaches data structures and algorithms in Rust, Java Collections teaches the Java Collections Framework, and The Switch takes JavaScript developers to TypeScript. Every code sample is compiled or type-checked, and tested.",
};
