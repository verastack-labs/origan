import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ShelfCard } from "@/components/shelf-card";
import { liveResources, resources } from "@/data/resources";
import { buildSearchIndex } from "./search-index";
import { STARRED, liveFirst, searchWithin } from "./shelf";
import { STARS_KEY, loadStars, parseStars, rankStarred, saveStars, starAnnouncement, starsFirst, toggled } from "./stars";

const rust = liveResources.find((r) => r.id === "dsa-in-rust")!;
const known = resources.map((r) => r.id);
const ids = (items: readonly { id: string }[]) => items.map((i) => i.id);

describe("the key", () => {
  it("is origan:shelf:stars", () => {
    expect(STARS_KEY).toBe("origan:shelf:stars");
  });
});

describe("parsing what was stored", () => {
  it("reads an array of ids", () => {
    expect(parseStars('["dsa-in-rust","the-switch"]', known)).toEqual(["dsa-in-rust", "the-switch"]);
  });

  it("ignores ids that no longer exist, and repeats", () => {
    expect(parseStars('["gone","dsa-in-rust","dsa-in-rust","also-gone"]', known)).toEqual(["dsa-in-rust"]);
  });

  it("ignores anything that is not a string id", () => {
    expect(parseStars('[1,null,{"a":1},["x"],"the-switch"]', known)).toEqual(["the-switch"]);
  });

  it("is empty for nothing, for damaged JSON, and for JSON that is not an array", () => {
    expect(parseStars(null, known)).toEqual([]);
    expect(parseStars(undefined, known)).toEqual([]);
    expect(parseStars("", known)).toEqual([]);
    expect(parseStars("[not json", known)).toEqual([]);
    expect(parseStars('{"dsa-in-rust":true}', known)).toEqual([]);
    expect(parseStars('"dsa-in-rust"', known)).toEqual([]);
  });
});

describe("toggling a star", () => {
  it("adds an id that is not there, and removes one that is", () => {
    expect(toggled([], "a")).toEqual(["a"]);
    expect(toggled(["a", "b"], "a")).toEqual(["b"]);
    expect(toggled(["a"], "b")).toEqual(["a", "b"]);
  });

  it("does not change the list it was given", () => {
    const list = ["a"];
    toggled(list, "b");
    expect(list).toEqual(["a"]);
  });
});

describe("the order with stars", () => {
  const shelf = liveFirst(resources);

  it("is the shelf's own order when nothing is starred", () => {
    expect(ids(starsFirst(shelf, new Set()))).toEqual(ids(shelf));
  });

  it("puts starred items first and leaves the rest where they were", () => {
    const sorted = starsFirst(shelf, new Set(["the-switch"]));
    expect(ids(sorted)).toEqual(["the-switch", ...ids(shelf).filter((id) => id !== "the-switch")]);
  });

  it("keeps the shelf's own order inside the starred group, whatever order they were starred in", () => {
    // The shelf is newest first, so The Switch comes before Oxidise.
    const sorted = starsFirst(shelf, new Set(["dsa-in-rust", "the-switch"]));
    expect(ids(sorted).slice(0, 2)).toEqual(["the-switch", "dsa-in-rust"]);
  });

  it("puts a starred coming-soon card before the live cards that are not starred", () => {
    const sorted = starsFirst(shelf, new Set(["table-manners"]));
    expect(ids(sorted)[0]).toBe("table-manners");
    expect(ids(sorted).slice(1, 1 + liveResources.length)).toEqual(ids(liveResources));
  });

  it("ignores ids that are not on the shelf", () => {
    expect(ids(starsFirst(shelf, new Set(["nope"])))).toEqual(ids(shelf));
  });

  it("is stable, and does not change the list it was given", () => {
    const before = ids(shelf);
    starsFirst(shelf, new Set(["java-collections"]));
    expect(ids(shelf)).toEqual(before);
  });
});

