import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { javaCourse } from "./courses";
import { resources } from "./resources";
import { getLessons } from "@/lib/lessons";
import { hasRegion } from "@/lib/snippets";

/**
 * The Java Collections section's content rules, the same ones
 * `lessons.test.ts` holds DSA in Rust to. Lesson headings are written in the
 * MDX as <Part heading="..." sub="..." />, so `copy.test.ts` never sees them.
 * This holds them to the same rules, and checks that every snippet a lesson
 * names exists in the tested Java project.
 */
const MAX = 34;
const EM_DASH = "—";
const root = process.cwd();
const dir = join(root, ...javaCourse.contentDir);
const javaDir = join(root, ...javaCourse.snippets.dir);

const lessons = getLessons(javaCourse);
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

describe("the Java Collections curriculum", () => {
  const { curriculum } = javaCourse;

  it("numbers the lessons from 0 to 12 with no gaps", () => {
    expect(curriculum.map((c) => c.order)).toEqual(Array.from({ length: 13 }, (_, i) => i));
  });

  it("has unique slugs", () => {
    expect(new Set(curriculum.map((c) => c.slug)).size).toBe(curriculum.length);
  });
});

describe("the published Java lessons", () => {
  it("are lessons 0 to 9, in teaching order", () => {
    expect(lessons.map((l) => l.order)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it.each(lessons.map((l) => [l.slug, l]))("%s matches its curriculum entry", (_, lesson) => {
    const entry = javaCourse.curriculum.find((c) => c.slug === lesson.slug);
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

describe("each Java lesson's seven parts", () => {
  it.each(lessons.map((l) => [l.slug, l]))("%s has them in order, as pairs", (_, lesson) => {
    const tags = [...lesson.body.matchAll(/<Part\b[^>]*\/>/g)].map((m) => m[0]);
    expect(tags.map((t) => attr(t, "id"))).toEqual(javaCourse.parts.map((p) => p.id));
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

  it.each(lessons.map((l) => [l.slug, l]))("%s has a Remember line and interview notes", (_, lesson) => {
    expect(lesson.body).toContain("**Remember:**");
    expect(lesson.body).toMatch(/<Part id="interview"/);
  });
});

describe("Java snippets", () => {
  it.each(lessons.map((l) => [l.slug, l]))("%s only names regions that exist in the project", (_, lesson) => {
    const named: [string, string][] = [];

    for (const m of lesson.body.matchAll(/<Snippet\b[^>]*\/>/g)) {
      named.push([attr(m[0], "file")!, attr(m[0], "name")!]);
    }
    for (const m of lesson.body.matchAll(/<Practice\b[\s\S]*?\n>/g)) {
      const file = attr(m[0], "file")!;
      named.push([file, attr(m[0], "start")!], [file, attr(m[0], "solution")!]);
    }

    expect(named.length).toBeGreaterThan(6);
    for (const [file, name] of named) {
      expect(hasRegion(file, name, javaCourse.snippets), `${file}.java has no region "${name}"`).toBe(true);
    }
  });

  it("never types Java into a lesson: it comes from the tested project", () => {
    for (const [file, source] of sources) {
      expect(source, `${file} has a java code fence`).not.toMatch(/^```java\b/m);
    }
  });

  it("has a test class for every lesson class", () => {
    const tests = readdirSync(join(root, "java", "java-collections", "test"));
    for (const f of readdirSync(javaDir).filter((n) => /^Lesson\d/.test(n))) {
      expect(tests, `no test for ${f}`).toContain(f.replace(".java", "Test.java"));
    }
  });
});

describe("Java writing rules", () => {
  it("never uses an em-dash anywhere in the section", () => {
    const projectDirs = [javaDir, join(root, "java", "java-collections", "test")];
    const files = [
      ...[...sources].map(([name, text]) => [name, text] as const),
      ...projectDirs.flatMap((d) => readdirSync(d).map((f) => [f, readFileSync(join(d, f), "utf8")] as const)),
      ["curriculum", JSON.stringify(javaCourse)] as const,
      ["resources", JSON.stringify(resources)] as const,
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

describe("Java resources", () => {
  it("lists Java Collections second", () => {
    expect(resources[1].name).toBe("Java Collections");
    expect(resources[1].href).toBe("/learn/java-collections/");
  });
});
