import { rustDsa } from "./rust-dsa";

/**
 * What the Resources page lists. Add an entry here and it appears on the page,
 * as a card with its name, a line and a count. The first resource is DSA in Rust.
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
    summary: "Data structures, taught in Rust, with code that is compiled and tested.",
    href: rustDsa.path,
    unit: ["lesson", "lessons"],
  },
];

export const resourcesPage = {
  notation: "Resources",
  heading: "Free [study] material",
  sub: "Made by VeraStack Labs. Open to anyone, no sign-up.",
  description:
    "Free study material for engineering students, made by VeraStack Labs. Starting with DSA in Rust: data structures taught in Rust, with code that is compiled and tested.",
};
