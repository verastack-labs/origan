import { describe, expect, it } from "vitest";
import { buildLlmsTxt, sheetSummaries } from "./llms";
import { courses, courseUrl } from "@/data/courses";
import { sheets, site } from "@/data/site";
import { getLessons } from "@/lib/lessons";

const text = buildLlmsTxt();
const pages = text.slice(text.indexOf("## Pages"), text.indexOf("\n## ", text.indexOf("## Pages") + 1));

describe("llms.txt", () => {
  it("keeps the title and the summary line at the top", () => {
    expect(text.startsWith(`# ${site.name}\n\n> ${site.description}\n`)).toBe(true);
  });

  it("links every sheet as Markdown, with a one-line description", () => {
    for (const sheet of sheets) {
      expect(sheetSummaries[sheet.href], `no summary for ${sheet.href}`).toBeTruthy();
      expect(pages).toContain(`- [${sheet.label}](${site.url}${sheet.href}): ${sheetSummaries[sheet.href]}`);
    }
  });

  it.each(courses.map((c) => [c.name, c] as const))("links the %s index and every published lesson", (_, course) => {
    expect(pages).toContain(`](${site.url}${course.path}): `);
    for (const lesson of getLessons(course)) {
      expect(pages).toContain(`- [${lesson.title}](${courseUrl(course, lesson.slug)}): ${lesson.sub}`);
    }
  });

  it("lists each course as the brand with its descriptor", () => {
    expect(pages).toContain("[Oxidise (DSA in Rust)]");
    expect(pages).toContain("[Filter Coffee (Java Collections)]");
  });

  it("writes every page entry as a Markdown link and a description", () => {
    const entries = pages.split("\n").filter((l) => l.startsWith("- "));
    expect(entries.length).toBeGreaterThanOrEqual(sheets.length + courses.length);
    for (const line of entries) expect(line).toMatch(/^- \[[^\]]+\]\(https:\/\/[^)]+\): \S/);
  });

  it("never uses an em-dash", () => {
    expect(text).not.toContain("—");
  });
});
