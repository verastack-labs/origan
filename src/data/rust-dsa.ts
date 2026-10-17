import { site } from "./site";

/**
 * The "DSA in Rust" section: its name, its routes, and both parts: data
 * structures, then algorithms.
 *
 * This is the plan, not the list of what is live. A lesson is live when its
 * MDX file exists in `src/content/learn/rust-dsa/` (see `src/lib/lessons.ts`),
 * and `lessons.test.ts` fails if a file and an entry here disagree. The rest
 * show on the index as "Coming next", without links.
 */
export const rustDsa = {
  name: "DSA in Rust",
  path: "/learn/rust-dsa/",
  // Said plainly, because it is also the search term.
  description:
    "Data structures and algorithms, taught in Rust. Each lesson has an idea, a small working build, the standard library version, a cost table, practice problems with hints, and interview notes. Every code sample is compiled and tested.",
  provider: {
    name: site.studio,
    url: site.labsUrl,
  },
  partNames: { 1: "Data structures", 2: "Algorithms" } as Record<number, string>,
} as const;

export type CurriculumEntry = {
  order: number;
  slug: string;
  /** The name in the list. The lesson's own page heading is in its front matter. */
  title: string;
  /** What Rust-specific idea the lesson is really about. */
  angle: string;
  /** Which part of the course it belongs to. Left out means Part 1. */
  part?: number;
};

/** The part a curriculum entry belongs to. */
export const partOf = (entry: Pick<CurriculumEntry, "part">) => entry.part ?? 1;

/** Both parts, in order. Slugs are the URL, so they do not change once published. */
export const curriculum: readonly CurriculumEntry[] = [
  { order: 0, slug: "setup", title: "Setting up, and how to read these pages", angle: "cargo new, cargo test, the Playground" },
  { order: 1, slug: "arrays-and-vec", title: "Arrays and Vec", angle: "Slices, bounds checks, capacity and length" },
  { order: 2, slug: "strings", title: "Strings", angle: "String and &str, UTF-8, why indexing by number fails" },
  { order: 3, slug: "linked-lists", title: "Linked lists", angle: "Box, Option, and why they are hard in Rust" },
  { order: 4, slug: "stacks", title: "Stacks", angle: "Vec as a stack" },
  { order: 5, slug: "queues-and-deques", title: "Queues and deques", angle: "VecDeque and ring buffers" },
  { order: 6, slug: "hash-maps-and-sets", title: "Hash maps and sets", angle: "HashMap, HashSet, the entry API" },
  { order: 7, slug: "trees", title: "Trees and binary search trees", angle: "Option<Box<Node>> and recursion" },
  { order: 8, slug: "heaps", title: "Heaps and priority queues", angle: "BinaryHeap, and Reverse for a min-heap" },
  { order: 9, slug: "ordered-maps", title: "Ordered maps", angle: "BTreeMap and range queries" },
  { order: 10, slug: "graphs", title: "Graphs: representations", angle: "Vec<Vec<usize>> and indices instead of references" },
  { order: 11, slug: "tries", title: "Tries", angle: "Nested maps and prefix search" },
  { order: 12, slug: "union-find", title: "Union-find", angle: "Path compression and ranks" },
  { order: 13, part: 2, slug: "sorting", title: "Sorting", angle: "sort, sort_unstable and sort_by_key" },
  { order: 14, part: 2, slug: "binary-search", title: "Binary search", angle: "binary_search and partition_point" },
  { order: 15, part: 2, slug: "two-pointers-sliding-window", title: "Two pointers and sliding window", angle: "Slices, indices and windows" },
  { order: 16, part: 2, slug: "recursion-backtracking", title: "Recursion and backtracking", angle: "The call stack and &mut Vec" },
  { order: 17, part: 2, slug: "bfs-dfs", title: "BFS and DFS", angle: "VecDeque, Vec as a stack, visited sets" },
  { order: 18, part: 2, slug: "shortest-paths", title: "Shortest paths", angle: "BinaryHeap with Reverse" },
  { order: 19, part: 2, slug: "dynamic-programming", title: "Dynamic programming", angle: "Memo with HashMap, tables with Vec" },
];

/** The seven parts every lesson has, in order. The contents rail lists these. */
export const lessonParts = [
  { id: "what", label: "What it is" },
  { id: "idea", label: "The idea" },
  { id: "build", label: "Build it" },
  { id: "std", label: "Standard library" },
  { id: "cost", label: "Cost" },
  { id: "practise", label: "Practise" },
  { id: "interview", label: "Interview notes" },
] as const;

export const lessonPath = (slug: string) => `${rustDsa.path}${slug}/`;
export const lessonUrl = (slug: string) => `${site.url}${lessonPath(slug)}`;
