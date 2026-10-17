import { describe, expect, it } from "vitest";
import * as content from "./content";
import { analyticsPage } from "./analytics";
import { coachPage } from "./coach";
import { featuresPage } from "./features";
import { javaCourse, rustCourse } from "./courses";
import { resourcesPage } from "./resources";

/**
 * The heading rule from origan-internal/docs/copy-deck.md: a heading is one
 * short line, with at most one word in the accent, and it never comes alone.
 */
const MAX = 34;

type Found = { at: string; heading: string; sub?: unknown; kicker?: unknown };

function collect(value: unknown, at: string, out: Found[]) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((v, i) => collect(v, `${at}[${i}]`, out));
    return;
  }
  const record = value as Record<string, unknown>;
  if (typeof record.heading === "string") {
    out.push({ at, heading: record.heading, sub: record.sub, kicker: record.kicker });
  }
  for (const [key, v] of Object.entries(record)) collect(v, `${at}.${key}`, out);
}

const found: Found[] = [];
for (const [name, value] of Object.entries(content)) collect(value, name, found);
collect(analyticsPage, "analyticsPage", found);
collect(coachPage, "coachPage", found);
collect(featuresPage, "featuresPage", found);
collect(resourcesPage, "resourcesPage", found);
// The course index headings. They live in the course config, not in the MDX.
for (const course of [rustCourse, javaCourse]) {
  collect({ heading: course.hero.heading, sub: course.hero.sub }, `${course.id}.hero`, found);
  collect({ heading: course.listingHeading, sub: "listing" }, `${course.id}.listing`, found);
}

const plain = (s: string) => s.replace(/\[([^\]]+)\]/g, "$1");

// A heading measures by its longest line: the hero is the one heading broken
// deliberately, and each of its lines is held to the same limit.
const longest = (s: string) => Math.max(...plain(s).split("\n").map((l) => l.length));

describe("headings", () => {
  it("finds the site's headings", () => {
    expect(found.length).toBeGreaterThan(25);
  });

  it.each(found.map((f) => [f.at, f]))("%s is one short line", (_, f) => {
    expect(longest(f.heading)).toBeLessThanOrEqual(MAX);
  });

  it.each(found.map((f) => [f.at, f]))("%s has at most one accent, well formed", (_, f) => {
    expect(f.heading.match(/\[/g)?.length ?? 0).toBeLessThanOrEqual(1);
    expect(f.heading.match(/\[/g)?.length ?? 0).toBe(f.heading.match(/\]/g)?.length ?? 0);
  });

  it.each(found.filter((f) => /\[/.test(f.heading)).map((f) => [f.at, f]))(
    "%s comes as a pair",
    (_, f) => {
      // An accented heading is a section heading, and those are always paired.
      expect(typeof f.sub === "string" || typeof f.kicker === "string").toBe(true);
    },
  );

  it("breaks a line only in the hero", () => {
    const broken = found.filter((f) => f.heading.includes("\n")).map((f) => f.at);
    expect(broken).toEqual(["hero"]);
  });

  it("never uses an em-dash", () => {
    const text = JSON.stringify([content, analyticsPage, coachPage, featuresPage, resourcesPage]);
    expect(text).not.toContain("—");
  });
});
