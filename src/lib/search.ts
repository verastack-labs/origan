/**
 * Search over the Resources page: courses, languages and chapters.
 *
 * Pure functions on plain data, so the same code runs in the unit tests and in
 * the browser. The index itself is built at build time (see `search-index.ts`)
 * and handed to the client as props; nothing here touches the file system.
 */

export type SearchEntry = {
  /** Unique and stable, used as the React key. */
  id: string;
  /** A course or a collection, or one lesson or article inside it. */
  kind: "course" | "lesson" | "collection" | "article";
  /** What the row is called, and what the match is highlighted in. */
  title: string;
  /** Courses only: the plain name ("DSA in Rust"), searched like the title. */
  descriptor?: string;
  courseName: string;
  /** "Rust", "Java". */
  language: string;
  href: string;
  /** An unpublished lesson shows as "Coming next" and is not a link. */
  published: boolean;
  /** Lessons only: the number shown in the list, which starts at 0 for setup. */
  lessonNumber?: number;
  /** Courses only: how many lessons are live. */
  lessonCount?: number;
  /** Articles only: the series it belongs to, searched like the title. */
  series?: string;
  /** Articles only: its number in the plan. */
  articleNumber?: number;
  /** Collections only: how many articles are live. */
  articleCount?: number;
  /** The topic pills of a course. */
  topics: readonly string[];
  /** Everything else worth finding: a lesson's angle, its part name, the course summary. */
  text: readonly string[];
};

export type SearchResult = {
  entry: SearchEntry;
  /** 1 is best. Exposed so tests can pin the ranking rules. */
  tier: 1 | 2 | 3 | 4 | 5;
  /** Character ranges of `entry.title` to wrap in <mark>, sorted and not overlapping. */
  ranges: readonly (readonly [number, number])[];
};

/**
 * Short names people type for longer ones. Each key maps to alternatives, and
 * an alternative is a list of words that must all be found. "ts" and "js" are
 * reserved for the day there is a TypeScript or JavaScript course; until then
 * they match nothing, which is the honest answer.
 */
export const synonyms: Readonly<Record<string, readonly (readonly string[])[]>> = {
  oxidize: [["oxidise"]],
  dsa: [["data", "structures"], ["algorithms"]],
  dp: [["dynamic", "programming"]],
  bfs: [["dfs"]],
  dfs: [["bfs"]],
  ts: [["typescript"]],
  js: [["javascript"]],
};

/** What the box offers when nothing matches. Each one must find something; a test holds them to it. */
export const emptyState = {
  message: "Nothing matches that yet.",
  suggestions: ["Hash maps", "Sorting", "ArrayList"],
} as const;

export const placeholder = "Search courses, languages or topics, like hash map or Java";

/** The longest query kept, in the box and in the address bar. */
export const maxQueryLength = 80;

const marks = /\p{M}/gu;

/**
 * Lower case with accents removed, one output string per input character, so
 * a position in the result can be mapped back to a position in the original.
 */
function foldWithMap(text: string): { folded: string; map: number[] } {
  let folded = "";
  const map: number[] = [];
  for (let i = 0; i < text.length; ) {
    const cp = text.codePointAt(i)!;
    const ch = String.fromCodePoint(cp);
    const piece = ch.normalize("NFD").replace(marks, "").toLowerCase();
    for (let k = 0; k < piece.length; k += 1) map.push(i);
    folded += piece;
    i += ch.length;
  }
  return { folded, map };
}

