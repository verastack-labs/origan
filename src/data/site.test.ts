import { describe, expect, it } from "vitest";
import { pages, sectionsByPath, sheets } from "./site";

describe("the drawing set", () => {
  it("gives every sheet a section list", () => {
    // A sheet missing from this map still renders, but silently loses the
    // floating section index, which is the kind of gap nobody notices until a
    // dean is halfway down the partnership page with no way back up.
    for (const sheet of sheets) {
      expect(sectionsByPath[sheet.href], `no sections registered for ${sheet.href}`).toBeDefined();
      expect(sectionsByPath[sheet.href].length).toBeGreaterThan(0);
    }
  });

  it("registers sections only for sheets that exist", () => {
    const hrefs = sheets.map((s) => s.href);
    for (const path of Object.keys(sectionsByPath)) {
      expect(hrefs, `${path} has sections but is not a sheet`).toContain(path);
    }
  });

  it("writes every href with a trailing slash", () => {
    // `trailingSlash: true` in next.config, and the nav compares the current
    // path against these literally. A missing slash means a link that never
    // marks itself current.
    for (const sheet of sheets) {
      expect(sheet.href.endsWith("/"), `${sheet.href} has no trailing slash`).toBe(true);
    }
  });

  it("excludes the overview from pages, which the sitemap adds separately", () => {
    expect(pages.map((p) => p.href)).not.toContain("/");
    expect(pages).toHaveLength(sheets.length - 1);
  });

  it("uses anchors, not routes, for sections", () => {
    for (const list of Object.values(sectionsByPath)) {
      for (const section of list) {
        expect(section.href.startsWith("#"), `${section.href} is not an anchor`).toBe(true);
      }
    }
  });
});
