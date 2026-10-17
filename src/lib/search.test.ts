import { describe, expect, it } from "vitest";
import { courses } from "@/data/courses";
import { buildSearchIndex } from "./search-index";
import { getLessons } from "./lessons";
import {
  emptyState,
  maxQueryLength,
  normalize,
  readQuery,
  resultsAnnouncement,
  search,
  withQuery,
  type SearchEntry,
} from "./search";

const index = buildSearchIndex();
const titles = (query: string) => search(index, query).map((r) => r.entry.title);
const languages = (query: string) => new Set(search(index, query).map((r) => r.entry.language));

describe("the index", () => {
  it("has every course", () => {
    for (const course of courses) {
      const entry = index.find((e) => e.id === `course:${course.id}`);
      expect(entry?.kind).toBe("course");
      expect(entry?.title).toBe(course.name);
      expect(entry?.language).toBe(course.languageName);
      expect(entry?.href).toBe(course.path);
      expect(entry?.topics.length).toBeGreaterThan(0);
      expect(entry?.lessonCount).toBe(getLessons(course).length);
    }
  });

  it("has every planned lesson, published or not", () => {
    for (const course of courses) {
      const live = new Set(getLessons(course).map((l) => l.slug));
      for (const planned of course.curriculum) {
        const entry = index.find((e) => e.id === `lesson:${course.id}:${planned.slug}`);
        expect(entry, `${course.id}/${planned.slug}`).toBeDefined();
        expect(entry?.title).toBe(planned.title);
        expect(entry?.courseName).toBe(course.name);
        expect(entry?.href).toBe(`${course.path}${planned.slug}/`);
        expect(entry?.lessonNumber).toBe(planned.order);
        expect(entry?.published).toBe(live.has(planned.slug));
      }
    }
    const lessonCount = courses.reduce((n, c) => n + c.curriculum.length, 0);
    expect(index).toHaveLength(courses.length + lessonCount);
  });

  it("has unique ids and is plain data", () => {
    expect(new Set(index.map((e) => e.id)).size).toBe(index.length);
    expect(JSON.parse(JSON.stringify(index))).toEqual(index);
  });

  it("marks an unpublished lesson as such", () => {
    const planned: SearchEntry[] = buildSearchIndex(courses, () => new Set(["setup"]));
    const lessons = planned.filter((e) => e.kind === "lesson");
    expect(lessons.find((e) => e.id.endsWith(":setup"))?.published).toBe(true);
    expect(lessons.find((e) => e.id.endsWith(":stacks"))?.published).toBe(false);
  });
});

describe("matching", () => {
  it("finds hash in Rust and Java lessons, by word start", () => {
    const found = titles("hash");
    expect(found).toContain("Hash maps and sets");
    expect(found).toContain("HashSet and HashMap");
    expect(found).toContain("equals and hashCode");
    expect(languages("hash")).toEqual(new Set(["Rust", "Java"]));
  });

  it("needs every word, so java hash finds only Java", () => {
    const found = search(index, "java hash");
    expect(found.length).toBeGreaterThan(0);
    expect(languages("java hash")).toEqual(new Set(["Java"]));
  });

  it("matches the language", () => {
    expect(languages("rust")).toEqual(new Set(["Rust"]));
    expect(languages("JAVA")).toEqual(new Set(["Java"]));
  });

  it("matches part names and topic pills", () => {
    expect(titles("algorithms")).toContain("Sorting");
    expect(titles("union")).toContain("Union-find");
    expect(titles("equals")).toContain("equals and hashCode");
  });

  it("ignores case and accents", () => {
    expect(titles("HASH")).toEqual(titles("hash"));
    expect(titles("hásh")).toEqual(titles("hash"));
    expect(titles("Dynámic Prógramming")).toEqual(titles("dynamic programming"));
    expect(normalize("  Café  Crème ")).toBe("cafe creme");
  });

  it("does not match the middle of a word", () => {
    expect(titles("ashmap")).toEqual([]);
  });

  it("expands light synonyms", () => {
    expect(titles("dp")).toContain("Dynamic programming");
    expect(titles("dsa")).toContain("Oxidise");
    expect(titles("oxidize")).toContain("Oxidise");
    expect(titles("bfs")).toContain("BFS and DFS");
    expect(titles("dfs")).toContain("BFS and DFS");
  });

  it("keeps ts and js for later, matching nothing today", () => {
    expect(titles("ts")).toEqual([]);
    // "js" only finds the Java setup lesson, because jshell starts with it.
    expect(titles("js")).toEqual(["Setting up, and how to read these pages"]);
    expect(languages("js")).toEqual(new Set(["Java"]));
  });

  it("finds nothing for an empty or punctuation-only query", () => {
    expect(search(index, "")).toEqual([]);
    expect(search(index, "   ")).toEqual([]);
    expect(search(index, "?!")).toEqual([]);
  });
});

describe("brand and descriptor", () => {
  const firstCourse = (query: string) => search(index, query).find((r) => r.entry.kind === "course")?.entry.id;

  it.each([
    ["oxidise", "course:rust-dsa"],
    ["oxidize", "course:rust-dsa"],
    ["rust", "course:rust-dsa"],
    ["dsa", "course:rust-dsa"],
    ["dsa in rust", "course:rust-dsa"],
    ["filter coffee", "course:java-collections"],
    ["coffee", "course:java-collections"],
    ["java", "course:java-collections"],
    ["java collections", "course:java-collections"],
  ])("finds the right course for %s", (query, id) => {
    expect(firstCourse(query)).toBe(id);
  });

  it("ranks the brand as an exact title and the descriptor as a title word", () => {
    expect(search(index, "oxidise")[0].tier).toBe(1);
    expect(search(index, "rust").find((r) => r.entry.id === "course:rust-dsa")?.tier).toBe(3);
  });
});