/** Lower case, accent-free, with every run of punctuation turned into one space. */
export function normalize(text: string): string {
  return foldWithMap(text).folded.replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

const wordsOf = (text: string) => {
  const n = normalize(text);
  return n === "" ? [] : n.split(" ");
};

type Alternative = readonly string[];

/** For one typed word: the word itself, then whatever it is short for. */
function alternativesFor(term: string): Alternative[] {
  return [[term], ...(synonyms[term] ?? [])];
}

const prefixIn = (words: readonly string[], word: string) => words.some((w) => w.startsWith(word));

/** Every typed word is found, as the start of a word, somewhere in `words`. */
function matchesAll(words: readonly string[], terms: readonly Alternative[][]) {
  return terms.every((alts) => alts.some((alt) => alt.every((w) => prefixIn(words, w))));
}

function rangesFor(title: string, terms: readonly Alternative[][]) {
  const { folded, map } = foldWithMap(title);
  const wanted = new Set(terms.flatMap((alts) => alts.flat()));
  const found: [number, number][] = [];
  for (const m of folded.matchAll(/[\p{L}\p{N}]+/gu)) {
    const start = m.index!;
    let best = 0;
    for (const w of wanted) {
      if (m[0].startsWith(w) && w.length > best) best = w.length;
    }
    if (best > 0) {
      // Map back to the original text. The end is one past the last matched character.
      found.push([map[start], map[start + best - 1] + 1]);
    }
  }
  return found;
}

/**
 * Entries matching every word typed, best first.
 *
 * A typed word matches the start of a word in the entry, so "hash" finds
 * "HashMap" and "hashCode". Order: the title is the whole query; the title
 * starts with it; every word is a word of the title; every word is in the
 * title, the topics or the language; then anything else. A course beats a
 * lesson on a tie, and ties after that keep the order of the index.
 */
export function search(index: readonly SearchEntry[], query: string): SearchResult[] {
  const typed = wordsOf(query.slice(0, maxQueryLength));
  if (typed.length === 0) return [];
  const terms = typed.map(alternativesFor);
  const joined = typed.join(" ");

  const out: { result: SearchResult; at: number }[] = [];
  index.forEach((entry, at) => {
    const title = wordsOf(entry.title);
    const named = [...title, ...wordsOf(entry.descriptor ?? "")];
    const near = [...named, ...entry.topics.flatMap(wordsOf), ...wordsOf(entry.language), ...wordsOf(entry.series ?? "")];
    const all = [...near, ...entry.text.flatMap(wordsOf), ...wordsOf(entry.courseName)];
    if (!matchesAll(all, terms)) return;

    const titleJoined = title.join(" ");
    const tier: SearchResult["tier"] =
      titleJoined === joined
        ? 1
        : titleJoined.startsWith(joined)
          ? 2
          : matchesAll(named, terms)
            ? 3
            : matchesAll(near, terms)
              ? 4
              : 5;
    out.push({ result: { entry, tier, ranges: rangesFor(entry.title, terms) }, at });
  });

  out.sort(
    (a, b) =>
      a.result.tier - b.result.tier ||
      Number(isInner(a.result.entry)) - Number(isInner(b.result.entry)) ||
      a.at - b.at,
  );
  return out.map((o) => o.result);
}

/** A lesson or an article, as opposed to a course or a collection: on a tie, the whole beats the part. */
export const isInner = (entry: Pick<SearchEntry, "kind">) => entry.kind === "lesson" || entry.kind === "article";

/** The words for a screen reader to hear after the list changes. */
export function resultsAnnouncement(count: number, query: string): string {
  const q = query.trim();
  if (q === "") return "";
  if (count === 0) return `No results for ${q}.`;
  return `${count} ${count === 1 ? "result" : "results"} for ${q}.`;
}

/** The query held in an address's search string, `?q=hash` or `q=hash`. Empty when there is none. */
export function readQuery(search: string): string {
  const q = new URLSearchParams(search).get("q") ?? "";
  return q.replace(/\s+/g, " ").trim().slice(0, maxQueryLength);
}

/**
 * The address to show for a query: the same page, other parameters kept, `q`
 * set, or removed when the box is empty. Used with `history.replaceState`.
 */
export function withQuery(
  location: { pathname: string; search: string; hash: string },
  query: string,
): string {
  const params = new URLSearchParams(location.search);
  const q = query.trim().slice(0, maxQueryLength);
  if (q === "") params.delete("q");
  else params.set("q", q);
  const rest = params.toString();
  return `${location.pathname}${rest ? `?${rest}` : ""}${location.hash}`;
}
