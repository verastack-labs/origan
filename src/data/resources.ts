import { javaCollections } from "./java-collections";
import { rustDsa } from "./rust-dsa";

/**
 * What the Resources page lists. Add an entry here and it appears on the page,
 * as a card with its name, a line and a count. DSA in Rust is first, then Java Collections.
 */
export type Resource = {
  id: string;
  name: string;
  /** One line. */
  summary: string;
  href: string;
  /** What the count counts, singular and plural. */
  unit: readonly [string, string];
};

export const resources: readonly Resource[] = [
  {
    id: "dsa-in-rust",
    name: rustDsa.name,
    summary: "Data structures and algorithms, taught in Rust, with code that is compiled and tested.",
    href: rustDsa.path,
    unit: ["lesson", "lessons"],
  },
  {
    id: "java-collections",
    name: javaCollections.name,
    summary: "The Java Collections Framework, taught to beginners, with code that is compiled and tested.",
    href: javaCollections.path,
    unit: ["lesson", "lessons"],
  },
];

export const resourcesPage = {
  notation: "Resources",
  heading: "Free [study] material",
  sub: "Made by VeraStack Labs. Open to anyone, no sign-up.",
  description:
    "Free study material for engineering students, made by VeraStack Labs. DSA in Rust teaches data structures and algorithms in Rust, and Java Collections teaches the Java Collections Framework. Every code sample is compiled and tested.",
};
