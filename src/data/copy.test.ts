import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import * as content from "./content";
import { analyticsPage } from "./analytics";
import { coachPage } from "./coach";
import { featuresPage } from "./features";
import { javaCourse, rustCourse, switchCourse } from "./courses";
import { resourcesPage } from "./resources";
import { offTheSyllabus, otsSeries } from "./off-the-syllabus";
import { site } from "./site";
import { Faq, faqJsonLd } from "@/components/faq";
import { siteGraph } from "@/components/json-ld";
import { buildLlmsTxt } from "@/lib/llms";

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
for (const course of [rustCourse, javaCourse, switchCourse]) {
  collect({ heading: course.hero.heading, sub: course.hero.sub }, `${course.id}.hero`, found);
  collect({ heading: course.listingHeading, sub: "listing" }, `${course.id}.listing`, found);
  for (const [part, heading] of Object.entries(course.partHeadings ?? {})) {
    collect({ heading, sub: "listing" }, `${course.id}.part${part}`, found);
  }
}

// Off the Syllabus: the index hero and the heading above each series.
collect({ heading: offTheSyllabus.heading, sub: "hero" }, "off-the-syllabus.hero", found);
for (const series of otsSeries) {
  collect({ heading: series.heading, sub: series.sub }, `off-the-syllabus.${series.id}`, found);
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
    const text = JSON.stringify([content, analyticsPage, coachPage, featuresPage, resourcesPage, site]);
    expect(text).not.toContain("—");
    expect(buildLlmsTxt()).not.toContain("—");
    expect(JSON.stringify(siteGraph())).not.toContain("—");
  });
});

/** Everything public and written by us, except Datum's charts, which are labelled as invented. */
const publicCopy = () =>
  JSON.stringify([content, coachPage, featuresPage, resourcesPage, site]) +
  buildLlmsTxt() +
  JSON.stringify(siteGraph()) +
  JSON.stringify(faqJsonLd());

describe("the public pages", () => {
  it("carry no price and no percentage", () => {
    const text = publicCopy();
    expect(text).not.toMatch(/[%₹$]/);
    expect(text).not.toMatch(/(rupees?|INR|lakhs?|crores?)/i);
  });

  it("never name a competitor", () => {
    expect(publicCopy()).not.toMatch(/cruxion|kodcampus/i);
  });

  it("offers three ways to buy, the recommended one first", () => {
    const { items, note } = content.partnership.ways;
    expect(items).toHaveLength(3);
    expect(items.map((i) => i.recommended)).toEqual([true, false, false]);
    expect(items[0].key).toBe("Origan with a Campus Coach");
    expect(note).toBe("Students get Origan through their college. It can't be bought by individual students.");
  });

  it("says the Coach alone can make a difference, and that Origan alone has no student support", () => {
    const [, coachOnly, platformOnly] = content.partnership.ways.items;
    expect(coachOnly.body).toContain("The Coach alone can make a difference");
    expect(platformOnly.body).toContain("no student support");
  });

  it("keeps the Open Shelf apart from Origan", () => {
    expect(resourcesPage.sub).toContain("Separate from Origan");
    expect(resourcesPage.description).toContain("separate from Origan");
    expect(buildLlmsTxt()).toContain("## The Open Shelf is separate");
  });
});

describe("the FAQ", () => {
  it("has six to twelve questions, each answered in one to three sentences", () => {
    expect(content.faq.items.length).toBeGreaterThanOrEqual(6);
    expect(content.faq.items.length).toBeLessThanOrEqual(12);
    for (const { q, a } of content.faq.items) {
      expect(q.endsWith("?")).toBe(true);
      const sentences = a.split(/(?<=[.!?])\s+/).length;
      expect(sentences, q).toBeGreaterThanOrEqual(1);
      expect(sentences, q).toBeLessThanOrEqual(3);
    }
  });

  it("states no price, and no digit-led claim", () => {
    const text = content.faq.items.map((i) => i.a).join(" ");
    expect(text).not.toMatch(/[₹$]|\d/);
  });

  it("answers the positioning questions", () => {
    const questions = content.faq.items.map((i) => i.q);
    for (const q of [
      "Does Origan make its own courses?",
      "Can we take the Campus Coach without the platform?",
      "Can students sign up on their own?",
      "What is the Open Shelf?",
    ]) {
      expect(questions).toContain(q);
    }
  });

  it("emits FAQPage structured data that matches the visible questions and answers", () => {
    const ld = faqJsonLd();
    expect(ld.mainEntity.map((e) => [e.name, e.acceptedAnswer.text])).toEqual(
      content.faq.items.map((i) => [i.q, i.a]),
    );
    const markup = renderToStaticMarkup(createElement(Faq));
    const visible = (text: string) => text.replace(/&#x27;/g, "'").replace(/&amp;/g, "&");
    for (const { q, a } of content.faq.items) {
      expect(visible(markup)).toContain(q);
      expect(visible(markup)).toContain(a);
    }
    const embedded = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(markup)?.[1];
    expect(JSON.parse(embedded ?? "null")).toEqual(ld);
  });
});
