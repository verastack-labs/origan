import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { curriculum, lessonParts } from "./rust-dsa";
import { resources, resourcesPage } from "./resources";
import { getLessons } from "@/lib/lessons";
import { hasRegion } from "@/lib/snippets";

/**
 * The learning section's content rules. Lesson headings are written in the MDX
 * as <Part heading="..." sub="..." />, so `copy.test.ts` (which reads the data
 * files) never sees them. This holds them to the same rules, and checks that
 * every snippet a lesson names exists in the tested crate.
 */
const MAX = 34;
const EM_DASH = "—";
const root = process.cwd();
const dir = join(root, "src", "content", "learn", "rust-dsa");

const lessons = getLessons();
const sources = new Map(
  readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => [f, readFileSync(join(dir, f), "utf8")] as const),
);

const plain = (s: string) => s.replace(/\[([^\]]+)\]/g, "$1");
const attr = (tag: string, name: string) => new RegExp(`${name}="([^"]*)"`).exec(tag)?.[1];

function checkHeading(heading: string) {
  expect(plain(heading).length).toBeLessThanOrEqual(MAX);
  expect(heading.match(/\[/g)?.length ?? 0).toBeLessThanOrEqual(1);
  expect(heading.match(/\[/g)?.length ?? 0).toBe(heading.match(/\]/g)?.length ?? 0);
}

describe("the curriculum", () => {
  it("numbers Part 1 from 0 to 12 with no gaps", () => {
    expect(curriculum.map((c) => c.order)).toEqual(Array.from({ length: 13 }, (_, i) => i));
  });

  it("has unique slugs", () => {
    expect(new Set(curriculum.map((c) => c.slug)).size).toBe(curriculum.length);
  });
});

describe("the published lessons", () => {
  it("are lessons 0 to 7, in teaching order", () => {
    expect(lessons.map((l) => l.order)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it.each(lessons.map((l) => [l.slug, l]))("%s matches its curriculum entry", (_, lesson) => {
    const entry = curriculum.find((c) => c.slug === lesson.slug);
    expect(entry, `${lesson.slug} is not in the curriculum`).toBeDefined();
    expect(entry?.order).toBe(lesson.order);
    expect(lesson.part).toBe(1);
    expect(lesson.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(lesson.description.length).toBeGreaterThan(60);
    expect(lesson.description.length).toBeLessThanOrEqual(220);
  });

  it.each(lessons.map((l) => [l.slug, l]))("%s has a short title and a subheading", (_, lesson) => {
    checkHeading(lesson.title);
    expect(lesson.sub.length).toBeGreaterThan(0);
  });

  it.each(lessons.map((l) => [l.slug, l]))("%s is in a file named for its slug", (_, lesson) => {
    expect([...sources.keys()]).toContain(`${lesson.slug}.mdx`);
  });
});

describe("each lesson's seven parts", () => {
  it.each(lessons.map((l) => [l.slug, l]))("%s has them in order, as pairs", (_, lesson) => {
    const tags = [...lesson.body.matchAll(/<Part\b[^>]*\/>/g)].map((m) => m[0]);
    expect(tags.map((t) => attr(t, "id"))).toEqual(lessonParts.map((p) => p.id));
    for (const tag of tags) {
      const heading = attr(tag, "heading");
      const sub = attr(tag, "sub");
      expect(heading, tag).toBeTruthy();
      expect(sub, `${tag} needs a subheading`).toBeTruthy();
      checkHeading(heading!);
    }
  });

  it.each(lessons.map((l) => [l.slug, l]))("%s has three practice problems with hints", (_, lesson) => {
    const problems = [...lesson.body.matchAll(/<Practice\b[\s\S]*?\n>/g)].map((m) => m[0]);
    expect(problems).toHaveLength(3);
    for (const problem of problems) {
      const hints = /hints=\{\[([\s\S]*?)\]\}/.exec(problem)?.[1] ?? "";
      expect(hints.split('",').length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("snippets", () => {
  it.each(lessons.map((l) => [l.slug, l]))("%s only names regions that exist in the crate", (_, lesson) => {
    const named: [string, string][] = [];

    for (const m of lesson.body.matchAll(/<Snippet\b[^>]*\/>/g)) {
      const file = attr(m[0], "file")!;
      named.push([file, attr(m[0], "name")!]);
      for (const extra of (attr(m[0], "also") ?? "").split(",").filter(Boolean)) {
        named.push([file, extra.trim()]);
      }
      const demo = attr(m[0], "demo");
      if (demo) named.push([file, demo]);
    }
    for (const m of lesson.body.matchAll(/<Practice\b[\s\S]*?\n>/g)) {
      const file = attr(m[0], "file")!;
      named.push([file, attr(m[0], "start")!], [file, attr(m[0], "solution")!]);
      for (const extra of (attr(m[0], "also") ?? "").split(",").filter(Boolean)) {
        named.push([file, extra.trim()]);
      }
    }

    expect(named.length).toBeGreaterThan(8);
    for (const [file, name] of named) {
      expect(hasRegion(file, name), `${file}.rs has no region "${name}"`).toBe(true);
    }
  });

  it("never types Rust into a lesson: it comes from the tested crate", () => {
    for (const [file, source] of sources) {
      expect(source, `${file} has a rust code fence`).not.toMatch(/^```(rust|rs)\b/m);
    }
  });
});

describe("writing rules", () => {
  it("never uses an em-dash anywhere in the section", () => {
    const rustDir = join(root, "rust", "rust-dsa", "src");
    const files = [
      ...[...sources].map(([name, text]) => [name, text] as const),
      ...readdirSync(rustDir).map((f) => [f, readFileSync(join(rustDir, f), "utf8")] as const),
      ["curriculum", JSON.stringify(curriculum)] as const,
      ["resources", JSON.stringify([resources, resourcesPage])] as const,
    ];
    for (const [name, text] of files) {
      expect(text, `${name} has an em-dash`).not.toContain(EM_DASH);
    }
  });

  it("makes no claim about outcomes or placements", () => {
    const banned = /\b(guarantee|guaranteed|get placed|land a job|crack|100%)\b/i;
    for (const [file, source] of sources) {
      expect(source, `${file} makes an outcome claim`).not.toMatch(banned);
    }
  });
});

describe("resources", () => {
  it("lists DSA in Rust first, with a heading that fits one line", () => {
    expect(resources[0].name).toBe("DSA in Rust");
    checkHeading(resourcesPage.heading);
  });
});
