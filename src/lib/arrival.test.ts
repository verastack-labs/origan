import { describe, expect, it } from "vitest";
import { activeSlug, arrivalScrollTop, isInternalMove } from "./arrival";

describe("arrivalScrollTop", () => {
  it("puts the article just under the sticky chrome", () => {
    
    expect(arrivalScrollTop({ articleTop: 1800, scrollY: 1200, stickyBottom: 63, gap: 16 })).toBeNull();
    // Reader is far below the article; it sits 2400px above the viewport top.
    expect(arrivalScrollTop({ articleTop: -2400, scrollY: 3000, stickyBottom: 63, gap: 16 })).toBe(521);
  });

  it("leaves a reader who is already above the line alone", () => {
    expect(arrivalScrollTop({ articleTop: 120, scrollY: 0, stickyBottom: 63 })).toBeNull();
  });

  it("allows for the chapters bar on a phone", () => {
    const desktop = arrivalScrollTop({ articleTop: -500, scrollY: 900, stickyBottom: 63 });
    const phone = arrivalScrollTop({ articleTop: -500, scrollY: 900, stickyBottom: 108 });
    expect(desktop).toBe(321);
    expect(phone).toBe(276);
  });

  it("never goes above the top of the page", () => {
    expect(arrivalScrollTop({ articleTop: -100, scrollY: 100, stickyBottom: 300 })).toBe(0);
  });
});

describe("activeSlug", () => {
  const slugs = ["setup", "binary-search", "bfs-dfs"];
  it("maps the selected segment to a chapter", () => {
    expect(activeSlug("binary-search", slugs)).toBe("binary-search");
  });
  it("is null for the course index, or an unknown segment", () => {
    expect(activeSlug(null, slugs)).toBeNull();
    expect(activeSlug("nope", slugs)).toBeNull();
  });
  it("decodes an encoded segment", () => {
    expect(activeSlug("bfs%2Ddfs", slugs)).toBe("bfs-dfs");
  });
});

describe("isInternalMove", () => {
  const plain = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false };
  const origin = "https://origan.verastack.dev";
  it("counts a plain click on a same-site link", () => {
    expect(isInternalMove({ href: `${origin}/learn/rust-dsa/setup/`, target: "", download: false }, plain, origin)).toBe(true);
  });
  it("ignores new tabs, modified clicks and other sites", () => {
    expect(isInternalMove({ href: `${origin}/a/`, target: "_blank", download: false }, plain, origin)).toBe(false);
    expect(isInternalMove({ href: `${origin}/a/`, target: "", download: false }, { ...plain, ctrlKey: true }, origin)).toBe(false);
    expect(isInternalMove({ href: "https://example.com/", target: "", download: false }, plain, origin)).toBe(false);
  });
});

import { sheetKey } from "./arrival";

describe("sheetKey", () => {
  it("shares one key across a course's lessons", () => {
    expect(sheetKey("/learn/rust-dsa/binary-search/")).toBe("/learn/rust-dsa/*");
    expect(sheetKey("/learn/rust-dsa/heaps")).toBe("/learn/rust-dsa/*");
  });
  it("keeps the index and other pages apart", () => {
    expect(sheetKey("/learn/rust-dsa/")).toBe("/learn/rust-dsa/");
    expect(sheetKey("/resources/")).toBe("/resources/");
    expect(sheetKey("/learn/rust-dsa/setup/") === sheetKey("/learn/java-collections/setup/")).toBe(false);
  });
});
