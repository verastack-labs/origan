import { describe, expect, it } from "vitest";
import { liveResources, resources, shelfFilters } from "@/data/resources";
import { buildSearchIndex } from "./search-index";
import {
  countByFilter,
  countLabel,
  filterAnnouncement,
  filterItems,
  liveFirst,
  readFilter,
  searchWithin,
  withFilter,
} from "./shelf";
import { withQuery } from "./search";

const ids = shelfFilters.map((f) => f.id);
const index = buildSearchIndex();

describe("the shelf's filters", () => {
  it("have unique ids, a label and a one-line hint", () => {
    expect(new Set(ids).size).toBe(ids.length);
    for (const f of shelfFilters) {
      expect(f.label.length, f.id).toBeGreaterThan(0);
      expect(f.hint.length, f.id).toBeGreaterThan(0);
      expect(f.hint, f.id).not.toContain("—");
    }
  });

  it("are the ones the shelf was designed with, in order", () => {
    expect(shelfFilters.slice(0, 4).map((f) => [f.label, f.hint])).toEqual([
      ["Rust", "DSA, compiled and tested"],
      ["Java", "the Collections Framework"],
      ["TypeScript", "coming from JavaScript"],
      ["Web", "the web and its tools"],
    ]);
  });

  it("are the only ones an item can sit under, and each has at least one item", () => {
    for (const r of resources) {
      expect(r.filters.length, r.id).toBeGreaterThan(0);
      for (const f of r.filters) expect(ids, `${r.id} uses an unknown filter "${f}"`).toContain(f);
    }
    for (const f of ids) expect(resources.some((r) => r.filters.includes(f)), `no item under ${f}`).toBe(true);
  });
});

describe("filtering the shelf", () => {
  it("shows everything for All, in the shelf's own order", () => {
    expect(filterItems(resources, null).map((r) => r.id)).toEqual(resources.map((r) => r.id));
  });

  it("shows only the items under a filter", () => {
    expect(filterItems(resources, "rust").map((r) => r.id)).toEqual(["dsa-in-rust"]);
    expect(filterItems(resources, "web").map((r) => r.id)).toEqual(["off-the-syllabus"]);
    expect(filterItems(resources, "nothing")).toEqual([]);
  });

  it("lets an item sit under more than one filter", () => {
    const items = [
      { id: "a", filters: ["rust", "web"] },
      { id: "b", filters: ["web"] },
    ];
    expect(filterItems(items, "web").map((i) => i.id)).toEqual(["a", "b"]);
    expect(filterItems(items, "rust").map((i) => i.id)).toEqual(["a"]);
  });

  it("counts the items under each filter from the data", () => {
    const counts = countByFilter(ids, resources);
    expect(counts.rust.total).toBe(1);
    expect(counts.java.total).toBe(1);
    expect(counts.typescript.total).toBe(1);
    expect(counts.web.total).toBe(1);
    const manual = { filters: ["x"], status: "coming" as const };
    expect(countByFilter(["x"], [manual, { filters: ["x"] }]).x).toEqual({ total: 2, live: 1, coming: 1 });
  });

  it("writes a count as the number, and marks the part that is still coming", () => {
    expect(countLabel({ total: 1, live: 1, coming: 0 })).toBe("1");
    expect(countLabel({ total: 1, live: 0, coming: 1 })).toBe("1 soon");
    expect(countLabel({ total: 3, live: 2, coming: 1 })).toBe("3 · 1 soon");
  });

  it("puts live items before coming ones and keeps the order within each", () => {
    const items = [
      { id: "a", filters: [], status: "coming" as const },
      { id: "b", filters: [], status: "live" as const },
      { id: "c", filters: [], status: "coming" as const },
      { id: "d", filters: [], status: "live" as const },
    ];
    expect(liveFirst(items).map((i) => i.id)).toEqual(["b", "d", "a", "c"]);
  });

  it("announces how many items are showing", () => {
    expect(filterAnnouncement(1, "Web")).toBe("Showing 1 item for Web.");
    expect(filterAnnouncement(2, "Rust")).toBe("Showing 2 items for Rust.");
    expect(filterAnnouncement(4, null)).toBe("Showing all 4 items on the shelf.");
  });
});

describe("the filter in the address", () => {
  it("reads ?filter=, with or without the question mark", () => {
    expect(readFilter("?filter=rust", ids)).toBe("rust");
    expect(readFilter("filter=web", ids)).toBe("web");
    expect(readFilter("?filter=RUST", ids)).toBe("rust");
  });

  it("is All when there is no filter, or when the one named does not exist", () => {
    expect(readFilter("", ids)).toBeNull();
    expect(readFilter("?q=hash", ids)).toBeNull();
    expect(readFilter("?filter=cobol", ids)).toBeNull();
    expect(readFilter("?filter=", ids)).toBeNull();
  });

  it("sets and removes the parameter, keeping the rest", () => {
    const here = { pathname: "/resources/", search: "", hash: "" };
    expect(withFilter(here, "rust")).toBe("/resources/?filter=rust");
    expect(withFilter({ ...here, search: "?filter=rust" }, null)).toBe("/resources/");
    expect(withFilter({ ...here, search: "?filter=rust", hash: "#study" }, "web")).toBe("/resources/?filter=web#study");
  });

  it("lives beside ?q= without either one losing the other", () => {
    const here = { pathname: "/resources/", search: "?q=hash", hash: "" };
    const withBoth = withFilter(here, "java");
    expect(withBoth).toBe("/resources/?q=hash&filter=java");
    const url = new URL(withBoth, "https://x.test");
    expect(withQuery({ pathname: url.pathname, search: url.search, hash: "" }, "")).toBe("/resources/?filter=java");
    expect(readFilter(url.search, ids)).toBe("java");
  });
});

describe("searching within a filter", () => {
  const titles = (query: string, filter: string | null) => searchWithin(index, query, filter).map((r) => r.entry.title);

  it("is the plain search for All", () => {
    expect(titles("hash", null)).toContain("Hash maps and sets");
    expect(titles("hash", null)).toContain("HashSet and HashMap");
  });

  it("looks only at what the filter left", () => {
    expect(titles("hash", "rust")).toContain("Hash maps and sets");
    expect(titles("hash", "rust")).not.toContain("HashSet and HashMap");
    expect(titles("hash", "java")).not.toContain("Hash maps and sets");
    expect(titles("hash", "web")).toEqual([]);
  });

  it("gives every entry the filters of its collection", () => {
    for (const entry of index) {
      expect(entry.filters.length, entry.id).toBeGreaterThan(0);
    }
    const lesson = index.find((e) => e.id === "lesson:rust-dsa:stacks");
    expect(lesson?.filters).toEqual(["rust"]);
    expect(index.find((e) => e.id === "article:core-web-vitals")?.filters).toEqual(["web"]);
  });
});

describe("the live shelf", () => {
  it("is every resource that has pages", () => {
    expect(liveResources.map((r) => r.id)).toEqual(resources.filter((r) => r.status === "live").map((r) => r.id));
    for (const r of liveResources) expect(r.href).toMatch(/^\/learn\/[a-z-]+\/$/);
  });
});