describe("ranking", () => {
  it("puts an exact title first, then a title prefix, then a title word", () => {
    const results = search(index, "sorting");
    expect(results[0].entry.title).toBe("Sorting");
    expect(results[0].tier).toBe(1);

    const prefix = search(index, "hash");
    expect(prefix[0].tier).toBeLessThanOrEqual(2);
    const tiers = prefix.map((r) => r.tier);
    expect(tiers).toEqual([...tiers].sort((a, b) => a - b));
  });

  it("ranks a title word above a topic, and a topic above other text", () => {
    const stacks = search(index, "stacks");
    const lesson = stacks.find((r) => r.entry.id === "lesson:rust-dsa:stacks");
    const course = stacks.find((r) => r.entry.id === "course:rust-dsa");
    expect(lesson?.tier).toBe(1);
    expect(course?.tier).toBe(4);

    const rust = search(index, "rust");
    const tier = (id: string) => rust.find((r) => r.entry.id === id)?.tier;
    expect(tier("course:rust-dsa")).toBe(3);
    expect(tier("lesson:rust-dsa:stacks")).toBe(4);
  });

  it("puts a course above a lesson on a tie", () => {
    const results = search(index, "java");
    expect(results[0].entry.kind).toBe("course");
    const first = results.findIndex((r) => r.entry.kind === "lesson");
    expect(results.slice(0, first).every((r) => r.entry.kind === "course")).toBe(true);
    expect(results[0].entry.title).toBe("Filter Coffee");
  });

  it("puts the dynamic programming lesson first for dp", () => {
    expect(search(index, "dp")[0].entry.id).toBe("lesson:rust-dsa:dynamic-programming");
  });
});

describe("highlighting", () => {
  const marked = (query: string, id: string) => {
    const r = search(index, query).find((x) => x.entry.id === id)!;
    return r.ranges.map(([a, b]) => r.entry.title.slice(a, b));
  };

  it("marks the start of each matching word, in the original spelling", () => {
    expect(marked("hash", "lesson:java-collections:hashset-and-hashmap")).toEqual(["Hash", "Hash"]);
    expect(marked("hash", "lesson:java-collections:equals-and-hashcode")).toEqual(["hash"]);
    expect(marked("java hash", "lesson:java-collections:hashset-and-hashmap")).toEqual(["Hash", "Hash"]);
  });

  it("marks what a synonym stands for", () => {
    expect(marked("dp", "lesson:rust-dsa:dynamic-programming")).toEqual(["Dynamic", "programming"]);
  });

  it("gives ranges that are sorted and inside the title", () => {
    for (const q of ["hash", "a", "and", "s"]) {
      for (const r of search(index, q)) {
        let end = 0;
        for (const [a, b] of r.ranges) {
          expect(a).toBeGreaterThanOrEqual(end);
          expect(b).toBeGreaterThan(a);
          expect(b).toBeLessThanOrEqual(r.entry.title.length);
          end = b;
        }
      }
    }
  });
});

describe("the empty state", () => {
  it("says so plainly and offers three ways on", () => {
    expect(emptyState.message).toBe("Nothing matches that yet.");
    expect(emptyState.suggestions).toEqual(["Hash maps", "Sorting", "ArrayList"]);
  });

  it("is what an unknown word gets", () => {
    expect(search(index, "xyz")).toEqual([]);
    expect(resultsAnnouncement(0, "xyz")).toBe("No results for xyz.");
  });

  it("only suggests things that are there", () => {
    for (const suggestion of emptyState.suggestions) {
      expect(search(index, suggestion).length, suggestion).toBeGreaterThan(0);
    }
  });
});

describe("announcing results", () => {
  it("counts, and is silent for an empty box", () => {
    expect(resultsAnnouncement(1, "sorting")).toBe("1 result for sorting.");
    expect(resultsAnnouncement(7, "hash")).toBe("7 results for hash.");
    expect(resultsAnnouncement(0, "  ")).toBe("");
  });
});

describe("the query in the address", () => {
  const at = { pathname: "/resources/", search: "", hash: "" };

  it("reads q, trimmed and bounded", () => {
    expect(readQuery("?q=hash")).toBe("hash");
    expect(readQuery("q=hash%20map")).toBe("hash map");
    expect(readQuery("?q=%20%20java%20%20hash%20")).toBe("java hash");
    expect(readQuery("")).toBe("");
    expect(readQuery("?other=1")).toBe("");
    expect(readQuery(`?q=${"a".repeat(500)}`)).toHaveLength(maxQueryLength);
  });

  it("writes q, encoded, and keeps the rest of the address", () => {
    expect(withQuery(at, "hash")).toBe("/resources/?q=hash");
    expect(withQuery(at, "hash map")).toBe("/resources/?q=hash+map");
    expect(withQuery({ ...at, search: "?ref=nav", hash: "#study" }, "java")).toBe(
      "/resources/?ref=nav&q=java#study",
    );
  });

  it("removes q when the box is emptied", () => {
    expect(withQuery({ ...at, search: "?q=hash" }, "")).toBe("/resources/");
    expect(withQuery({ ...at, search: "?q=hash", hash: "#study" }, "  ")).toBe("/resources/#study");
    expect(withQuery({ ...at, search: "?ref=nav&q=hash" }, "")).toBe("/resources/?ref=nav");
  });

  it("round-trips", () => {
    for (const q of ["hash", "java hash", "c++ & more", "café"]) {
      const url = withQuery(at, q);
      expect(readQuery(url.slice(url.indexOf("?")))).toBe(q);
    }
  });
});
