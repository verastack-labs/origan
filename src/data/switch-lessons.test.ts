import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { switchCourse } from "./courses";
import { liveResources as resources } from "./resources";
import { getLessons } from "@/lib/lessons";
import { hasRegion } from "@/lib/snippets";
import { JS_SOURCE, JSDOC_SOURCE, TS_SOURCE } from "@/lib/ts-snippets";

/**
 * The Switch's content rules, the same ones `java-lessons.test.ts` holds Java
 * Collections to. Lesson headings are written in the MDX as
 * <Part heading="..." sub="..." />, so `copy.test.ts` never sees them; this
 * holds them to the same rules, and checks that every snippet a lesson names
 * exists in the checked project under `ts/the-switch/`.
 */
const MAX = 34;
const EM_DASH = "—";
const root = process.cwd();
const dir = join(root, ...switchCourse.contentDir);
const projectDir = join(root, ...switchCourse.snippets.dir);

const lessons = getLessons(switchCourse);
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

describe("The Switch curriculum", () => {
  const { curriculum } = switchCourse;

  it("numbers the lessons from 0 to 12 with no gaps", () => {
    expect(curriculum.map((c) => c.order)).toEqual(Array.from({ length: 13 }, (_, i) => i));
  });

  it("has unique slugs", () => {
    expect(new Set(curriculum.map((c) => c.slug)).size).toBe(curriculum.length);
  });

  it("is named The Switch, always with its descriptor", () => {
    expect(switchCourse.name).toBe("The Switch");
    expect(switchCourse.descriptor).toBe("JavaScript to TypeScript");
    expect(switchCourse.path).toBe("/learn/js-to-ts/");
    expect(switchCourse.languageName).toBe("TypeScript");
  });

  it("puts every lesson in one part", () => {
    expect(curriculum.every((c) => (c.part ?? 1) === 1)).toBe(true);
  });
});