describe("storage that fails", () => {
  const broken = {
    getItem: () => {
      throw new Error("SecurityError");
    },
    setItem: () => {
      throw new Error("QuotaExceededError");
    },
  };

  it("reads as an empty list, without throwing", () => {
    expect(loadStars(broken, known)).toEqual([]);
    expect(loadStars(undefined, known)).toEqual([]);
  });

  it("says a write failed, without throwing, so the caller can keep the list for the visit", () => {
    expect(saveStars(broken, ["dsa-in-rust"])).toBe(false);
    expect(saveStars(undefined, ["dsa-in-rust"])).toBe(false);
  });

  it("round-trips through storage that works", () => {
    const data = new Map<string, string>();
    const fake = { getItem: (k: string) => data.get(k) ?? null, setItem: (k: string, v: string) => void data.set(k, v) };
    expect(saveStars(fake, ["the-switch", "dsa-in-rust"])).toBe(true);
    expect(data.get(STARS_KEY)).toBe('["the-switch","dsa-in-rust"]');
    expect(loadStars(fake, known)).toEqual(["the-switch", "dsa-in-rust"]);
  });
});

describe("starring in search", () => {
  const index = buildSearchIndex();

  it("puts a starred collection's results first, then the rest in their order", () => {
    const plain = searchWithin(index, "generics", null).map((r) => r.entry.shelfId);
    const starred = searchWithin(index, "generics", null, new Set(["the-switch"])).map((r) => r.entry.shelfId);
    expect(new Set(plain).size).toBeGreaterThan(1);
    expect(starred[0]).toBe("the-switch");
    const firstOther = starred.findIndex((id) => id !== "the-switch");
    expect(starred.slice(firstOther).every((id) => id !== "the-switch")).toBe(true);
  });

  it("is the plain search when nothing is starred", () => {
    expect(searchWithin(index, "generics", null, new Set()).map((r) => r.entry.id)).toEqual(
      searchWithin(index, "generics", null).map((r) => r.entry.id),
    );
  });

  it("keeps only starred collections for the Starred chip", () => {
    const only = searchWithin(index, "generics", STARRED, new Set(["java-collections"])).map((r) => r.entry.shelfId);
    expect(only.length).toBeGreaterThan(0);
    expect(new Set(only)).toEqual(new Set(["java-collections"]));
    expect(searchWithin(index, "generics", STARRED, new Set())).toEqual([]);
  });

  it("works inside an ordinary filter too", () => {
    const results = searchWithin(index, "generics", "typescript", new Set(["the-switch"]));
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.entry.filters.includes("typescript"))).toBe(true);
  });

  it("every entry knows the shelf item it belongs to", () => {
    for (const entry of index) expect(known, entry.id).toContain(entry.shelfId);
  });

  it("ranks by any list of results with a shelf id", () => {
    const results = [{ entry: { shelfId: "a" } }, { entry: { shelfId: "b" } }, { entry: { shelfId: "a" } }];
    expect(rankStarred(results, new Set(["b"])).map((r) => r.entry.shelfId)).toEqual(["b", "a", "a"]);
  });
});

describe("what a screen reader hears", () => {
  it("says a star moved to the top, and an unstar", () => {
    expect(starAnnouncement("Oxidise", true)).toBe("Oxidise starred, moved to the top");
    expect(starAnnouncement("Oxidise", false)).toBe("Oxidise unstarred");
  });
});

describe("the star on a card", () => {
  const html = (resource: (typeof resources)[number], starred: boolean) =>
    renderToStaticMarkup(createElement(ShelfCard, { resource, count: 3, hidden: false, starred, onToggleStar: () => {} }));

  it("is a button that says what it does and whether it is pressed", () => {
    const off = html(rust, false);
    expect(off).toContain('aria-label="Star Oxidise"');
    expect(off).toContain('aria-pressed="false"');
    const on = html(rust, true);
    expect(on).toContain('aria-label="Unstar Oxidise"');
    expect(on).toContain('aria-pressed="true"');
  });

  it("sits beside the link, never inside it", () => {
    const markup = html(rust, false);
    const link = /<a [^>]*>[\s\S]*?<\/a>/.exec(markup)![0];
    expect(link).not.toContain("<button");
    expect(markup.indexOf("<button")).toBeGreaterThan(markup.indexOf("</a>"));
  });

  it("is on a coming-soon card too", () => {
    const coming = resources.find((r) => r.status === "coming")!;
    expect(html(coming, false)).toContain(`aria-label="Star ${coming.name}"`);
  });

  it("is drawn only when something handles it", () => {
    const bare = renderToStaticMarkup(createElement(ShelfCard, { resource: rust, count: 3, hidden: false }));
    expect(bare).not.toContain("<button");
  });
});
