import { javaCollections } from "./java-collections";
import { offTheSyllabus, otsTopics } from "./off-the-syllabus";
import { rustDsa } from "./rust-dsa";
import { theSwitch } from "./the-switch";

/**
 * What the Resources page lists. Add an entry here and it appears on the page
 * as a card on the shelf, and in the filter chips above it.
 *
 * An entry is `live` (it has pages: a link, a count of lessons or articles) or
 * `coming` (it is being built: a name, a line, topic pills and filters, and no
 * route). The rule is that a collection gets a coming card as soon as its
 * build starts, and the card turns live when its first lesson ships. Coming
 * entries are kept out of the sitemap, llms.txt, the structured data and
 * IndexNow, because there is no page to point at.
 */
type Shared = {
  id: string;
  /** The brand name. */
  name: string;
  /** The plain name, shown as a label above the brand. */
  descriptor: string;
  /** One line. No dates and no numbers: nothing here promises a schedule. */
  summary: string;
  /** Short topic names, shown as pills so a reader sees what is inside before opening it. */
  topics: readonly string[];
  /**
   * The filter chips this sits under: a language where the item is about one,
   * otherwise a topic such as Web. More than one is allowed. Each is the `id`
   * of an entry in `shelfFilters`.
   */
  filters: readonly string[];
};

export type LiveResource = Shared & {
  status: "live";
  href: string;
  /** What the count counts, singular and plural. */
  unit: readonly [string, string];
  /** The line at the foot of the card, where "Open the lessons" does not fit. */
  cta?: string;
};

export type ComingResource = Shared & { status: "coming" };

export type Resource = LiveResource | ComingResource;

/**
 * The filter chips above the shelf. A new collection about a new subject adds
 * its own chip here, and a card says which chips it sits under.
 */
export type ShelfFilter = { id: string; label: string; hint: string };

export const shelfFilters: readonly ShelfFilter[] = [
  { id: "rust", label: "Rust", hint: "DSA, compiled and tested" },
  { id: "java", label: "Java", hint: "the Collections Framework" },
  { id: "typescript", label: "TypeScript", hint: "coming from JavaScript" },
  { id: "web", label: "Web", hint: "the web and its tools" },
];

export const resources: readonly Resource[] = [
  {
    id: "dsa-in-rust",
    status: "live",
    filters: ["rust"],
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
    status: "live",
    filters: ["java"],
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
  {
    id: "the-switch",
    status: "live",
    filters: ["typescript"],
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
  {
    id: "off-the-syllabus",
    status: "live",
    filters: ["web"],
    name: offTheSyllabus.name,
    descriptor: offTheSyllabus.descriptor,
    summary: offTheSyllabus.summary,
    href: offTheSyllabus.path,
    unit: ["article", "articles"],
    topics: otsTopics,
    cta: "Read the articles",
  },
];

/** The entries that have pages today. */
export const liveResources: readonly LiveResource[] = resources.filter((r): r is LiveResource => r.status === "live");

export const resourcesPage = {
  notation: "The Open Shelf",
  heading: "Free [study] material",
  sub: "Made by VeraStack Labs. Open to anyone, no sign-up.",
  description:
    "Free courses for engineering students by VeraStack Labs: Oxidise (DSA in Rust), Filter Coffee (Java Collections) and The Switch (JavaScript to TypeScript), plus Off the Syllabus, articles on the web and its tools. Every code sample is tested.",
  /** The share card's one line under the title. */
  card: "Oxidise · Filter Coffee · The Switch · Off the Syllabus. Free, no sign-up.",
};