describe("the published lessons of The Switch", () => {
  it("are the first lessons of the curriculum, in teaching order", () => {
    expect(lessons.map((l) => l.order)).toEqual(Array.from({ length: lessons.length }, (_, i) => i));
    expect(lessons.length).toBeGreaterThanOrEqual(1);
    expect(lessons.length).toBeLessThanOrEqual(13);
  });

  it.each(lessons.map((l) => [l.slug, l]))("%s matches its curriculum entry", (_, lesson) => {
    const entry = switchCourse.curriculum.find((c) => c.slug === lesson.slug);
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

/**
 * Lesson 12 is a reference page. It has topic groups where the others have the
 * seven parts, and compact rows where the others have a practice set.
 */
const reference = new Set(["the-cheat-sheet"]);
const standard = lessons.filter((l) => !reference.has(l.slug));
const references = lessons.filter((l) => reference.has(l.slug));

describe("each Switch lesson's seven parts", () => {
  it.each(lessons.map((l) => [l.slug, l]))("%s has its parts in order, as pairs", (_, lesson) => {
    const tags = [...lesson.body.matchAll(/<Part\b[^>]*\/>/g)].map((m) => m[0]);
    const expected = switchCourse.lessonParts?.[lesson.slug] ?? switchCourse.parts;
    expect(tags.map((t) => attr(t, "id"))).toEqual(expected.map((p) => p.id));
    for (const tag of tags) {
      const heading = attr(tag, "heading");
      const sub = attr(tag, "sub");
      expect(heading, tag).toBeTruthy();
      expect(sub, `${tag} needs a subheading`).toBeTruthy();
      checkHeading(heading!);
    }
  });

  it.each(standard.map((l) => [l.slug, l]))("%s has three practice problems with hints", (_, lesson) => {
    const problems = [...lesson.body.matchAll(/<Practice\b[\s\S]*?\n>/g)].map((m) => m[0]);
    expect(problems).toHaveLength(3);
    for (const problem of problems) {
      const hints = /hints=\{\[([\s\S]*?)\]\}/.exec(problem)?.[1] ?? "";
      expect(hints.split('",').length).toBeGreaterThanOrEqual(2);
    }
  });

  it.each(standard.map((l) => [l.slug, l]))("%s has a Remember line and interview notes", (_, lesson) => {
    expect(lesson.body).toContain("**Remember:**");
    expect(lesson.body).toMatch(/<Part id="interview"/);
  });

  it.each(standard.map((l) => [l.slug, l]))("%s shows JavaScript beside TypeScript", (_, lesson) => {
    expect(lesson.body).toMatch(/<Compare\b/);
  });

  it.each(references.map((l) => [l.slug, l]))("%s is rows of JavaScript beside TypeScript, grouped by topic", (_, lesson) => {
    const rows = [...lesson.body.matchAll(/<CheatRow\b/g)];
    expect(rows.length).toBeGreaterThanOrEqual(30);
    expect(lesson.body).not.toMatch(/<Practice\b/);
    // Every group has at least one row under it.
    const groups = lesson.body.split(/<Part\b[^>]*\/>/).slice(1);
    expect(groups.length).toBe(switchCourse.lessonParts?.[lesson.slug]?.length);
    for (const group of groups) expect(group).toMatch(/<CheatRow\b/);
  });

  it.each(references.map((l) => [l.slug, l]))("%s links back to every earlier lesson", (_, lesson) => {
    const linked = new Set(
      [...lesson.body.matchAll(/<CheatRow\b(?:"[^"]*"|[^>"])*>/g)].flatMap((m) => {
        const order = /\blesson="(\d+)"/.exec(m[0])?.[1];
        return order ? [Number(order)] : [];
      }),
    );
    // Lessons 0 and 1 are about whether and how to start, so they have no code to compare.
    // The page links them in its opening words instead.
    for (const other of lessons.filter((l) => l.order >= 2 && l.order < lesson.order)) {
      expect(linked.has(other.order), `no row links back to lesson ${other.order}`).toBe(true);
    }
    expect(lesson.body).toContain("/learn/js-to-ts/why-switch/");
    expect(lesson.body).toContain("/learn/js-to-ts/setting-up/");
  });
});

describe("Switch snippets", () => {
  it.each(lessons.map((l) => [l.slug, l]))("%s only names regions that exist in the checked project", (_, lesson) => {
    const named: [string, string, "ts" | "js" | "jsdoc"][] = [];

    for (const m of lesson.body.matchAll(/<Snippet\b[^>]*\/>/g)) {
      const js = /\sjs(\s|\/|=\{true\})/.test(m[0]);
      const jsdoc = /\sjsdoc(\s|\/|=\{true\})/.test(m[0]);
      named.push([attr(m[0], "file")!, attr(m[0], "name")!, jsdoc ? "jsdoc" : js ? "js" : "ts"]);
      for (const extra of (attr(m[0], "also") ?? "").split(",").filter(Boolean)) {
        named.push([attr(m[0], "file")!, extra.trim(), "ts"]);
      }
    }
    for (const m of lesson.body.matchAll(/<Compare\b[^>]*\/>/g)) {
      const file = attr(m[0], "file")!;
      const name = attr(m[0], "name")!;
      named.push([file, name, "js"]);
      const fail = attr(m[0], "fail");
      if (fail) named.push([`errors/${fail}`, "code", "ts"]);
      else named.push([file, name, "ts"]);
    }
    for (const m of lesson.body.matchAll(/<CheatRow\b((?:"[^"]*"|[^>"])*)>/g)) {
      const file = attr(m[1], "file")!;
      const name = attr(m[1], "name")!;
      named.push([file, name, "js"]);
      const fail = attr(m[1], "fail");
      if (fail) named.push([`errors/${fail}`, "code", "ts"]);
      else named.push([file, name, "ts"]);
    }
    for (const m of lesson.body.matchAll(/<Fails\b[^>]*\/>/g)) {
      const jsdoc = /\sjsdoc(\s|\/|=\{true\})/.test(m[0]);
      if (jsdoc) named.push([attr(m[0], "file")!, attr(m[0], "name") ?? "code", "jsdoc"]);
      else named.push([`errors/${attr(m[0], "file")!}`, attr(m[0], "name") ?? "code", "ts"]);
    }
    for (const m of lesson.body.matchAll(/<Practice\b[\s\S]*?\n>/g)) {
      const file = attr(m[0], "file")!;
      named.push([file, attr(m[0], "start")!, "js"], [file, attr(m[0], "solution")!, "ts"]);
    }

    expect(named.length).toBeGreaterThan(6);
    for (const [file, name, kind] of named) {
      const source = kind === "js" ? JS_SOURCE : kind === "jsdoc" ? JSDOC_SOURCE : TS_SOURCE;
      expect(hasRegion(file, name, source), `${file}${source.ext} has no region "${name}"`).toBe(true);
    }
  });

  it("never types TypeScript or JavaScript into a lesson: it comes from the checked project", () => {
    for (const [file, source] of sources) {
      expect(source, `${file} has a ts/js code fence`).not.toMatch(/^```(ts|tsx|typescript|js|jsx|javascript)\b/m);
    }
  });

  it("has a test for every TypeScript lesson file", () => {
    const files = readdirSync(projectDir);
    for (const f of files.filter((n) => /^lesson\d+-.*\.ts$/.test(n) && !n.endsWith(".test.ts"))) {
      expect(files, `no test for ${f}`).toContain(f.replace(".ts", ".test.ts"));
    }
  });

  it("has a JavaScript file for every TypeScript lesson file", () => {
    const js = readdirSync(join(projectDir, "js"));
    for (const f of readdirSync(projectDir).filter((n) => /^lesson\d+-.*\.ts$/.test(n) && !n.endsWith(".test.ts"))) {
      expect(js, `no JavaScript for ${f}`).toContain(f.replace(".ts", ".js"));
    }
  });

  it("gives every expected-error file its two header lines and one marked line", () => {
    const errors = join(projectDir, "errors");
    for (const f of readdirSync(errors)) {
      const text = readFileSync(join(errors, f), "utf8");
      expect(text, f).toMatch(/^\/\/ expect-error: TS\d+$/m);
      expect(text, f).toMatch(/^\/\/ expect-message: .+$/m);
      expect(text.match(/\/\/ @error\s*$/gm)?.length ?? 0, f).toBe(1);
    }
  });
});

describe("Switch writing rules", () => {
  it("never uses an em-dash anywhere in the section", () => {
    const folders = [projectDir, join(projectDir, "js"), join(projectDir, "errors")];
    const files = [
      ...[...sources].map(([name, text]) => [name, text] as const),
      ...folders.flatMap((d) =>
        readdirSync(d, { withFileTypes: true })
          .filter((e) => e.isFile())
          .map((e) => [e.name, readFileSync(join(d, e.name), "utf8")] as const),
      ),
      ["curriculum", JSON.stringify(switchCourse)] as const,
      ["resources", JSON.stringify(resources)] as const,
    ];
    for (const [name, text] of files) {
      expect(text, `${name} has an em-dash`).not.toContain(EM_DASH);
    }
  });

  it("makes no claim about outcomes or jobs", () => {
    const banned = /\b(guarantee|guaranteed|get hired|get placed|land a job|crack|100%|higher salary|better pay)\b/i;
    for (const [file, source] of sources) {
      expect(source, `${file} makes an outcome claim`).not.toMatch(banned);
    }
  });

  it("credits VeraStack Labs on the course", () => {
    expect(switchCourse.provider.name).toBe("VeraStack Labs");
    expect(switchCourse.provider.url).toBe("https://verastack.dev");
  });
});

describe("Switch on the Resources page", () => {
  it("is the third card, with its descriptor and the topic pills from the plan", () => {
    const card = resources[2];
    expect(card.name).toBe("The Switch");
    expect(card.descriptor).toBe("JavaScript to TypeScript");
    expect(card.href).toBe("/learn/js-to-ts/");
    expect(card.topics).toEqual([
      "Why switch", "Setup", "Types", "Objects", "Functions", "Unions", "Narrowing",
      "null and undefined", "Generics", "Utility types", "unknown vs any", "Migrating",
      "Cheat sheet",
    ]);
  });
});
