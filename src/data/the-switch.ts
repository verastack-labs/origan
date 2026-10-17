import { site } from "./site";
import type { CurriculumEntry } from "./rust-dsa";

/**
 * "The Switch": its name, its routes and the whole of the plan
 * (`origan-internal/docs/the-switch-plan.md`).
 *
 * The name is always shown with its descriptor, because "The Switch" alone does
 * not say what is inside. The descriptor carries the words students search for.
 *
 * This is the plan, not the list of what is live. A lesson is live when its MDX
 * file exists in `src/content/learn/js-to-ts/`, and `switch-lessons.test.ts`
 * fails if a file and an entry here disagree. The rest show on the index as
 * "Coming next", without links.
 */
export const theSwitch = {
  name: "The Switch",
  descriptor: "JavaScript to TypeScript",
  path: "/learn/js-to-ts/",
  // Said plainly, because it is also the search term.
  description:
    "The Switch is a free guide to TypeScript for JavaScript developers. Every lesson shows the JavaScript you know beside the TypeScript it becomes, with the costs laid out as honestly as the benefits. Every code sample is type-checked and tested.",
  provider: {
    name: site.studio,
    url: site.labsUrl,
  },
  partNames: { 1: "The lessons" } as Record<number, string>,
} as const;

/** Thirteen lessons, in order. Slugs are the URL, so they do not change once published. */
export const switchCurriculum: readonly CurriculumEntry[] = [
  { order: 0, slug: "why-switch", title: "Why switch? The honest list", angle: "The pros, the costs, and when plain JavaScript is fine" },
  { order: 1, slug: "setting-up", title: "Setting up", angle: "tsc, tsconfig, strict, and running a .ts file" },
  { order: 2, slug: "your-first-types", title: "Your first types", angle: "Annotations, inference, and letting TypeScript work it out" },
  { order: 3, slug: "objects", title: "Objects", angle: "type or interface, optional and readonly properties" },
  { order: 4, slug: "arrays-tuples-functions", title: "Arrays, tuples and functions", angle: "Parameter and return types, optional and default parameters" },
  { order: 5, slug: "unions-and-narrowing", title: "Unions and narrowing", angle: "typeof, in, and discriminated unions" },
  { order: 6, slug: "null-and-undefined", title: "null, undefined and strictness", angle: "strictNullChecks, ?. and ??" },
  { order: 7, slug: "generics", title: "Generics, just enough", angle: "One function for many types" },
  { order: 8, slug: "utility-types", title: "Utility types", angle: "Partial, Pick, Omit, Record, ReturnType" },
  { order: 9, slug: "data-from-outside", title: "Data from outside", angle: "unknown vs any, typing fetch, checking JSON" },
  { order: 10, slug: "migrating-a-project", title: "Migrating a real project", angle: "allowJs, checkJs, JSDoc, and the strictness ladder" },
  { order: 11, slug: "traps-and-escape-hatches", title: "Traps and escape hatches", angle: "any, as, !, enums vs unions, and what to avoid" },
  { order: 12, slug: "the-cheat-sheet", title: "The cheat sheet", angle: "Every JS-to-TS pattern on one page" },
];

/**
 * The seven parts every lesson of The Switch has, in order. Adapted from the
 * seven parts of the other courses for a migration guide: the JavaScript you
 * would write, then the TypeScript it becomes.
 */
export const switchParts = [
  { id: "hook", label: "The hook" },
  { id: "js", label: "In JavaScript" },
  { id: "ts", label: "In TypeScript" },
  { id: "how", label: "How it works" },
  { id: "watch", label: "Watch out" },
  { id: "practise", label: "Practise" },
  { id: "interview", label: "Interview notes" },
] as const;
