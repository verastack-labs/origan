import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { rustCourse, type Course } from "@/data/courses";

/**
 * The lesson files of a course, read at build time. With no course given, it
 * is DSA in Rust, which is how the section worked before there was a second.
 *
 * Node-only. Every route that uses this is prerendered, so the files are read
 * once during `next build` and nothing is fetched in the browser.
 */
const dirOf = (course: Pick<Course, "contentDir">) => join(process.cwd(), ...course.contentDir);

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

const cached = new Map<string, Lesson[]>();

/** Every published lesson of a course, in teaching order. */
export function getLessons(course: Pick<Course, "id" | "contentDir"> = rustCourse): Lesson[] {
  // In development the files are read each time, so an edit to a lesson shows on reload.
  let lessons = process.env.NODE_ENV === "development" ? undefined : cached.get(course.id);
  if (!lessons) {
    const dir = dirOf(course);
    lessons = readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => parseLesson(readFileSync(join(dir, f), "utf8"), f))
      .sort((a, b) => a.order - b.order);
    cached.set(course.id, lessons);
  }
  return lessons;
}

export function getLesson(
  slug: string,
  course: Pick<Course, "id" | "contentDir"> = rustCourse,
): Lesson | undefined {
  return getLessons(course).find((l) => l.slug === slug);
}
