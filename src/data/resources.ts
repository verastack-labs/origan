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
  /**
   * The day it first went live, as YYYY-MM-DD: the date of the first commit on
   * the main branch that added its first lesson. The shelf lists live items
   * newest first by this, so a new collection lands on top by itself. Two on
   * the same day keep the order they are written in here, so write the newer
   * one first.
   */
  published: string;
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
  { id: "terminal", label: "Terminal", hint: "the command line" },
  { id: "cloud", label: "Cloud", hint: "servers, storage and bills" },
  { id: "ai", label: "AI", hint: "how LLMs work" },
  { id: "os", label: "OS", hint: "what runs under your code" },
  { id: "databases", label: "Databases", hint: "SQL, indexes, transactions" },
];

/**
 * Written newest first, so that two live items from the same day keep that
 * order. `liveFirst` in `lib/shelf.ts` is what sorts them, by `published`.
 */
export const resources: readonly Resource[] = [
  {
    id: "off-the-syllabus",
    status: "live",
    published: "2026-10-18",
    filters: ["web"],
    name: offTheSyllabus.name,
    descriptor: offTheSyllabus.descriptor,
    summary: offTheSyllabus.summary,
    href: offTheSyllabus.path,
    unit: ["article", "articles"],
    topics: otsTopics,
    cta: "Read the articles",
  },
  {
    id: "the-switch",
    status: "live",
    published: "2026-10-17",
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
    id: "java-collections",
    status: "live",
    published: "2026-10-17",
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
    id: "dsa-in-rust",
    status: "live",
    published: "2026-10-17",
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
  // Coming soon. Each of these is a collection whose build is next. The shelf must
  // always have at least one: when a collection finishes, something else is shown
  // as coming (`resources.test.ts` holds it to that).
  {
    id: "black-screen",
    status: "coming",
    name: "Black Screen",
    descriptor: "The terminal",
    summary: "The terminal from your first `cd` to SSH, with a practice shell in the page.",
    filters: ["terminal"],
    topics: ["Moving around", "Files", "Pipes", "grep and find", "Processes", "Permissions", "SSH", "Terminal apps"],
  },
  {
    id: "cloud-kitchen",
    status: "coming",
    name: "Cloud Kitchen",
    descriptor: "Cloud basics",
    summary: "The cloud explained like a kitchen with no dining room, hands-on with free tiers only.",
    filters: ["cloud"],
    topics: ["Servers and VMs", "Containers", "Regions", "Storage", "Serverless", "CDNs", "DNS", "IAM", "Costs"],
  },
  {
    id: "context-window",
    status: "coming",
    name: "Context Window",
    descriptor: "AI for engineers",
    summary: "How LLMs work, from tokens to RAG, vendor-neutral and without the hype.",
    filters: ["ai"],
    topics: ["Tokens", "Context window", "Prompting", "Embeddings", "RAG", "Tool use", "Evals", "Local models"],
  },
  {
    id: "kernel-panic",
    status: "coming",
    name: "Kernel Panic",
    descriptor: "Operating systems",
    summary: "What your OS does under every program you run.",
    filters: ["os"],
    topics: ["Processes", "Threads", "Memory", "Filesystems", "Boot", "Containers", "Unix to today"],
  },
  {
    id: "table-manners",
    status: "coming",
    name: "Table Manners",
    descriptor: "Databases in practice",
    summary: "Databases the way real projects use them.",
    filters: ["databases"],
    topics: ["SQL vs NoSQL", "Indexes", "Joins", "Transactions", "N+1", "Migrations", "Backups"],
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
  /** The note at the foot of the shelf. The link is a mailto, so a student can suggest a topic. */
  more: {
    heading: "More on the way",
    before: "The VeraStack Labs team is building new courses and collections right now. Want a topic covered?",
    link: "Tell us",
    subject: "Topic for The Open Shelf",
  },
  /** The share card's one line under the title. */
  card: "Oxidise · Filter Coffee · The Switch · Off the Syllabus. Free, no sign-up.",
};
