import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

/**
 * The lesson files, read at build time.
 *
 * Node-only. Every route that uses this is prerendered, so the files are read
 * once during `next build` and nothing is fetched in the browser.
 */
const DIR = join(process.cwd(), "src", "content", "learn", "rust-dsa");

export type Lesson = {
  slug: string;
  /** The page heading. */
  title: string;
  /** The line under the heading. */
  sub: string;
  /** For search results and link previews. */
  description: string;
  order: number;
  part: number;
  /** ISO date, YYYY-MM-DD. */
  updated: string;
  /** The MDX body, front matter removed. */
  body: string;
};

export function parseLesson(raw: string, file: string): Lesson {
  const { data, content } = matter(raw);
  const str = (key: string) => {
    const value = data[key];
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(`${file}: front matter "${key}" must be a non-empty string`);
    }
    return value;
  };
  const num = (key: string) => {
    const value = data[key];
    if (typeof value !== "number" || !Number.isInteger(value)) {
      throw new Error(`${file}: front matter "${key}" must be a whole number`);
    }
    return value;
  };
  // YAML turns a bare date into a Date; keep it as the plain text it was.
  const updated =
    data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : str("updated");

  return {
    slug: str("slug"),
    title: str("title"),
    sub: str("sub"),
    description: str("description"),
    order: num("order"),
    part: num("part"),
    updated,
    body: content,
  };
}

let cached: Lesson[] | null = null;

/** Every published lesson, in teaching order. */
export function getLessons(): Lesson[] {
  if (!cached) {
    cached = readdirSync(DIR)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => parseLesson(readFileSync(join(DIR, f), "utf8"), f))
      .sort((a, b) => a.order - b.order);
  }
  return cached;
}

export function getLesson(slug: string): Lesson | undefined {
  return getLessons().find((l) => l.slug === slug);
}
